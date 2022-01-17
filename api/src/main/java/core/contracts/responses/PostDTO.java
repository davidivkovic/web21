package core.contracts.responses;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.ws.rs.core.UriBuilder;

import context.ContextHelper;
import controllers.PostsController;
import core.model.Post;

public class PostDTO 
{
    public UUID id;
    public String caption;
    public String timestamp;
    public String imageURL;
    public List<CommentDTO> comments;
    public int commentCount;
    public UserDTO poster;

    public PostDTO(Post p) 
    {
        id = p.getId();
        caption = p.getContent();
        timestamp = p.getTimestamp().toString();
        poster = new UserDTO(p.getPoster());

        imageURL = ContextHelper.getInstance().getBaseUrl() + UriBuilder
        .fromResource(PostsController.class)
        .path(PostsController.class, "getImage")
        .resolveTemplate("id", p.getId())
        .build()
        .toString()
        .substring(1);

        comments = p.getComments().stream()
        .filter(c -> c != null)
        .filter(c -> c.isActive())
        .map(c -> new CommentDTO(c))
        .collect(Collectors.toList());

        commentCount = comments.size();
    }
}
