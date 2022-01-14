package core.contracts.responses;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.ws.rs.core.UriBuilder;

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

        imageURL = "http://localhost:8080/api" + UriBuilder
        .fromResource(PostsController.class)
        .path(PostsController.class, "getImage")
        .resolveTemplate("id", p.getId())
        .build()
        .toString();

        comments = p.getComments().stream()
        .map(c -> new CommentDTO(c))
        .collect(Collectors.toList());

        commentCount = comments.size();
    }
}
