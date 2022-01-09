package controllers;

import java.io.File;
import java.util.UUID;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import core.contracts.responses.FriendRequestDTO;
import core.contracts.responses.UserDTO;
import core.model.FriendRequest;
import core.model.Friendship;
import core.model.User;
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
@Path("/users/{username}")
public class UserController extends ControllerBase 
{
    @Inject UserQueries userQueries;
    @Inject ConversationQueries conversationQueries;
    @Inject MediaService mediaService;
    @Inject DbContext context;

    @GET
    @Path("/")
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
    @Authorize(allowAnonymous = true)
    @Path("/profile-image")
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
    @Path("/friends")
    @Authorize(allowAnonymous = true)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFriends(@PathParam("username") String username)
    {
        User viewer = authenticatedUser();
        User viewed = userQueries.findByUsername(username);
        if (viewed.isPrivate() && !userQueries.areFriends(viewed, viewer))
        {
            return forbidden();
        }
        return ok(userQueries.getFriends(viewed));
    }

    @GET
    @Path("/friends/mutual")
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
    @Path("/ban")
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
    @Path("/add")
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
        if (userQueries.getFriendRequest(recipient, sender) != null)
        {
            return badRequest("Friend request for user already exists.");
        }
        if (userQueries.areFriends(recipient, sender))
        {
            return badRequest("You are already friends.");
        }

        FriendRequest friendRequest = new FriendRequest(sender, recipient);
        context.addOrUpdate(friendRequest);
        
        return ok(new FriendRequestDTO(friendRequest));
    }

    @POST
    @Path("/remove")
    @Authorize
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeFriend(@PathParam("username") String username)
    {
        User recipient = userQueries.findByUsername(username);
        User sender = authenticatedUser();

        if (recipient == null) return notFound();

        if (!userQueries.areFriends(recipient, sender))
        {
            return badRequest("You are not friends.");
        }
        
        Friendship friendship = userQueries.getFriendshipBetween(recipient, sender);
        friendship.cancel();

        context.addOrUpdate(friendship);
        
        return ok();
    }



    // User user = userQueries.context.users.find(id);
    // ConversationDTO conversation = conversationQueries.getConversation(
    //     authenticatedUser(),
    //     user
    // );


}
