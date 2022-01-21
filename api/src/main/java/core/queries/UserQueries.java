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
import core.model.User.Role;
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
        // .filter(f -> f.getIsCurrent())
        .findFirst()
        .orElse(null);
    }

    public FriendRequest getFriendRequest(User recipient, User sender)
    {
        return context.friendRequests.toStream()
        .filter(fr -> fr.isBetween(recipient, sender))
        // .filter(fr -> fr.getRecipient().equals(recipient))
        // .filter(fr -> fr.getSender().equals(sender))
        .sorted((fr1, fr2) -> fr2.getTimestamp().compareTo(fr1.getTimestamp()))
        .findFirst()
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
        .filter(fr -> fr.getStatus().equals(Status.Pending) ||
                       areFriends(fr.getSender(), user))
        .collect(Collectors.groupingBy(fr -> fr.getSender().getId()))
        .values()
        .stream()
        .map(frList -> frList.stream().sorted((fr1, fr2) -> fr2.getTimestamp().compareTo(fr1.getTimestamp()))
                             .findFirst()
                             .get())
        .sorted((fr1, fr2) -> fr2.getStatus().compareTo(fr1.getStatus()))
        .sorted((fr1, fr2) -> fr2.getTimestamp().compareTo(fr1.getTimestamp()))
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

        if (areFriends || !viewed.isPrivate() || (viewer!=null && viewer.getRole().equals(Role.Admin)))
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
        if (a == null || b == null) return false;

        return context.friendships.toStream()
        .filter(f -> f.isBetween(a, b))
        .filter(f -> f.getIsCurrent())
        .findAny()
        .isPresent();
    }

    public List<UserDTO> getFriends(User user)
    {
        return context.friendships
                   .toStream()
                   .filter(f -> f.isPresent(user))
                   .filter(f -> f.getIsCurrent())
                   .map(f -> new UserDTO(f.getOtherUser(user)).setIsFriend(true))
                   .collect(Collectors.toList());
    }

    public List<UserDTO> getFriendsAs(User viewed, User viewer)
    {
        return getFriends(viewed).stream()
        .map(u -> {
            FriendRequest friendRequest = getFriendRequest(u.user, viewer);
            if(friendRequest != null)
            {
                u.friendRequest = new FriendRequestDTO(friendRequest);
            }
            return u.setIsFriend(areFriends(u.user, viewer));
        })
        .collect(Collectors.toList());
    }

    private List<User> mutuals(User viewer, User viewed)
    {
        List<User> viewersFriends = context.friendships
        .toStream()
        .filter(f -> f.isPresent(viewer))
        .filter(f -> f.getIsCurrent())
        .map(f -> f.getOtherUser(viewer))
        .collect(Collectors.toList());

        List<User> viewedFriends = context.friendships
            .toStream()
            .filter(f -> f.isPresent(viewed))
            .filter(f -> f.getIsCurrent())
            .map(f -> f.getOtherUser(viewed))
            .collect(Collectors.toList());

        viewersFriends.retainAll(viewedFriends);

        return viewersFriends;
    }

    public List<UserDTO> getMutualFriends(User viewer, User viewed)
    {
        return mutuals(viewer, viewed).stream()        
        .map(u -> new UserDTO(u).setIsFriend(areFriends(u, viewer)))
        .collect(Collectors.toList());
    }

    public List<UserDTO> getRecomendedFriends(User user)
    {
        List<UserDTO> recommended = context.friendships
        .toStream()
        .filter(f -> f.isPresent(user))
        .map(f -> f.getOtherUser(user))
        .flatMap(u -> {
            return context.friendships
            .toStream()
            .filter(f -> f.isPresent(u))
            .map(f -> f.getOtherUser(u));
        })
        .distinct()
        .collect(Collectors.toConcurrentMap(u -> u, u -> mutuals(u, user).size()))
        .entrySet()
        .stream()
        .filter(e -> !e.getKey().equals(user))
        .filter(e -> !areFriends(e.getKey(), user))
        .filter(e -> e.getValue() > 0)
        .sorted((countA, countB) -> countA.getValue().compareTo(countB.getValue()))
        .limit(5)
        .map(g -> 
        {
            UserDTO u = new UserDTO(g.getKey());
            u.isSuggestion = true;
            u.mutualsCount = g.getValue().intValue();
            FriendRequest friendRequest = getFriendRequest(g.getKey(), user);
            if(friendRequest != null)
            {
                u.friendRequest = new FriendRequestDTO(friendRequest);
            }
            return u;
        })
        .collect(Collectors.toList());

        if (recommended.size() == 0) {
            return context.users.toStream()
            .collect(Collectors.toMap(u -> u, u -> getFriends(u).size()))
            .entrySet()
            .stream()
            .filter(e -> !e.getKey().equals(user))
            .filter(e -> !areFriends(e.getKey(), user))
            .filter(e -> e.getValue() > 0)
            .sorted((countA, countB) -> countB.getValue().compareTo(countA.getValue()))
            .limit(5)
            .map(g -> 
            {
                UserDTO u = new UserDTO(g.getKey());
                u.mutualsCount = g.getValue().intValue();
                FriendRequest friendRequest = getFriendRequest(g.getKey(), user);
                if(friendRequest != null)
                {
                    u.friendRequest = new FriendRequestDTO(friendRequest);
                }
                return u;
            })
            .collect(Collectors.toList());
        }

        
        return recommended;
    }
}