package core.contracts.responses;

import core.model.Message;

public class MessageDTO 
{
    private transient Message message;

    public String content;
    public String sentAt;
    public UserDTO sender;

    public MessageDTO(Message m) 
    {
        message = m;
        content = m.getContent();
        sentAt = m.getSentAt().toString();
        sender = new UserDTO(m.getSender());
    }
}
