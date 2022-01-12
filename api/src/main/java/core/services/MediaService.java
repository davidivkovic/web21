package core.services;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import javax.inject.Inject;

import configuration.AppConfig;
import database.DbContext;

public class MediaService 
{
    @Inject public DbContext context;

    private AppConfig appConfig = AppConfig.getInstance();
    String imagesPath = appConfig.getPersistencePath() + "/images/";

    public boolean saveImage(File image, String type, UUID id)
    {
        try 
        {
            // image/jpeg, image/png
            Files.move(
                image.toPath(),
                Paths.get(imagesPath, id.toString() /*+ "." + type.substring(6)*/),
                StandardCopyOption.REPLACE_EXISTING
            );
            return true;
        } 
        catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public String localImagePath(String imageId)
    {
        return imagesPath + imageId;
    }

    public File getImage(String imageId)
    {
        if (imageId == null) return null;
        return new File(imagesPath + imageId);
    }

    public boolean imageExists(String imageId)
    {
        return getImage(imageId).isFile();
    }
}
