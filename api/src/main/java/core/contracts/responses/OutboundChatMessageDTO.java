package core.contracts.responses;

import java.util.List;
import java.util.UUID;

import core.model.Message;

public class OutboundChatMessageDTO
{
    public transient List<UUID> recipientIds;

    public String content;
    public UUID id;
    public UUID conversationId;
    public UUID senderId;
    public String sentAt;
    public byte type;

    public OutboundChatMessageDTO(Message m, UUID conversationID, byte type) 
    {
        this.type = type;
        conversationId = conversationID;
        id = m.getId();
        content = m.getContent();
        senderId = m.getSender().getId();
        sentAt = m.getSentAt().toString();
    }
}