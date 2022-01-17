package core.contracts.responses;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import core.model.*;
import core.model.User.Role;

public class ConversationDTO
{
    public transient Conversation conversation;

    public UUID id;
    public String seenPointer = "";
    public boolean hasUnread;
    public boolean byAdmin;

    public UserDTO sender;
    public UserDTO recipient;

    public List<OutboundChatMessageDTO> messages;

    public ConversationDTO(Conversation c, User viewer) 
    {
        conversation = c;
        id = c.getId();

        if (c.getSeenPointer() != null) {
            seenPointer = c.getSeenPointer().toString();
        }

        byAdmin = c.getMembers().stream()
        .filter(m -> !m.equals(viewer))
        .filter(m -> m.getRole().equals(Role.Admin))
        .findAny()
        .isPresent();

        Message newestMessage = c.getMessages().stream()
        .sorted((m1, m2) -> m2.getSentAt().compareTo(m1.getSentAt()))
        .findFirst()
        .orElse(null);

        if(newestMessage != null)
        {   
            hasUnread = !newestMessage.getId().toString().equals(seenPointer) &&
            !newestMessage.getSender().equals(viewer);
        }

        sender = new UserDTO(viewer);
        recipient = c.getOtherMembers(viewer)
            .stream()
            .map(u -> new UserDTO(u))
            .findFirst()
            .get();

        messages = c.getMessages()
            .stream()
            .sorted((m1, m2) -> m2.getSentAt().compareTo(m1.getSentAt()))
            .limit(15)
            .map(m -> new OutboundChatMessageDTO(m, c.getId(), (byte) 0))
            .collect(Collectors.toList());
    }
}
