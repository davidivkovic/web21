package core.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import database.annotations.ForeignKey;

public class Conversation extends Entity
{
    private LocalDateTime lastMessageAt;
    private UUID seenPointer;

    @ForeignKey private List<User> members;
    @ForeignKey private List<Message> messages;

    public Conversation(User... members) 
    {
        this.members = new ArrayList<>();
        this.messages = new ArrayList<>();

        for (User member : members) 
        {
            this.members.add(member);
        }
    }

    public Message sendMessage(User sender, String content)
    {
        Message message = new Message(sender, content);
        lastMessageAt = message.getSentAt();
        messages.add(message);

        return message;
    }

    public void read(User user)
    {
        seenPointer = messages.stream()
        .filter(m -> !m.getSender().equals(user))
        .reduce((first, second) -> second)
        .get()
        .getId();
    }

    public List<User> getOtherMembers(User user)
    {
        return members.stream()
        .filter(u -> !u.equals(user))
        .collect(Collectors.toList());
    }

    /* Getters */

    public LocalDateTime getLastMessageAt()
    {
        return lastMessageAt;
    }

    public UUID getSeenPointer() 
    {
        return seenPointer;
    }

    public List<User> getMembers() 
    {
        return members;
    }

    public List<Message> getMessages() 
    {
        return messages;
    }
}