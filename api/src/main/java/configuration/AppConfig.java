package configuration;

public class AppConfig 
{
    private String basePath;
    private String persistencePath;
    private String resourcesPath;

    private static AppConfig instance;
    
    public static AppConfig getInstance() 
    {
        return instance;
    }

    public String getResourcesPath() 
    {
        return basePath + resourcesPath;
    }

    public void setResourcesPath(String resourcesPath) 
    {
        this.resourcesPath = resourcesPath;
    }

    public String getPersistencePath() {
        return basePath + persistencePath;
    }

    public void setPersistencePath(String persistencePath) 
    {
        this.persistencePath = persistencePath;
    }

    public String getBasePath() 
    {
        return basePath;
    }

    public void setBasePath(String basePath) 
    {
        this.basePath = basePath;
    }

    public static void setInstance(AppConfig instance) 
    {
        AppConfig.instance = instance;
    }
}
