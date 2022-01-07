package core.contracts.responses;

public class SignInResponseDTO 
{
    public UserDTO user;
    public String accessToken;

    public SignInResponseDTO(UserDTO user, String token) 
    {
        this.user = user;
        accessToken = token;
    }
}
