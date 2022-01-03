package core.model;

import java.time.LocalDateTime;

import database.annotations.ForeignKey;

public class Comment extends Entity
{
    private String content;
    private LocalDateTime timestamp;
    
    @ForeignKey private User commenter;

    public Comment(User commenter, String content) 
    {
        this.commenter = commenter;
        this.content = content;
        this.timestamp = LocalDateTime.now();
    }

    public String getContent() 
    {
        return content;
    }

    public LocalDateTime getTimestamp() 
    {
        return timestamp;
    }

    public User getCommenter() 
    {
        return commenter;
    }
}
