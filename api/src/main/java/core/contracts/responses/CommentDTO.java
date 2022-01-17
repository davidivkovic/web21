package core.contracts.responses;

import java.util.UUID;

import core.model.Comment;

public class CommentDTO 
{
    public UUID id;
    public UserDTO user;
    public String timestamp;
    public String content;

    public CommentDTO(Comment c)
    {
        id = c.getId();
        user = new UserDTO(c.getCommenter());
        timestamp = c.getTimestamp().toString();
        content = c.getContent();
    }
}
