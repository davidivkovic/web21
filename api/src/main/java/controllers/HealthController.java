package controllers;

import java.time.LocalDateTime;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import core.contracts.responses.HealthCheckDTO;
import io.swagger.annotations.Api;

@Api(tags = "Health Check")
@Path("/")
public class HealthController extends ControllerBase
{
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response index() 
    {   
        return ok(new HealthCheckDTO("ok", LocalDateTime.now()));
    }
}