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
        Message message = convo.sendMessage(sender, inbound.content);

        context.addOrUpdate(message);
        context.addOrUpdate(convo);

        OutboundChatMessageDTO outbound = new OutboundChatMessageDTO(message);
        outbound.recipientIds = convo.getOtherMembers(sender)
        .stream()
        .map(u -> u.getId())
        .collect(Collectors.toList());

        return outbound;
    }
    
}
