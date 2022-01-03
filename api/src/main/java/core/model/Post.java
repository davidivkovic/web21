package core.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import database.annotations.ForeignKey;

public class Post extends Entity
{
    // Admin moze da obrise korisnikov post a razlog brisanja mu se salje u dm
    private String content;
    private LocalDateTime timestamp;
    private String imageURL;

    @ForeignKey private User poster;
    @ForeignKey private List<Comment> comments;

    public Post(String content, String imageURL, User poster) 
    {
        this.content = content;
        this.imageURL = imageURL;
        this.poster = poster;
        timestamp = LocalDateTime.now();
        comments = new ArrayList<>();
    }
    
    public Comment comment(User commenter, String content)
    {
        Comment c = new Comment(commenter, content);
        comments.add(c);
        return c;
    }

    public void deleteAllComments() 
    {
        comments.forEach(Comment::delete);
    }
    
    /* Getters */

    public String getContent() 
    {
        return content;
    }

    public LocalDateTime getTimestamp() 
    {
        return timestamp;
    }

    public String getImageURL() 
    {
        return imageURL;
    }

    public User getPoster() 
    {
        return poster;
    }

    public List<Comment> getComments() 
    {
        return comments;
    }
}
