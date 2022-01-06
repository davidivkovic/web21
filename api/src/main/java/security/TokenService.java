package security;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.inject.Inject;

import core.model.RefreshToken;
import core.model.User;
import database.DbContext;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class TokenService 
{
    private final String JWT_SECRET = "32C4VI-3C5YJ34W-MO23XIT4NTFX2";

    @Inject DbContext context;

    public TokenService() 
    {
        super();
    }

    public TokenService(DbContext context)
    {
        this.context = context;
    }

    public String refresh(UUID refreshToken)
    {
        RefreshToken token = context.refreshTokens.find(refreshToken);
        if (token.hasExpired()) return null;
        return generateAccesToken(token.getUser());
    }
    
    public void revokeRefreshToken(String token)
    {
        RefreshToken rt = context.refreshTokens.find(UUID.fromString(token));
        rt.revoke();
        context.addOrUpdate(rt);
    }

    public RefreshToken generateRefreshToken(User user)
    {
        RefreshToken token = new RefreshToken(user);
        context.addOrUpdate(token);
        return token;
    }

    public String generateAccesToken(User user)
    {
        Map<String, Object> claims = new HashMap<>();
        claims.put("fullName", user.getFullName());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole());

        return Jwts.builder()
        .setHeaderParam("typ", "JWT")
        .setClaims(claims)
        .setId(UUID.randomUUID().toString())
        .setSubject(user.getId().toString())
        .setIssuer("api.example.com")
        .setIssuedAt(new Date())
        .setExpiration(Date.from(LocalDateTime.now().plusMinutes(150000).atZone(ZoneId.systemDefault()).toInstant()))
        .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
        .compact();
    }

    public Jws<Claims> parseAccesToken(String token)
    {
        try
        {
            return Jwts.parser()
            .setSigningKey(JWT_SECRET)
            .parseClaimsJws(token);
        }
        catch(Exception e)
        {
            e.printStackTrace();
            return null;
        }
        
    }
}
