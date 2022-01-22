package controllers;

import java.io.File;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import core.contracts.requests.UserEditDTO;
import core.contracts.responses.FriendRequestDTO;
import core.contracts.responses.UserDTO;
import core.model.FriendRequest;
import core.model.Friendship;
import core.model.User;
import core.model.FriendRequest.Status;
import core.model.User.Role;
import core.queries.ConversationQueries;
import core.queries.UserQueries;
import core.services.MediaService;
import database.DbContext;
import io.swagger.annotations.Api;
import security.Authorize;

/* 
    - pretraga korisnika
    - feed
    - admin delete post button 
    - chat seen ptr -- when is read called?
    - conversation: how do we mark for new messages? + prefetch the last one
    - recommended friends -- frequency? USERDTO
    - cookies not working
    - auth on images
*/
@Api(tags = "Users")
@Path("/users")
public class UserController extends ControllerBase 
{
    @Inject UserQueries userQueries;
    @Inject ConversationQueries conversationQueries;
    @Inject MediaService mediaService;
    @Inject DbContext context;

    @GET
    @Path("/search")
    @Authorize(allowAnonymous = true)
    @Produces(MediaType.APPLICATION_JSON)
    public Response search(
        @QueryParam("query") String query,
        @QueryParam("startDate") String startDate,
        @QueryParam("endDate") String endDate,
        @QueryParam("order") String order
    )
    {
        Stream<User> users = context.users.toStream()
        .filter(u ->
            u.getUsername().toLowerCase().contains(query.toLowerCase()) ||
            u.getFullName().toLowerCase().contains(query.toLowerCase())      
        );

        if (startDate != null) 
        {
            users = users.filter(u -> u.getDateOfBirth().isAfter(LocalDate.parse(startDate)));
        }

        if (endDate != null) 
        {
            users = users.filter(u -> u.getDateOfBirth().isBefore(LocalDate.parse(endDate)));
        }
        
        if ("first-name".equals(order))
        {
            users = users.sorted((u1, u2) -> u1.getFirstName().compareTo(u2.getFirstName()));
        }
        else if ("last-name".equals(order))
        {
            users = users.sorted((u1, u2) -> u1.getLastName().compareTo(u2.getLastName()));
        }
        else if ("date-of-birth".equals(order))
        {
            users = users.sorted((u1, u2) -> u1.getDateOfBirth().compareTo(u2.getDateOfBirth()));
        }

        users = users.limit(10);

        return ok(
            users.map(u -> new UserDTO(u).setIsFriend(userQueries.areFriends(u, authenticatedUser())))
            .collect(Collectors.toList())
        );
    }

    @GET
    @Path("/recommended")
    @Authorize
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRecommendedFriends() 
    {
        return ok(userQueries.getRecomendedFriends(authenticatedUser()));
    }

    @GET
    @Path("/{username}")
    @Authorize(allowAnonymous = true)
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("username") String username)
    {
        User viewed = userQueries.findByUsername(username);
        if (viewed == null) 
        {
            return badRequest();
        }

        UserDTO user = userQueries.getUserAs(
            authenticatedUser(),
            viewed
        );

        return ok(user);
    }

    @GET
    @Path("/{username}/profile-image")
    @Produces("image/*")
    public Response getProfileImage(@PathParam("username") String username)
    {
        User user = userQueries.findByUsername(username);
        if (user == null)
        {
            return badRequest();
        }
        
        File image = mediaService.getImage(user.getImageURL());
        if (image == null)
        {
            return noContent();
        }

        return physicalFile(image);
    }

    @GET
    @Path("/{username}/friends")
    @Authorize(allowAnonymous = true)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFriends(@PathParam("username") String username)
    {
        User viewer = authenticatedUser();
        User viewed = userQueries.findByUsername(username);

        if (viewed == null) return badRequest("User does not exist.");

        if (viewed.isPrivate() && !userQueries.areFriends(viewed, viewer) && !viewed.equals(viewer))
        {
            return forbidden();
        }
        
        return ok(userQueries.getFriendsAs(viewed, authenticatedUser()));
    }

    @GET
    @Path("/{username}/friends/mutual")
    @Authorize
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMutualFriends(@PathParam("username") String username)
    {
        User viewed = userQueries.findByUsername(username);
        User viewer = authenticatedUser();
        
        if (viewed == null) 
        {
            return notFound();
        }

        if (viewed.isPrivate() && !userQueries.areFriends(viewed, viewer))
        {
            return forbidden();
        }

        return ok(userQueries.getMutualFriends(viewer, viewed));       
    }
    
    @POST
    @Path("/{username}/ban")
    @Authorize({ Role.Admin })
    @Produces(MediaType.APPLICATION_JSON)
    public Response ban(@PathParam("username") String username)
    {
        User user = userQueries.findByUsername(username);

        if (user == null) return notFound();

        user.ban();
        context.addOrUpdate(user);

        return ok();
    }

    @POST
    @Path("/{username}/add")
    @Authorize
    @Produces(MediaType.APPLICATION_JSON)
    public Response addFriend(@PathParam("username") String username)
    {
        User recipient = userQueries.findByUsername(username);
        User sender = authenticatedUser();

        if (recipient == null) return notFound();

        if (recipient.equals(sender)) 
        {
            return badRequest("You are already friends with yourself.");
        }
        FriendRequest fr = userQueries.getFriendRequest(recipient, sender);
        if (fr != null && fr.getStatus().equals(Status.Pending))
        {
            return badRequest("Friend request for user already exists.");
        }
        if (userQueries.areFriends(recipient, sender))
        {
            return badRequest("You are already friends.");
        }

        FriendRequest friendRequest = new FriendRequest(sender, recipient);

        ChatController.instance.notificationFromRest(recipient);

        context.addOrUpdate(friendRequest);
        
        return ok(new FriendRequestDTO(friendRequest));
    }

    @POST
    @Path("/{username}/remove")
    @Authorize
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeFriend(@PathParam("username") String username)
	{
		User recipient = userQueries.findByUsername(username);
		User sender = authenticatedUser();

		if (recipient == null) return notFound();

		FriendRequest friendRequest = userQueries.getFriendRequest(recipient, sender);
		if (friendRequest != null) 
        {
            friendRequest.reject();
			friendRequest.delete();
			context.addOrUpdate(friendRequest);
		}

		Friendship friendship = userQueries.getFriendshipBetween(recipient, sender);

		if (friendship != null) 
        {
			friendship.cancel();
			context.addOrUpdate(friendship);
		}

		if (friendship == null && friendRequest == null) 
        {
			return badRequest("You are not friends and no friend request is pending.");
		}

		return ok(new FriendRequestDTO(friendRequest));
	}

	
	@POST
    @Path("/edit")
    @Authorize
	@Produces(MediaType.APPLICATION_JSON)
	public Response editProfile(UserEditDTO request) 
	{
		User user = authenticatedUser();
		if (user == null) 
		{
			return badRequest();
		}

		boolean paramsValid = Stream.of(request.email, request.fullName, request.dateOfBirth)
			.filter(p -> p != null)
			.filter(p -> p.trim().length() != 0)
			.count() == 3;
		
		paramsValid &= request.gender != null;

		try
		{
			LocalDate.parse(request.dateOfBirth);
		} 
		catch(DateTimeParseException  e)
		{
			return badRequest("Invalid date of birth.");
		}

		if (!paramsValid)
		{
			return badRequest("Fields cannot be empty.");
		}

		if (!user.getEmail().equals(request.email))
		{
			User existing = userQueries.findByEmail(request.email);
			if(existing != null) 
			{
				return badRequest("Another account is using " + request.email + ".");
			}
		}

		user.changeEmail(request.email);
		user.setPrivate(request.isPrivate);
		user.setFullName(request.fullName);
		user.setGender(request.gender);
		user.setDateOfBirth(LocalDate.parse(request.dateOfBirth));

		context.addOrUpdate(user);

		return ok();
	}
		
}	
