package security;

import java.io.IOException;
import java.lang.reflect.AnnotatedElement;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

import core.model.User;
import core.model.User.*;
import core.responses.Problem;

@Authorize
@Provider
@Priority(Priorities.AUTHORIZATION)
public class AuthorizationFilter implements ContainerRequestFilter {

    @Context
    private ResourceInfo resourceInfo;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException 
    {
        Method resourceMethod = resourceInfo.getResourceMethod();
        Authorize authorize = resourceMethod.getAnnotation(Authorize.class);

        if(authorize != null && authorize.allowAnonymous()) return;

        User user = (User) requestContext.getProperty(User.class.getName());

        if (user.getIsBanned()) 
        {
            Problem response = new Problem(
                "banned",
                "User account banned",
                "Your user account has been banned by our administrators."
            );
            requestContext.abortWith(
                Response.status(Response.Status.FORBIDDEN).entity(response).build()
            );
        }

        resourceMethod = resourceInfo.getResourceMethod();
        List<Role> allowedRoles = extractRoles(resourceMethod);

        if (allowedRoles.isEmpty()) 
        {
            Class<?> resourceClass = resourceInfo.getResourceClass();
            allowedRoles = extractRoles(resourceClass);
        } 

        if (allowedRoles.isEmpty()) 
        {
            allowedRoles = Arrays.asList(Role.Admin, Role.User);
        }

        Boolean isAuthorized = checkPermissions(user, allowedRoles);

        if(!isAuthorized) 
        {
            requestContext.abortWith(Response.status(Response.Status.FORBIDDEN).build());
        }
    }

    private List<Role> extractRoles(AnnotatedElement annotatedElement) 
    {
        if (annotatedElement == null) 
        {
            return new ArrayList<>();
        } 
        else 
        {
            Authorize authorized = annotatedElement.getAnnotation(Authorize.class);
            if (authorized == null) 
            {
                return new ArrayList<>();
            } 
            else 
            {
                Role[] allowedRoles = authorized.value();
                return Arrays.asList(allowedRoles);
            }
        }
    }

    private boolean checkPermissions(User user, List<Role> allowedRoles) 
    {
        return allowedRoles.contains(user.getRole());
    }
}