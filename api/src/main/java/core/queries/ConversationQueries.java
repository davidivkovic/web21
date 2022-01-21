package core.queries;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.inject.Inject;

import core.contracts.responses.ConversationDTO;
import core.contracts.responses.OutboundChatMessageDTO;
import core.model.*;
import database.DbContext;

public class ConversationQueries
{
    @Inject public DbContext context;

    public int unreadCount(User viewer)
    {
        return (int) getConversations(viewer).stream().filter(c -> c.hasUnread).count();
    }

    public List<ConversationDTO> getConversations(User viewer)
    {
        return context.conversations.toStream()
        .filter(c -> c.getMembers().contains(viewer))
        .filter(c -> c.getLastMessageAt() != null)
        .sorted((c1, c2) -> c2.getLastMessageAt().compareTo(c1.getLastMessageAt()))
        .map(c -> new ConversationDTO(c, viewer))
        .collect(Collectors.toList());
    }

    public ConversationDTO getConversation(User viewer, User... members)
    {
        return context.conversations.toStream()
        .filter(c -> c.getMembers().containsAll(Arrays.asList(members)))
        .map(c -> new ConversationDTO(c, viewer))
        .findFirst()
        .orElse(null);
    }

    public List<OutboundChatMessageDTO> getMessagesBefore(
        Conversation conversation, LocalDateTime before
    )
    {
        return conversation.getMessages()
        .stream()
        .filter(m -> m.getSentAt().isBefore(before))
        .sorted((m1, m2) -> m2.getSentAt().compareTo(m1.getSentAt()))
        .limit(15)
        .map(m -> new OutboundChatMessageDTO(m, conversation.getId(), (byte) 0))
        .collect(Collectors.toList());
    }
}