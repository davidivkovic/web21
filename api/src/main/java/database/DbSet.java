package database;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import core.model.Entity;

public class DbSet<T extends Entity> 
{

    private Map<UUID, T> entities = new HashMap<>();

    public void init(List<T> list) 
    {
        addOrUpdateRange(list);
    }

    protected void addOrUpdateRange(List<T> entities) 
    {
        entities.stream().forEach(this::addOrUpdate);
    }

    protected void addOrUpdate(T entity) 
    {
        entities.put(entity.getId(), entity);
    }

    protected void remove(T entity)
    {
        entities.remove(entity.getId());
    }

    public T find(UUID id) 
    {
        T entity = entities.get(id);
        if (entity != null && entity.isActive()) return entity;
        return null;
    }

    public Stream<T> toStream() 
    {
        return entities.values().stream().filter(e -> e.isActive());
    }

    public List<T> toList() {
        return toStream().collect(Collectors.toList());
    }
}
