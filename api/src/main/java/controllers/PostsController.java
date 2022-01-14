package controllers;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import core.contracts.responses.CommentDTO;
import core.contracts.responses.ConversationDTO;
import core.contracts.responses.PostDTO;
import core.model.Comment;
import core.model.Conversation;
import core.model.Message;
import core.model.Post;
import core.model.User;
import core.model.User.Role;
import core.queries.ConversationQueries;
import core.queries.MediaQueries;
import core.queries.UserQueries;
import core.services.ChatService;
import core.services.MediaService;
import database.DbContext;
import io.swagger.annotations.Api;
import security.Authorize;

@Api(tags = "Posts")
@Path("/posts")
public class PostsController extends ControllerBase
{
    @Inject DbContext context;
    @Inject MediaQueries mediaQueries;
    @Inject UserQueries userQueries;
    @Inject MediaService mediaService;
    @Inject ConversationQueries conversationQueries;
    @Inject ChatService chatService;

    @GET
    @Path("/{id}")
    @Authorize(allowAnonymous = true)
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("id") UUID id)
    {
        Post post = context.posts.find(id);
        if(post == null)
        {
            return notFound();
        }

        if (post.getPoster().isPrivate() && 
           !userQueries.areFriends(post.getPoster(), authenticatedUser()))
        {
            return forbidden();
        }

        return ok(new PostDTO(post));
    }

    @POST
    @Path("/upload")
    @Authorize
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadPost(
        @FormDataParam("image") File image,
        @FormDataParam("image") FormDataBodyPart body,
        @FormDataParam("caption") String caption
    ) throws IOException
    {
        // Files.copy(is, Paths.get("C:/Users/HUAWEI/Desktop", "proba.jpeg"), StandardCopyOption.REPLACE_EXISTING);
        UUID imageId = UUID.randomUUID();
        boolean success = mediaService.saveImage(
            image,
            body.getMediaType().toString(),
            imageId
        );

        if (!success) return badRequest("Something went wrong");

        Post post = new Post(caption, imageId.toString(), authenticatedUser());
        context.addOrUpdate(post);

        return ok(new PostDTO(post));
    }

    @GET
    @Path("/{id}/image")
    @Authorize(allowAnonymous = true)
    @Produces("image/*")
    public Response getImage(@PathParam("id") UUID id)
    {
        Post post = context.posts.find(id);
        if(post == null)
        {
            return notFound();
        }

        if (post.getPoster().isPrivate() && 
           !userQueries.areFriends(post.getPoster(), authenticatedUser()))
        {
            return forbidden();
        }

        return physicalFile(mediaService.getImage(post.getImageURL()));
    }

    @POST
    @Authorize
    @Path("/{id}/comments/add")
    @Produces(MediaType.APPLICATION_JSON)
    public Response addComment(@PathParam("id") UUID id, String content)
    {
        Post post = context.posts.find(id);
        if(post == null)
        {
            return notFound();
        }

        User user = authenticatedUser();
        Comment comment = post.comment(user, content);

        context.addOrUpdate(comment);
        context.addOrUpdate(post);

        return ok(new CommentDTO(comment));
    }

    @DELETE
    @Authorize 
    @Path("/{id}/comments/{commentId}/delete")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteComment(
        @PathParam("id") UUID id,
        @PathParam("commentId") UUID commentId
    )
    {
        Post post = context.posts.find(id);
        Comment comment = context.comments.find(commentId);
        if (post == null || comment == null)
        {
            return notFound();
        }

        User user = authenticatedUser();
        if (!comment.getCommenter().equals(user))
        {
            return forbidden();
        }

        comment.delete();
        context.addOrUpdate(comment);
        context.addOrUpdate(post);

        return ok();
    }

    @DELETE
    @Path("/{id}/delete")
    @Authorize({ Role.Admin, Role.User })
    @Produces(MediaType.APPLICATION_JSON)
    public Response delete(@PathParam("id") UUID id, String reason)
    {
        Post post = context.posts.find(id);
        if (post == null)
        {
            return notFound();
        }

        User user = authenticatedUser();
        User poster = post.getPoster();
        boolean isAdmin = user.getRole().equals(Role.Admin);

        if (!poster.equals(user) || !isAdmin)
        {
            return forbidden();
        }

        if (isAdmin && !poster.equals(user))
        {
            ConversationDTO conversation = conversationQueries.getConversation(user, user, poster);
            if (conversation == null)
            {
                conversation = chatService.createConversation(user, poster);
            }
    
            boolean success = ChatController.instance.messageFromRest(
                conversation.id,
                user,
                poster,
                reason
            );

            if(!success) {
                Conversation c = context.conversations.find(conversation.id);
                Message m = c.sendMessage(user, reason);
                context.addOrUpdate(m);
                context.addOrUpdate(c);
            }
        }

        post.delete();
        post.deleteAllComments();
        context.addOrUpdate(post);
        context.addOrUpdateRange((Comment[]) post.getComments().toArray());

        return ok();
    }

    
    @POST
    @Authorize
    @Path("/{id}/set-as-pfp")
    @Produces(MediaType.APPLICATION_JSON)
    public Response setAsProfilePicture(@PathParam("id") UUID id)
    {
        Post post = context.posts.find(id);
        if (post == null)
        {
            return notFound();
        }

        User user = authenticatedUser();
        if (!post.getPoster().equals(user))
        {
            return unauthorized();
        }

        user.setImageURL(post.getImageURL());
        context.addOrUpdate(user);

        // return physicalFile(mediaService.getImage(post.getImageURL()));
        return ok();
    }

    @GET
    @Authorize
    @Path("/feed")
    public Response feed(LocalDateTime before)
    {
        if (before == null) before = LocalDateTime.now();
        return ok(mediaQueries.getFeed(authenticatedUser(), before));
    }
}
