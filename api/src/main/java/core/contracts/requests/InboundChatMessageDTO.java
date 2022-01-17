package core.contracts.requests;

import java.util.UUID;

public class InboundChatMessageDTO 
{
    /*
        0 -> new_text_message
        1 -> seen_pointer_increment
    */
    public byte type;
    public UUID conversationId;
    public String content;

    public InboundChatMessageDTO(UUID conversationId, byte type, String content) 
    {
        this.conversationId = conversationId;
        this.type = type;
        this.content = content;
    }
}
