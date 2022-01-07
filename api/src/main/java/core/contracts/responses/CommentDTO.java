package core.contracts.responses;

import core.model.Comment;

public class CommentDTO 
{
    public UserDTO user;
    public String timestamp;
    public String content;

    public CommentDTO(Comment c)
    {
        user = new UserDTO(c.getCommenter());
        timestamp = c.getTimestamp().toString();
        content = c.getContent();
    }
}
