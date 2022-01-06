package security;

import java.io.IOException;
import java.lang.reflect.Method;
import java.util.UUID;

import javax.annotation.Priority;
import javax.inject.Inject;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

import core.model.User;
import database.DbContext;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;

@Provider
@Authorize
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilter implements ContainerRequestFilter 
{
    private static final String AUTHENTICATION_SCHEME = "Bearer";

    @Context ResourceInfo resourceInfo;

    @Inject DbContext dbContext;
    @Inject TokenService tokenService;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException 
    {
        Method resourceMethod = resourceInfo.getResourceMethod();
        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);
        Authorize authorize = resourceMethod.getAnnotation(Authorize.class);

        if(authorize == null)
        {
            authorize = resourceInfo.getResourceClass().getAnnotation(Authorize.class);
        }

        if(authorize != null && authorize.allowAnonymous() && authorizationHeader == null) 
        {
            requestContext.setProperty(User.class.getName(), null);
            return;
        }

        if (!isTokenBasedAuthentication(authorizationHeader)) 
        {
            abortWithUnauthorized(requestContext);
            return;
        }
        
        String token = authorizationHeader.substring(AUTHENTICATION_SCHEME.length()).trim();

        Jws<Claims> jwt = tokenService.parseAccesToken(token);
        
        if (jwt != null)
        {
            UUID userId = UUID.fromString(jwt.getBody().getSubject());
            User user  = dbContext.users.find(userId);
            
            if (user != null)
            {
                requestContext.setProperty(User.class.getName(), user);
                return;
            }

            abortWithUnauthorized(requestContext);
        } 

        abortWithUnauthorized(requestContext);
    }

    private boolean isTokenBasedAuthentication(String authorizationHeader)
    {
        return authorizationHeader != null && authorizationHeader.toLowerCase().startsWith(AUTHENTICATION_SCHEME.toLowerCase() + " ");
    }

    private void abortWithUnauthorized(ContainerRequestContext requestContext) 
    {
        requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
    }
}