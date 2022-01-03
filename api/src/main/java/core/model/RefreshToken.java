package core.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class RefreshToken extends Entity 
{
    private LocalDateTime expires; 
    private User user;

    public RefreshToken(User u) 
    {
        setId(UUID.randomUUID());
        user = u;
        expires = LocalDateTime.now().plusMonths(3);
    }

    public void revoke()
    {
        delete();
    }

    public boolean hasExpired()
    {
        return expires.isBefore(LocalDateTime.now());
    }

    public boolean isValid()
    {
        return !hasExpired() && isActive();
    }

    public LocalDateTime getExpires()
    {
        return expires;
    }

    public User getUser()
    {
        return user;
    }

    @Override
    public String toString() {
        return getId().toString();
    }

}