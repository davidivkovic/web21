package security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.ws.rs.NameBinding;

import core.model.User.Role;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;

@NameBinding
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
@ApiImplicitParams(
{
    @ApiImplicitParam(
        name = "Authorization",
        value = "Authorization token", 
        required = false,
        dataType = "string",
        paramType = "header"
    ) 
})
public @interface Authorize 
{
    Role[] value() default {};
    boolean allowAnonymous() default false;
}