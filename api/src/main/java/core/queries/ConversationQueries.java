package core.queries;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.inject.Inject;

import core.contracts.responses.ConversationDTO;
import core.model.*;
import database.DbContext;

public class ConversationQueries
{
    @Inject public DbContext context;

    public List<ConversationDTO> getConversations(User viewer)
    {
        return context.conversations.toStream()
        .filter(c -> c.getMembers().contains(viewer))
        .map(c -> new ConversationDTO(c, viewer))
        .sorted((c1, c2) -> c2.lastMessageAt.compareTo(c1.lastMessageAt))
        .collect(Collectors.toList());
    }

    public ConversationDTO getConversation(User viewer, User... members)
    {
        return context.conversations.toStream()
        .filter(c -> c.getMembers().containsAll(Arrays.asList(members)))
        .map(c -> new ConversationDTO(c, viewer))
        .findFirst()
        .get();
    }
}