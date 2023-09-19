package cz.vutbr.fit.api;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import jakarta.ws.rs.core.Response.Status;

import com.google.gson.*;

@Provider
public class ExceptionMapperProvider implements ExceptionMapper<Exception>
{
    @Override
    public Response toResponse(final Exception exception)
    {
    	
    	StringWriter errors = new StringWriter();
    	exception.printStackTrace(new PrintWriter(errors));
    	
    	Map<String,String> map = new HashMap<>();
    	
    	map.put("ServerError", exception.getMessage());
    	map.put("StackTrace", errors.toString());
    	
    	Gson gson = new Gson(); 
    	String json = gson.toJson(map);
    	
    	return Response.status(Status.BAD_REQUEST).entity(json).build();   
    }
}