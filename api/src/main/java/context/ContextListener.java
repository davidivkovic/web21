package context;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import com.google.gson.Gson;

import configuration.AppConfig;

@WebListener
public class ContextListener implements ServletContextListener {

	@Override
	public void contextDestroyed(ServletContextEvent e) {
		// Not needed
	}
	
	//Run this before web application is started
	@Override
	public void contextInitialized(ServletContextEvent e) {
		Gson gson = new Gson();
		Path configPath = Paths.get(e.getServletContext().getRealPath("resources/config/config.json"));
		
		try {
			String json = new String(Files.readAllBytes(configPath));
			AppConfig.setInstance(gson.fromJson(json, AppConfig.class));
		} catch (IOException ex) {
			ex.printStackTrace();
		}
	}
}