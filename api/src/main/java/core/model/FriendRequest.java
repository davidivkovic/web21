package core.model;

import java.time.LocalDateTime;

public class FriendRequest extends Entity
{
    public enum Status
    {
        Pending,
        Accepted,
        Rejected
    }

    private User sender;
    private User recipient;
    private LocalDateTime timestamp;
    private Status status;

    public FriendRequest(User sender, User recipient) 
    {
        this.sender = sender;
        this.recipient = recipient;
        timestamp = LocalDateTime.now();
        status = Status.Pending;
    }

    public boolean isBetween(User a, User b)
    {
        if(a == null || b == null) return false;
        return (sender.equals(a) && recipient.equals(b)) ||
               (sender.equals(b) && recipient.equals(a));
    }

    public void accept()
    {
        status = Status.Accepted;
    }

    public void reject()
    {
        status = Status.Rejected;
    }

    /* Getters */

    public User getSender() 
    {
        return sender;
    }

    public User getRecipient() 
    {
        return recipient;
    }

    public LocalDateTime getTimestamp()
    {
        return timestamp;
    }

    public Status getStatus() 
    {
        return status;
    }
}
