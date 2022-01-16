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
        /* 

        ako je seen ptr na mojoj poruci onda nemoj da ga apdejtujes
        ako nije na mojoj poruci gurni ga na njegovu poslednju

            Ako seen ptr nije na mojoj poslednjoj poruci
            onda je na njegovoj poslednjoj poruci

        */

        boolean seenPtrIsOnMe = messages.stream()
        .filter(m -> m.getSender().equals(user))
        .anyMatch(m -> m.getId().equals(seenPointer));

        if (!seenPtrIsOnMe) 
        {
            seenPointer = messages.stream()
            .filter(m -> !m.getSender().equals(user))
            .map(m -> m.getId())
            .reduce((first, second) -> second)
            .orElse(seenPointer);
        }
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

    public void setSeenPointer(UUID messageID)
    {
        seenPointer = messageID;
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