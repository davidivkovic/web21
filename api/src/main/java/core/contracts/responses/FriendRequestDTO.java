package core.contracts.responses;

import java.util.UUID;

import core.model.FriendRequest;
import core.model.FriendRequest.Status;

public class FriendRequestDTO 
{
    public UUID id;
    public String timestamp;
    public boolean isAccepted;
    public boolean isRejected;
    public boolean isPending;
    public UserDTO sender;

    public FriendRequestDTO(FriendRequest f) 
    {
        id = f.getId();
        timestamp = f.getTimestamp().toString();
        isAccepted = f.getStatus().equals(Status.Accepted);
        isRejected = f.getStatus().equals(Status.Rejected);
        isPending = f.getStatus().equals(Status.Pending);
        sender = new UserDTO(f.getSender()).noNonce();
    }
}
