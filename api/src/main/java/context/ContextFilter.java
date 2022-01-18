package context;

import java.io.IOException;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.ext.Provider;

@Provider
public class ContextFilter implements ContainerRequestFilter, ContainerResponseFilter
{
    ContextHelper contextHelper;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException 
    {
        contextHelper = ContextHelper.create(requestContext);
    }

    @Override
    public void filter(
        ContainerRequestContext requestContext,
        ContainerResponseContext responseContext
    ) throws IOException
    {
        try 
        {
            if (contextHelper != null) contextHelper.close();
        }
        catch (Exception e) 
        {
            e.printStackTrace();
        }
    }   
}