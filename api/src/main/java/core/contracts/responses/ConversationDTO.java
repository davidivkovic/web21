package core.contracts.responses;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import core.model.*;

public class ConversationDTO
{
    private transient Conversation conversation;

    public UUID id;
    public UUID seenPointer;
    public String lastMessageAt;
    public boolean hasUnread;
    public boolean byAdmin;

    public List<UserDTO> members;
    public List<MessageDTO> messages;

    public ConversationDTO(Conversation c, User viewer) 
    {
        conversation = c;
        id = c.getId();
        seenPointer = c.getSeenPointer();
        lastMessageAt = c.getLastMessageAt().toString();
        byAdmin = c.getMembers().stream()
        .filter(m -> !m.equals(viewer))
        .findAny()
        .isPresent();
        //  viewer.getRole().equals(Role.Admin);

        Message lastMessage = c.getMessages().stream()
        .sorted((m1, m2) -> m2.getSentAt().compareTo(m1.getSentAt()))
        .findFirst()
        .get();

        hasUnread = !seenPointer.equals(lastMessage.getId()) &&
                    !lastMessage.getSender().equals(viewer);

        members = c.getMembers()
            .stream()
            .map(u -> new UserDTO(u))
            .collect(Collectors.toList());
    }

    public ConversationDTO includeMessages()
    {
        messages = conversation.getMessages()
        .stream()
        .map(m -> new MessageDTO(m))
        .collect(Collectors.toList());

        return this;
    }
}
