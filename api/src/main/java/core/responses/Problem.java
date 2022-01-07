package core.responses;

import java.util.HashMap;
import java.util.Map;

// Content-Type: application/problem+json - Nazalost ne postoji u Jersey
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

public class Problem 
{
    public String type;
    public String title;
    public String detail;
    public Map<String, Object> details;

    public Problem(String type, String title, String detail, Map<String, Object> details) 
    {
        this.type = type;
        this.title = title;
        this.detail = detail;
        this.details = details;
    }

    public Problem(String type, String title, String detail) 
    {
        this.type = type;
        this.title = title;
        this.detail = detail;
        this.details = new HashMap<>();
    }
}
