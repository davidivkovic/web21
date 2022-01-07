package controllers;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import core.model.User;
import core.responses.Problem;
import core.responses.ValidationProblem;

public class ControllerBase 
{
    @Context ContainerRequestContext context;

    private Map<String, String> validationProblems = new HashMap<>();
    private Map<String, Object> problemDetails = new HashMap<>();

    public void addValidationProblem(String fieldName, String error)
    {
        validationProblems.put(fieldName, error);
    }

    public boolean hasValidationProblems()
    {
        return !validationProblems.isEmpty();
    }

    public User authenticatedUser() 
    {
        return (User) context.getProperty(User.class.getName());
    }

    public boolean isAuthenticated() 
    {
        return authenticatedUser() != null;
    }

    public Response ok()
    {
        return Response.ok().build();
    }

    public Response ok(Object entity)
    {
        return Response.ok(entity).build();
    }

    public Response validationProblem()
    {
        Response response = Response
        .status(Status.BAD_REQUEST)
        .type(MediaType.APPLICATION_JSON)
        .entity(new ValidationProblem(validationProblems))
        .build();
        validationProblems.clear();

        return response;
    }

    public void addProblemDetails(String name, Object detail)
    {
        problemDetails.put(name, detail);
    }

    public Response problem(String type, String title, String detail)
    {
        Response response = Response
        .status(Status.BAD_REQUEST)
        .type(MediaType.APPLICATION_JSON)
        .entity(new Problem(type, title, detail, problemDetails))
        .build();
        problemDetails.clear();

        return response;
    }

    public Response physicalFile(File f)
    {
        return Response.ok(f).build();
    }

    public Response physicalFile(String path, String contentType)
    {
        if (path == null) return noContent();
        return Response.ok(new File(path)).type(contentType).build();
    }

    public Response file(File file, String contentType)
    {
        return Response.ok(file).type(contentType).build();
    }

    public Response badRequest(Object entity)
    {
        return Response.status(Status.BAD_REQUEST).entity(entity).build();
    }
    
    public Response badRequest()
    {
        return Response.status(Status.BAD_REQUEST).build();
    }

    public Response noContent()
    {
        return Response.status(Status.NO_CONTENT).build();
    }

    public Response notFound()
    {
        return Response.status(Status.NOT_FOUND).build();
    }

    public Response unauthorized()
    {
        return Response.status(Status.UNAUTHORIZED).build();
    }

    public Response forbidden()
    {
        return Response.status(Status.FORBIDDEN).build();
    }


    // Content-Type: application/problem+json

    /*
        type: "no-funds"
        title: "Not enough funds"
        detail: "Your account does not have enough funds to perform this operation",
        instance: "/account/12345/msgs/abc",
        balance: 30,
        accounts: [
            "/account/12345",
            "/account/67890"
        ]
    */

    /*

    type: "multiple-problems",
    title: "Multiple problems occured"
    detail: "There were multiple problems that have occurred.",
    problems: [
        {
            type: "not-available"
            title: "Cannot set product as available",
            detail: "Product is already Available For Sale.",
        },
        {
            type: "no-quantity",
            title: "Cannot set product as available.",
            detail: "Product has no Quantity on Hand.",
            instance: "/sales/products/abc123/availableForSale",
        }
    ]
    */

    /*
        type: "validation-problem"
        title: "The request parameters failed to validate"
        invalidParams: [
            {
                name: "email",
                reason: "Invalid email"
            }
        ]
    */
}
