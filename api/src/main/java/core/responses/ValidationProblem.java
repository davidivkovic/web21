package core.responses;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// Content-Type: application/problem+json - Nazalost ne postoji u Jersey
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

public class ValidationProblem 
{
    public static final String type = "validation-problem";
    public static final String title =  "The request parameters failed to validate";
    
    public List<Map<String, String>> invalidParams;

    public ValidationProblem(Map<String, String> invalidParams) 
    {
        this.invalidParams = invalidParams
        .entrySet()
        .stream()
        .map(entry -> new HashMap<String, String>()
        {{
            put("name", entry.getKey());
            put("reason", entry.getValue());
        }})
        .collect(Collectors.toList());
    }
}