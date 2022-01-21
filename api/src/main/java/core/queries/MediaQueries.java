package core.queries;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import javax.inject.Inject;

import core.contracts.responses.PostDTO;
import core.model.User;
import database.DbContext;

public class MediaQueries 
{
    @Inject DbContext context;

    public List<PostDTO> getExplore(LocalDateTime before)
    {
        return context.posts.toStream()
        .filter(p -> !p.getPoster().isPrivate())
        .filter(p -> p.getTimestamp().isBefore(before))
        .sorted((postA, postB) -> postB.getTimestamp().compareTo(postA.getTimestamp()))
        .limit(12)
        .map(p -> new PostDTO(p))
        .collect(Collectors.toList());
    }

    public List<PostDTO> getPosts(User user)
    {
        return context.posts.toStream()
        .filter(p -> p.getPoster().equals(user))
        .sorted((p1, p2) -> p2.getTimestamp().compareTo(p1.getTimestamp()))
        .map(p -> new PostDTO(p))
        .collect(Collectors.toList());
    }

    public List<PostDTO> getFeed(User user, LocalDateTime before)
    {
        List<User> friends = context.friendships
        .toStream()
        .filter(f -> f.getIsCurrent())
        .filter(f -> f.isPresent(user))
        .map(f -> f.getOtherUser(user))
        .collect(Collectors.toList());

        return context.posts.toStream()
        .filter(p -> friends.contains(p.getPoster()) || p.getPoster().equals(user))
        .filter(p -> p.getTimestamp().isBefore(before))
        .sorted((postA, postB) -> postB.getTimestamp().compareTo(postA.getTimestamp()))
        .limit(10)
        .map(p -> new PostDTO(p))
        .collect(Collectors.toList());
    }
}
