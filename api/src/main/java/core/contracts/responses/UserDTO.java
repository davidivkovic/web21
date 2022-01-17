package core.contracts.responses;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import javax.ws.rs.core.UriBuilder;

import context.ContextHelper;
import controllers.UserController;
import core.model.User;
import core.model.User.Role;

public class UserDTO 
{   
    public transient User user;
    public UUID id;
    public String username;
    public String fullName;
    public String email;
    public String dateOfBirth;
    public User.Gender gender;
    public String imageURL;
    public boolean isPrivate;
    public boolean isBanned;
    public boolean isAdmin;

    public boolean isFriend;
    public int friendsCount;
    public int mutualsCount;
    public int postsCount;
    public FriendRequestDTO friendRequest;

    public List<PostDTO> posts;
    public List<UserDTO> friends;
    public List<UserDTO> mutualFriends;

    public boolean isSuggestion;

    public UserDTO(User u)
    {
        user = u;
        id = u.getId();
        username = u.getUsername();
        fullName = u.getFullName();
        email = u.getEmail();
        dateOfBirth = u.getDateOfBirth().toString();
        gender = u.getGender();

        posts = new ArrayList<>();
        friends = new ArrayList<>();
        mutualFriends = new ArrayList<>();

        imageURL = ContextHelper.getInstance().getBaseUrl() + UriBuilder
        .fromResource(UserController.class)
        .path(UserController.class, "getProfileImage")
        .resolveTemplate("username", username)
        .build()
        .toString()
        .substring(1) + "?nonce=" + ThreadLocalRandom.current().nextInt();

        isPrivate = u.isPrivate();
        isBanned = u.getIsBanned();
        isAdmin = u.getRole().equals(Role.Admin);
        isFriend = false;
        isSuggestion = false;
    }

    public UserDTO noNonce()
    {
        imageURL = imageURL.split("\\?nonce=")[0];
        return this;
    }

    public UserDTO includeFriendRequest(FriendRequestDTO request)
    {
        friendRequest = request;
        return this;
    }

    public UserDTO includeFriendsCount(int count)
    {
        friendsCount = count;
        return this;
    }

    public UserDTO includePostsCount(int count)
    {
        postsCount = count;
        return this;
    }

    public UserDTO setIsFriend(boolean status)
    {
        isFriend = status;
        return this;
    }

    public UserDTO includePosts(List<PostDTO> posts)
    {
        this.posts = posts;
        return this;
    }

    public UserDTO includeFriends(List<UserDTO> friends)
    {
        this.friends = friends;
        return this;
    }

    public UserDTO includeMutualFriends(List<UserDTO> mutualFriends)
    {
        this.mutualFriends = mutualFriends;
        return this;
    }   
}