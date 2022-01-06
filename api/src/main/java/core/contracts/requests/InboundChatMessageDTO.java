package core.contracts.requests;

import java.util.UUID;

public class InboundChatMessageDTO 
{
    public UUID conversationId;
    public String content;

    public InboundChatMessageDTO(UUID conversationId, String content) 
    {
        this.conversationId = conversationId;
        this.content = content;
    }
}
