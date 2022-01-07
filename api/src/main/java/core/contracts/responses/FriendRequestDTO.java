package core.contracts.responses;

import java.util.UUID;

import core.model.FriendRequest;
import core.model.FriendRequest.Status;

public class FriendRequestDTO 
{
    public UUID id;
    public String timestamp;
    public Status status;
    public UserDTO sender;

    public FriendRequestDTO(FriendRequest f) 
    {
        id = f.getId();
        timestamp = f.getTimestamp().toString();
        status = f.getStatus();
        sender = new UserDTO(f.getSender());
    }
}
