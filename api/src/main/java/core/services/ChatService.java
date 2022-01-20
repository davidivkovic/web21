package core.services;

import java.util.UUID;
import java.util.stream.Collectors;

import javax.inject.Inject;

import core.contracts.requests.InboundChatMessageDTO;
import core.contracts.responses.ConversationDTO;
import core.contracts.responses.OutboundChatMessageDTO;
import core.model.Conversation;
import core.model.Message;
import core.model.User;
import database.DbContext;

public class ChatService 
{
    @Inject DbContext context;

    public ChatService() 
    {
        super();
    }

    public ChatService(DbContext context)
    {
        this.context = context;
    }

    public ConversationDTO createConversation(User inviter, User invited)
    {
        Conversation conversation = new Conversation(inviter, invited);
        context.addOrUpdate(conversation);

        return new ConversationDTO(conversation, inviter);
    }

    public OutboundChatMessageDTO createMessage(InboundChatMessageDTO inbound, UUID senderId)
    {
        User sender = context.users.find(senderId);
        Conversation convo = context.conversations.find(inbound.conversationId);
        Message message = null;
        /* 
          determine type of message, seen or content
          new_text_message = 0
          seen_pointer_increment = 1
        */
        if (inbound.type == 0) 
        {
            message = convo.sendMessage(sender, inbound.content);
            context.addOrUpdate(message);
        }
        else if (inbound.type == 1)
        {
            message = new Message(sender, inbound.content);
            UUID messageId = UUID.fromString(inbound.content);
            message.setId(messageId);
            convo.setSeenPointer(messageId);
        }

        context.addOrUpdate(convo);

        OutboundChatMessageDTO outbound = new OutboundChatMessageDTO(message, convo.getId(), inbound.type);
        outbound.recipientIds = convo.getOtherMembers(sender)
        .stream()
        .map(u -> u.getId())
        .collect(Collectors.toList());

        return outbound;
    }
    
}
