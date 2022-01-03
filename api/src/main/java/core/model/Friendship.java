package core.model;

public class Friendship extends Entity
{
    private User userA;
    private User userB;
    private boolean isCurrent;

    public Friendship(User a, User b)
    {
        userA = a;
        userB = b;
        isCurrent = true;
    }

    public void cancel()
    {
        isCurrent = false;
    }

    public boolean getIsCurrent()
    {
        return isCurrent;
    }
    
    public boolean isBetween(User a, User b)
    {
        if(a == null || b == null) return false;
        return (userA.equals(a) && userB.equals(b)) ||
               (userA.equals(b) && userB.equals(a));
    }
    
    public boolean isPresent(User u)
    {
        return userA.equals(u) || userB.equals(u);
    }

    public User getOtherUser(User u)
    {
        return userA.equals(u) ? userB : userA;
    }
}
