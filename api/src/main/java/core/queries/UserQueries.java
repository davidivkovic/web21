package core.queries;

import java.util.List;
import java.util.stream.Collectors;

import javax.inject.Inject;

import core.contracts.responses.FriendRequestDTO;
import core.contracts.responses.PostDTO;
import core.contracts.responses.UserDTO;
import core.model.FriendRequest;
import core.model.Friendship;
import core.model.User;
import core.model.FriendRequest.Status;
import database.DbContext;

public class UserQueries 
{
    @Inject public DbContext context;

    /* Domain queries */ 
    public User findByUsername(String username)
    {
        return context.users.toStream()
        .filter(u -> u.getUsername().equals(username))
        .findFirst()
        .orElse(null);
    }

    public User findByEmail(String email)
    {
        return context.users.toStream()
        .filter(u -> u.getEmail().equals(email))
        .findFirst()
        .orElse(null);
    }

    public Friendship getFriendshipBetween(User a, User b)
    {
        return context.friendships.toStream()
        .filter(f -> f.isBetween(a, b))
        .filter(f -> f.getIsCurrent())
        .findFirst()
        .orElse(null);
    }

    public FriendRequest getFriendRequest(User recipient, User sender)
    {
        return context.friendRequests.toStream()
        .filter(fr -> fr.getSender().equals(sender) &&
                      fr.getRecipient().equals(recipient) &&
                      fr.getStatus() == Status.Pending)
        .findAny()
        .orElse(null);
    }

    public User getImageOwner(String imageId)
    {
        return context.posts.toStream()
        .filter(p -> p.getImageURL().equals(imageId))
        .map(p -> p.getPoster())
        .findFirst()
        .orElse(null);
    }

    /* Projection queries*/

    public List<FriendRequestDTO> getFriendRequests(User user)
    {
        return context.friendRequests.toStream()
        .filter(fr -> fr.getRecipient().equals(user))
        .map(fr -> new FriendRequestDTO(fr))
        .collect(Collectors.toList());
    }

    public UserDTO getUserAs(User viewer, User viewed)
    {
        UserDTO user = new UserDTO(viewed);

        List<PostDTO> posts = context.posts.toStream()
        .filter(p -> p.getPoster().equals(viewed))
        .sorted((p1, p2) -> p2.getTimestamp().compareTo(p1.getTimestamp()))
        .map(p -> new PostDTO(p))
        .collect(Collectors.toList());

        boolean areFriends = areFriends(viewer, viewed);
        if (areFriends) user.isFriend = true;

        if (areFriends || !viewed.isPrivate())
        {
            user = user.includePosts(posts);
        }

        FriendRequest friendRequest = getFriendRequest(viewed, viewer);
        if(friendRequest != null)
        {
            user.friendRequest = new FriendRequestDTO(friendRequest);
        }

        user.postsCount = posts.size();
        user.friendsCount = getFriends(viewed).size();
        user.mutualsCount = getMutualFriends(viewer, viewed).size();
        // // do not add posts and images
        return user;
    }

    public boolean areFriends(User a, User b)
    {
        return context.friendships.toStream()
        .filter(f -> f.isBetween(a, b))
        .findAny()
        .isPresent();
    }

    public List<UserDTO> getFriends(User user)
    {
        return context.friendships
                   .toStream()
                   .filter(f -> f.isPresent(user))
                   .map(f -> new UserDTO(f.getOtherUser(user)))
                   .collect(Collectors.toList());
    }

    public List<UserDTO> getMutualFriends(User viewer, User viewed)
    {
        return context.friendships.toStream()
        .filter(f -> !f.isBetween(viewer, viewed))
        .filter(f -> f.getIsCurrent())
        .filter(f -> f.isPresent(viewer) || f.isPresent(viewed))
        .map(f -> 
        {
            if (f.isPresent(viewer)) return f.getOtherUser(viewer);
            else return f.getOtherUser(viewed);
        })
        .map(u -> new UserDTO(u))
        .collect(Collectors.toList());
    }

    public List<UserDTO> getRecomendedFriends(User user)
    {
        return context.friendships
        .toStream()
        .filter(f -> f.isPresent(user))
        .map(f -> f.getOtherUser(user))
        .flatMap(u -> {
            return context.friendships
            .toStream()
            .filter(f -> f.isPresent(u))
            .map(f -> f.getOtherUser(u));
        })
        .collect(Collectors.groupingByConcurrent(u -> u, Collectors.counting()))
        .entrySet()
        .stream()
        .sorted((countA, countB) -> countA.getValue().compareTo(countB.getValue()))
        .limit(6)
        .map(g -> 
        {
            UserDTO u = new UserDTO(g.getKey());
            u.mutualsCount = g.getValue().intValue();
            return u;
        })
        .collect(Collectors.toList());
    }
}
