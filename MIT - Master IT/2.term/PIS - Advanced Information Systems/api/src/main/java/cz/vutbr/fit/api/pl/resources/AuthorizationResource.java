package cz.vutbr.fit.api.pl.resources;

import cz.vutbr.fit.api.bl.facades.AuthorizationFacade;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.security.enterprise.authentication.mechanism.http.openid.LogoutDefinition;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("authorization")
public class AuthorizationResource {

    private AuthorizationFacade authorizationFacade;

    @Inject
    AuthorizationResource (AuthorizationFacade _facade)
    {
        this.authorizationFacade = _facade;
    }



    @Path("login")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response getUserInfoAndLoginCheck(@FormParam("name") String name, @FormParam("password") String password)
    {
        return Response.status(Response.Status.OK).entity(authorizationFacade.login(name, password)).build();
    }


    @GET
    @Path("ping")
    @PermitAll
    public Response ping(){
        return Response.status(Response.Status.OK).entity(authorizationFacade.ping()).build();
    }
    
    @GET
    @Path("logout")
    @LogoutDefinition
    public Response logout(){
        return Response.status(Response.Status.UNAUTHORIZED).entity(authorizationFacade.ping()).build();
    }

}