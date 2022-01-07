package core.contracts.responses;

import java.util.List;
import java.util.UUID;

import core.model.Message;

public class OutboundChatMessageDTO
{
    public transient List<UUID> recipientIds;

    public String content;
    public UUID conversationId;
    public UUID senderId;
    public String timestamp;

    public OutboundChatMessageDTO(Message m) 
    {
        content = m.getContent();
        conversationId = m.getId();
        senderId = m.getSender().getId();
        timestamp = m.getSentAt().toString();
    }
}