package configuration;

import java.util.logging.Logger;

import javax.inject.Inject;
import javax.ws.rs.ApplicationPath;

import org.glassfish.hk2.api.Immediate;
import org.glassfish.hk2.api.ServiceLocator;
import org.glassfish.hk2.utilities.ServiceLocatorUtilities;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.filter.LoggingFilter;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;

import controllers.ControllerBase;
import core.queries.ConversationQueries;
import core.queries.MediaQueries;
import core.queries.UserQueries;
import core.services.ChatService;
import core.services.MediaService;
import database.DbContext;
import security.AuthenticationFilter;
import security.TokenService;


@ApplicationPath("/api")
// @ApplicationPath("/")
public class JerseyConfig extends ResourceConfig 
{

    @Inject
    public JerseyConfig(ServiceLocator locator) 
    {
        // property(ServerProperties.RESPONSE_SET_STATUS_OVER_SEND_ERROR, "true");
        ServiceLocatorUtilities.enableImmediateScope(locator);

        packages(
            ControllerBase.class.getPackage().getName(),
            AuthenticationFilter.class.getPackage().getName()
        );

        

        // Enable LoggingFilter & output entity.     
        registerInstances(new LoggingFilter(Logger.getLogger(JerseyConfig.class.getName()), true));
    
        // Dependency injection
        register(MultiPartFeature.class);
        register(DbContext.class);
        register(UserQueries.class);
        register(MediaQueries.class);
        register(ConversationQueries.class);
        register(TokenService.class);
        register(MediaService.class);
        register(ChatService.class);

        register(new AbstractBinder() 
        {
            @Override
            protected void configure() 
            {
                bindAsContract(DbContext.class).in(Immediate.class);
                bindAsContract(UserQueries.class).in(Immediate.class);
                bindAsContract(MediaQueries.class).in(Immediate.class);
                bindAsContract(ConversationQueries.class).in(Immediate.class);
                bindAsContract(TokenService.class).in(Immediate.class);
                bindAsContract(MediaService.class).in(Immediate.class);
                bindAsContract(ChatService.class).in(Immediate.class);
            }
        });
    }
}