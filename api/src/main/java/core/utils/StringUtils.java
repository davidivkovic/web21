package core.utils;

public class StringUtils 
{
    public static boolean isNullOrEmpty(String s)
    {
        return s == null || s.equals("") || s.trim().equals("");
    }    
}
