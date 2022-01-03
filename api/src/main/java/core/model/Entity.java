package core.model;

import java.util.UUID;

public class Entity extends Object 
{
    private UUID id;
    private boolean isActive;
    
    public Entity() 
    {
        id = UUID.randomUUID();
        isActive = true;
    }
    
    public Entity(UUID id) 
    {
        this.id = id;
    }
    
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public boolean isActive()
    {
        return isActive;
    }

    public void delete()
    {
        isActive = false;
    }

    @Override
    public boolean equals(Object obj) 
    {
        if (obj == null) return false;
        return id.equals(((Entity)obj).getId());
    }
}
