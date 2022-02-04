package controllers;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import com.google.gson.Gson;

import core.contracts.requests.InboundChatMessageDTO;
import core.contracts.responses.NotificationDTO;
import core.contracts.responses.OutboundChatMessageDTO;
import core.model.User;
import core.services.ChatService;
import database.DbContext;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import security.TokenService;

@ServerEndpoint("/chat")
public class ChatController 
{
    public static ChatController instance;

    TokenService tokenService;
    ChatService chatService;
    DbContext context;

    public static Map<Session, UUID> sessionToUsers = new HashMap<>();
    public static Map<UUID, Session> usersToSession = new HashMap<>();
    private static Gson gson = new Gson();

    public ChatController()
    {
        context = DbContext.instance;
        tokenService = new TokenService(context);
        chatService = new ChatService(context);
        instance = this;
    }

    @OnClose
    public void onClose(Session session)
	{
		try 
		{
			String token = session.getQueryString().substring("token=".length());
			Jws<Claims> jwt = tokenService.parseAccesToken(token);

			if (jwt != null)
			{
				UUID userId = UUID.fromString(jwt.getBody().getSubject());
				sessionToUsers.remove(session);
				usersToSession.remove(userId);
				
				session.close();
				return;
			}
		} catch (IOException e) 
		{
			e.printStackTrace();
		}
    }

    @OnError
    public void onError(Session session, Throwable throwable)
    {
        try {
            session.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @OnOpen
    public void onOpen(Session session)
    {
        String token = session.getQueryString().substring("token=".length());

        Jws<Claims> jwt = tokenService.parseAccesToken(token);
        if (jwt != null)
        {
            UUID userId = UUID.fromString(jwt.getBody().getSubject());
            User user  = context.users.find(userId);
            
            if (user != null)
            {
                sessionToUsers.put(session, user.getId());
                usersToSession.put(user.getId(), session);
                System.out.println("User connected with id: " + user.getId().toString());
                return;
            }
        }
        try 
        {
            session.close(new CloseReason(CloseReason.CloseCodes.UNEXPECTED_CONDITION, "Unauthorized"));
        } 
        catch (IOException e) 
        {
            e.printStackTrace();
        }  
    }

    // @OnClose
    // public void onClose(Session session) {}

    @OnMessage
    public void onMessage(String message, Session session) 
    {
        //determine type of message, read or content
        InboundChatMessageDTO inbound = gson.fromJson(message, InboundChatMessageDTO.class);
        
        UUID userId = sessionToUsers.get(session);
        OutboundChatMessageDTO outbound = chatService.createMessage(inbound, userId);
        String jsonMessage = gson.toJson(outbound);

        for (UUID id : outbound.recipientIds)
        {
            if (isUserOnline(id)) {
                usersToSession.get(id).getAsyncRemote().sendText(jsonMessage);
            }
        }
    }

    public boolean isUserOnline(UUID userId) 
    {
        return usersToSession.containsKey(userId);
    }

    public boolean messageFromRest(
        UUID conversationId, User sender,
        User recipient, String content
    )
    {
        if (!isUserOnline(sender.getId()) ||
            !isUserOnline(recipient.getId())) return false;

        InboundChatMessageDTO message = new InboundChatMessageDTO(conversationId, (byte) 0, content);
        onMessage(gson.toJson(message), usersToSession.get(sender.getId()));

        return true;
    }

    public boolean notificationFromRest(User recipient)
    {
        if (!isUserOnline(recipient.getId())) return false;
        usersToSession.get(recipient.getId())
        .getAsyncRemote()
        .sendText(gson.toJson(new NotificationDTO()));
        
        return true;
    }
}