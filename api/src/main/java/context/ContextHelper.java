package context;

import javax.ws.rs.container.ContainerRequestContext;

public class ContextHelper implements AutoCloseable
{
    private static ThreadLocal<ContextHelper> instance = new ThreadLocal<>();
    private String baseUrl;

    private ContextHelper(String baseUrl)
    {
        this.baseUrl = baseUrl;
    }

    public static ContextHelper create(ContainerRequestContext requestContext) 
    {
        ContextHelper ch = new ContextHelper(requestContext.getUriInfo().getBaseUri().toString());
        instance.set(ch);
        return ch;
    }

    public static ContextHelper getInstance()
    {
        return instance.get();
    } 

    public String getBaseUrl()
    {
        return baseUrl;
    }

    @Override
    public void close() throws Exception 
    {   
        if (instance != null)
        {
            instance.remove();
        }
    }
}