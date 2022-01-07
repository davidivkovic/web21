package core.contracts.responses;

import java.time.LocalDateTime;

public class HealthCheckDTO 
{
    public String status;
    public String time;

    public HealthCheckDTO(String status, LocalDateTime time) {
        this.status = status;
        this.time = time.toString();
    }
}
