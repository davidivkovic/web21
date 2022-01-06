package core.contracts.requests;

import java.time.LocalDate;
import java.util.UUID;

import core.model.User;

public class RegistrationDTO 
{
    public String username;
    public String password;
    public String email;
    public String firstName;
    public String lastName;
    public User.Gender gender;
    public String dateOfBirth;
    
    public User toNewUser()
    {
        User u = new User(username, password, email,
                          firstName, lastName, LocalDate.parse(dateOfBirth),
                          gender, false);
        u.setId(UUID.randomUUID());
        u.setImageURL("profile-default");
        return u;
    }
}
