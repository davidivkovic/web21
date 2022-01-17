package core.model;

import java.time.LocalDate;

public class User extends Entity 
{
    public enum Gender 
    {
        Male,
        Female,
        Other
    }
    
    public enum Role 
    {
        User,
        Admin
    }
    
    private String username;
    private String password;
    private String email;
    private String fullName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private Role role;
    private String imageURL;
    private boolean isPrivate;
    private boolean isBanned;
    
    public User(String username, String password, String email,
                String fullName, LocalDate dateOfBirth,
                Gender gender, boolean isPrivate) 
    {
        this.username = username;
        this.password = password;
        this.email = email;
        this.fullName = fullName;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.isPrivate = isPrivate;
        role = Role.User;
    }

    public void makeAdmin()
    {
        role = Role.Admin;
    }

    public void ban()
    {
        isBanned = true;
    }

    public void unban()
    {
        isBanned = false;
    }

    public void changePassword(String newPassword)
    {
        password = newPassword;
    }

    public void changeEmail(String newEmail) 
    {
        email = newEmail;
    }

    /* Getters */

    public String getUsername() 
    {
        return username;
    }

    public void setUsername(String username) 
    {
        this.username = username;
    }

    public String getPassword() 
    {
        return password;
    }

    public String getEmail() 
    {
        return email;
    }

    public String getFullName() 
    {
        return fullName;
    }

    public void setFullName(String fullName) 
    {
        this.fullName = fullName;
    }

    public LocalDate getDateOfBirth() 
    {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) 
    {
        this.dateOfBirth = dateOfBirth;
    }

    public Gender getGender() 
    {
        return gender;
    }

    public void setGender(Gender gender) 
    {
        this.gender = gender;
    }

    public Role getRole() 
    {
        return role;
    }

    public void setRole(Role role) 
    {
        this.role = role;
    }

    public String getImageURL() 
    {
        return imageURL;
    }

    public void setImageURL(String imageURL) 
    {
        this.imageURL = imageURL;
    }

    public boolean isPrivate() 
    {
        return isPrivate;
    }

    public void setPrivate(boolean isPrivate) 
    {
        this.isPrivate = isPrivate;
    }

    public boolean getIsBanned()
    {
        return isBanned;
    }

    public String getFirstName()
    {
        return fullName.split(" ")[0];
    }

    public String getLastName()
    {
        return fullName.split(" ")[1];
    }
}
