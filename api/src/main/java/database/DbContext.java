package database;

import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import configuration.AppConfig;
import core.model.*;
import database.annotations.ForeignKey;
import database.serdes.GsonLocalDate;
import database.serdes.GsonLocalDateTime;

@SuppressWarnings("unchecked")
public class DbContext 
{
    public static DbContext instance;

    private Gson gson;
    private Map<Class<? extends Entity>, DbSet<? extends Entity>> dbSets = new HashMap<>();

    public DbSet<User> users = new DbSet<>();
    public DbSet<Friendship> friendships = new DbSet<>();
    public DbSet<Post> posts = new DbSet<>();
    public DbSet<Comment> comments = new DbSet<>();
    public DbSet<FriendRequest> friendRequests = new DbSet<>();
    public DbSet<Conversation> conversations = new DbSet<>();
    public DbSet<Message> messages = new DbSet<>();
    public DbSet<RefreshToken> refreshTokens = new DbSet<>();
    
    private void registerDbSets() 
    {
        dbSets.put(User.class, users);
        dbSets.put(Post.class, posts);
        dbSets.put(Comment.class, comments);
        dbSets.put(FriendRequest.class, friendRequests);
        dbSets.put(Conversation.class, conversations);
        dbSets.put(Message.class, messages);
        dbSets.put(RefreshToken.class, refreshTokens);
        dbSets.put(Friendship.class, friendships);
    }

    public DbContext()
    {
        gson = new GsonBuilder()
        .registerTypeAdapter(LocalDateTime.class, new GsonLocalDateTime())
        .registerTypeAdapter(LocalDate.class, new GsonLocalDate())
        .setPrettyPrinting()
        .create();

        registerDbSets();
        initDbSets();
        joinDbSets();

        instance = this;
    }

    private <T extends Entity> void initDbSets() 
    {
        dbSets.forEach((clazz, dbSet) -> ((DbSet<T>) dbSets.get(clazz)).init((List<T>)load(clazz)));
    }

    private void joinDbSets()
    {
        dbSets.forEach((clazz, dbSet) -> 
            Stream.of(clazz.getDeclaredFields())
            .filter(field -> field.isAnnotationPresent(ForeignKey.class))
            .forEach(field -> 
                dbSet.toStream().forEach(entity -> 
                {
                    if (field.getType() == List.class)
                    {
                        toRealEntityCollection(field, entity);
                    }
                    else if (field.getType() == Map.class)
                    {
                        toRealEntityMap(field, entity);
                    }
                    else
                    {
                        toRealEntity(field, entity);
                    }
                })
            )
        );
    }

    private <T extends Entity> void toRealEntityMap(Field field, Entity entity) 
    {
        try 
        {
            field.setAccessible(true);
            Map<UUID, ? extends Entity> entities = (Map<UUID, ? extends Entity>)field.get(entity);

            if(entities == null || entities.isEmpty()) return;
            
            Class<?> clazz = entities.values().toArray()[0].getClass();
            Map<UUID, T> realEntities = (Map<UUID, T>) entities.entrySet().stream()
                .map(entry -> dbSets.get(clazz).find(entry.getKey()))
                .collect(Collectors.toMap(e -> e.getId(), e -> e));
            field.set(entity, realEntities);
        } 
        catch (IllegalArgumentException | IllegalAccessException e) 
        {
            e.printStackTrace();
        }
    }

    private <T extends Entity> void toRealEntityCollection(Field field, Entity entity) 
    {
        try 
        {
            field.setAccessible(true);
            List<? extends Entity> entities = (List<? extends Entity>)field.get(entity);

            if(entities == null || entities.isEmpty()) return;
            
            Class<?> clazz = entities.get(0).getClass();
            List<T> realEntities = (List<T>) entities.stream()
                .map(e -> dbSets.get(clazz).find(e.getId()))
                .collect(Collectors.toList());
            field.set(entity, realEntities);
        } 
        catch (IllegalArgumentException | IllegalAccessException e) 
        {
            e.printStackTrace();
        }
    }

    private void toRealEntity(Field field, Entity entity) 
    {
        try 
        {
            field.setAccessible(true);
            field.set(entity, dbSets.get(field.getType()).find(((Entity)field.get(entity)).getId()));
        } 
        catch (Exception e) 
        {
            e.printStackTrace();
        }
    }

    public boolean addOrUpdate(Entity entity) 
    {
        ((DbSet<Entity>) dbSets.get(entity.getClass())).addOrUpdate(entity);
        boolean success = persist(entity);
        if(!success) // Roll back
        {
            ((DbSet<Entity>) dbSets.get(entity.getClass())).remove(entity);
        }
        return success;
    }

    public boolean addOrUpdateRange(Entity ...entities) 
    {
        return Stream.of(entities).allMatch(this::addOrUpdate);
    }

    private <T extends Entity> List<T> load(Class<T> clazz) 
    {
        List<T> entities = new ArrayList<>();

        Path path = Paths.get(
            AppConfig.getInstance().getPersistencePath() + "/json",
            clazz.getSimpleName().toLowerCase()
        );

        try (Stream<Path> paths = Files.walk(path)) 
        {
            for (Path p : paths.filter(p -> p.toFile().isFile()).collect(Collectors.toList())) 
            {
                String json = new String(Files.readAllBytes(p));
                System.out.println(json);
                T entity = gson.fromJson(json, clazz);
                
                if(entity != null) 
                {
                    entities.add(entity);
                }
            }
        }
        catch (Exception e) 
        {
			e.printStackTrace();
        }

        return entities;
    }

    private boolean persist(Entity entity) 
    {
		String json = gson.toJson(entity);
		
		try(FileWriter file = new FileWriter(getEntityPath(entity)))
        {
			file.write(json);
		}
        catch (Exception e)
        {
			e.printStackTrace();
			return false;
		}
		
		return true;
    }

    private String getEntityPath(Entity entity) 
    {
		Path path = Paths.get(
            AppConfig.getInstance().getPersistencePath() + "/json",
            entity.getClass().getSimpleName().toLowerCase(),
            entity.getId().toString() + ".json"
        );

        if(!Files.exists(path)) 
        {
            try 
            {
                Files.createDirectories(path.getParent());
                Files.createFile(path);
            } 
            catch (IOException e)
            {
                e.printStackTrace();
            }
        }
        
        return path.toString();
	}
}