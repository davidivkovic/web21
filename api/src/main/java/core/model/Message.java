package core.model;

import java.time.LocalDateTime;

import database.annotations.ForeignKey;

public class Message extends Entity
{
    private String content;
    private LocalDateTime sentAt;

    @ForeignKey private User sender;

    public Message(User sender, String content)
    {
        this.sender = sender;
        this.content = content;
        this.sentAt = LocalDateTime.now();
    }

    /* Getters */

    public String getContent() 
    {
        return content;
    }

    public LocalDateTime getSentAt() 
    {
        return sentAt;
    }

    public User getSender() 
    {
        return sender;
    }
}
