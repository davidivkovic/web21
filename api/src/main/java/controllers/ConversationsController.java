package controllers;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import core.contracts.responses.ConversationDTO;
import core.model.Conversation;
import core.model.User;
import core.queries.ConversationQueries;
import core.queries.UserQueries;
import database.DbContext;
import io.swagger.annotations.Api;
import security.Authorize;

@Api(tags = "Conversations")
@Path("/conversations")
public class ConversationsController extends ControllerBase
{
    @Inject ConversationQueries conversationQueries;
    @Inject UserQueries userQueries;
    @Inject DbContext context;
    
    @GET
    @Authorize
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get()
    {
        return ok(conversationQueries.getConversations(authenticatedUser()));
    }

    @GET
    @Authorize
    @Path("/unread-count")
    @Produces(MediaType.APPLICATION_JSON)
    public Response unreadCount()
    {
        return ok(conversationQueries.unreadCount(authenticatedUser()));
    }

    @GET
    @Authorize
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getConversation(@PathParam("id") UUID id)
    {
        Conversation conversation = context.conversations.find(id);
        if (conversation == null)
        {
            return badRequest();
        }

        User user = authenticatedUser();
        if (!conversation.getMembers().contains(user))
        {
            return forbidden();
        }

        conversation.read(user);
        context.addOrUpdate(conversation);

        return ok(new ConversationDTO(conversation, user));
    }

    @GET
    @Authorize
    @Path("/{id}/messages")
    public Response Messages(
        @PathParam("id") UUID conversationId,
        @QueryParam("before") String before
    )
    {
        Conversation conversation = context.conversations.find(conversationId);
        if (conversation == null)
        {
            return badRequest();
        }

        User user = authenticatedUser();
        if (!conversation.getMembers().contains(user))
        {
            return forbidden();
        }

        LocalDateTime beforeDateTime = LocalDateTime.now();
        if (before != null)
        {
            beforeDateTime = LocalDateTime.parse(before);
        }

        return ok(conversationQueries.getMessagesBefore(conversation, beforeDateTime));
    }

    @POST
    @Authorize
    @Path("/invite/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("username") String username)
    {
        User invited = userQueries.findByUsername(username);
        if (invited == null)
        {
            return badRequest();
        }

        User user = authenticatedUser();
        ConversationDTO existingConversation = conversationQueries.getConversation(user, user, invited);
        if (existingConversation != null)
        {
            return ok(existingConversation);
        }

        Conversation newConversation = new Conversation(user, invited);
        context.addOrUpdate(newConversation);
        
        return ok(new ConversationDTO(newConversation, user));
    }
}