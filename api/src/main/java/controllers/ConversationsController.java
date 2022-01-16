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

import core.contracts.responses.ConversationDTO;
import core.model.Conversation;
import core.model.User;
import core.queries.ConversationQueries;
import core.queries.UserQueries;
import database.DbContext;
import io.swagger.annotations.Api;
import security.Authorize;

@Authorize
@Api(tags = "Conversations")
@Path("/conversations")
public class ConversationsController extends ControllerBase
{
    @Inject ConversationQueries conversationQueries;
    @Inject UserQueries userQueries;
    @Inject DbContext context;
    
    @GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get()
    {
        return ok(conversationQueries.getConversations(authenticatedUser()));
    }

    @GET
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
        conversation.read(user);
        context.addOrUpdate(conversation);

        return ok(new ConversationDTO(conversation, user).includeMessages());
    }

    @POST
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