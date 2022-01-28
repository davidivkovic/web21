package controllers;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import javax.inject.Inject;
import javax.ws.rs.CookieParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import core.contracts.requests.PasswordChangeDTO;
import core.contracts.requests.RegistrationDTO;
import core.contracts.requests.SignInRequestDTO;
import core.contracts.responses.AccessTokenDTO;
import core.contracts.responses.SignInResponseDTO;
import core.contracts.responses.UserDTO;
import core.queries.UserQueries;
import core.utils.StringUtils;
import core.model.RefreshToken;
import core.model.User;

import database.DbContext;
import io.swagger.annotations.Api;
import security.Authorize;
import security.TokenService;

@Api(tags = "Authentication")
@Path("/auth")
public class AuthenticationController extends ControllerBase
{   
    @Inject DbContext context;
    @Inject UserQueries userQueries;
    @Inject TokenService tokenService;
    @Context UriInfo uriInfo;

    @POST
    @Path("/register")
    @Produces(MediaType.APPLICATION_JSON)
    public Response register(RegistrationDTO registration)
    {
        User foundUser = userQueries.findByUsername(registration.username);

        if (StringUtils.isNullOrEmpty(registration.username) || foundUser != null)
        {
            return badRequest("This username isn't available. Please try another.");
        }
        
        foundUser = userQueries.findByEmail(registration.email);

        if (StringUtils.isNullOrEmpty(registration.email) || foundUser != null)
        {
            return badRequest("Another account is using " + registration.email + ". ");
        }

        if (StringUtils.isNullOrEmpty(registration.password))
        {
            return badRequest("This password is too easy to guess. Please create a new one.");
        }

        if(hasValidationProblems())
        {
            return validationProblem();
        }

        User newUser = registration.toNewUser();
        boolean success = context.addOrUpdate(newUser);

        if (success)
        {
            return ok();
        }

        return problem(
            "error",
            "Oops, something went wrong",
            "We couldn't create your account at this time. Please try again later."
        );
    }

    @POST
    @Path("/sign-in")
    @Produces(MediaType.APPLICATION_JSON)
    public Response signIn(SignInRequestDTO signIn)
    {
        User foundUser = userQueries.findByUsername(signIn.username);

        if (foundUser == null)
        {
            return badRequest("The username you entered doesn't belong to an account. Please check your username and try again.");
        }

        else if (signIn.password == null || !signIn.password.equals(foundUser.getPassword()))
        {
            return badRequest("Sorry, your password was incorrect. Please double-check your password.");
        }

        if (foundUser.getIsBanned())
        {
            return badRequest("Your user account has been banned by our administrators.");
        }

        String accessToken = tokenService.generateAccesToken(foundUser);
        RefreshToken refreshToken = tokenService.generateRefreshToken(foundUser);

        Object response = new SignInResponseDTO(new UserDTO(foundUser), accessToken);

        return Response.ok(response)
        .header(
            "Set-Cookie",
            "refresh-token=" +
            refreshToken.toString() +
            ";Path=/;HttpOnly;Expires=" +
            DateTimeFormatter.RFC_1123_DATE_TIME.format(
                refreshToken.getExpires().atOffset(ZoneOffset.UTC)
            )
        )
        .build();
    }

    @POST
    @Authorize
    @Path("/sign-out")
    @Produces(MediaType.APPLICATION_JSON)
    public Response signOut(@CookieParam("refresh-token") String refreshToken)
    {
        tokenService.revokeRefreshToken(refreshToken);
        return Response.ok().header(
            "Set-Cookie",
            "refresh-token=;Path=/;HttpOnly;MaxAge=0;Expires=" + 
            DateTimeFormatter.RFC_1123_DATE_TIME.format(
                OffsetDateTime.ofInstant(Instant.EPOCH, ZoneOffset.UTC)
            )
        ).build();
    }

    @GET
    @Path("/token-refresh")
    @Produces(MediaType.APPLICATION_JSON)
    public Response tokenRefresh(@CookieParam("refresh-token") String refreshToken)
    {
        UUID parsedToken = null; 
        try 
        {
            parsedToken = UUID.fromString(refreshToken);
        } 
        catch (Exception e) 
        {
            return problem(
                "invalid-refresh-token",
                "Refresh token invalid",
                "Your refresh token was invalid. Please sign in again."
            );
        }

        String token = tokenService.refresh(parsedToken);
        if (token == null)
        {
            return problem(
                "invalid-refresh-token",
                "Session expired",
                "Your session has expired. Please sign in again."
            );
        }

        return ok(new AccessTokenDTO(token));
    }

	@POST
    @Path("/change-password")
    @Authorize
	@Produces(MediaType.APPLICATION_JSON)
	public Response changePassword(PasswordChangeDTO request) 
	{
		User user = authenticatedUser();
		if (user == null) 
		{
			return badRequest();
		}

		if (!user.getPassword().equals(request.oldPassword)) 
		{
			return badRequest("Your old password is incorrect.");
		}

		if (StringUtils.isNullOrEmpty(request.newPassword))
        {
            return badRequest("This password is too easy to guess. Please create a new one.");
        }

		user.changePassword(request.newPassword);
		context.addOrUpdate(user);

		return ok();
	}
}
