package core.queries;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.inject.Inject;

import core.contracts.responses.PostDTO;
import core.model.User;
import database.DbContext;

public class MediaQueries 
{
    @Inject DbContext context;

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
        Stream<User> friends = context.friendships
        .toStream()
        .filter(f -> f.isPresent(user))
        .map(f -> f.getOtherUser(user));

        return context.posts.toStream()
        .filter(p -> friends.anyMatch(f -> f.equals(p.getPoster())))
        .filter(p -> p.getTimestamp().isBefore(before))
        .sorted((postA, postB) -> postB.getTimestamp().compareTo(postA.getTimestamp()))
        .limit(10)
        .map(p -> new PostDTO(p))
        .collect(Collectors.toList());
    }
}
