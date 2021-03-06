package controllers;

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
import core.model.FriendRequest;
import core.model.Friendship;
import core.model.User;
import core.queries.UserQueries;
import database.DbContext;
import io.swagger.annotations.Api;
import security.Authorize;

@Authorize
@Api(tags = "Friendships")
@Path("/friend-requests")
public class FriendshipController extends ControllerBase
{
    @Inject DbContext context;
    @Inject UserQueries userQueries;

    @GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get()
    {
        User user = authenticatedUser();
        return ok(userQueries.getFriendRequests(user));
    }

    @GET
    @Path("/has-pending")
    @Produces(MediaType.APPLICATION_JSON)
    public Response hasPending()
    {
        User user = authenticatedUser();
        return ok(
            userQueries.getFriendRequests(user)
            .stream()
            .filter(fr -> fr.isPending)
            .count() > 0
        );
    }

    @POST
    @Path("/{id}/accept")
    @Produces(MediaType.APPLICATION_JSON)
    public Response acceptRequest(@PathParam("id") UUID id)
    {
        User user = authenticatedUser();
        FriendRequest friendRequest = context.friendRequests.find(id);

        if (!user.equals(friendRequest.getRecipient()))
        {
            return forbidden();
        }

        friendRequest.accept();
        context.addOrUpdate(friendRequest);

        Friendship friendship = userQueries.getFriendshipBetween(
            friendRequest.getRecipient(),
            friendRequest.getSender()
        );

        if (friendship != null) 
        {
            friendship.makeCurrent();
        } 
        else
        {
            friendship = new Friendship(
                friendRequest.getSender(),
                friendRequest.getRecipient()
            );
        }

        context.addOrUpdate(friendship);

        // ChatController.instance.notificationFromRest(friendRequest.getSender());

        return ok(new FriendRequestDTO(friendRequest));
    }

    @POST
    @Path("/{id}/decline")
    @Produces(MediaType.APPLICATION_JSON)
    public Response declineRequest(@PathParam("id") UUID id)
    {
        FriendRequest friendRequest = context.friendRequests.find(id);
        friendRequest.reject();
        context.addOrUpdate(friendRequest);

        return ok(new FriendRequestDTO(friendRequest));
    }
}
