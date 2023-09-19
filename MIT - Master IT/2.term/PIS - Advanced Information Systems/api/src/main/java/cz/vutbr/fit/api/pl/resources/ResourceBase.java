package cz.vutbr.fit.api.pl.resources;

import cz.vutbr.fit.api.bl.facades.FacadeBase;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

import java.util.List;

public class ResourceBase {

    @Context
    private SecurityContext securityContext;

    protected FacadeBase _facade;

    ResourceBase(FacadeBase _facade)
    {
        this._facade = _facade;
    }

    ResourceBase()
    {

    }


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRooms()
    {
        return Response.status(Response.Status.OK).entity(_facade.getAll()).build();
    }



    @Path("{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getById(@PathParam("id") int id)
    {
        return Response.status(Response.Status.OK).entity(_facade.getById(id)).build();
    }


    @Path("generator")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response generator()
    {
        return Response.status(Response.Status.OK).entity(_facade.entityGenerator()).build();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response create(List<EntityPart> form) throws Exception
    {
            return Response.status(Response.Status.OK).entity(_facade.Create(form)).build();
    }


    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response update(List<EntityPart> parts) throws Exception
    {
        return Response.status(Response.Status.OK).entity(_facade.update(parts)).build();
    }

    @PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response updateField(List<EntityPart> parts) throws Exception
    {


        try {
            return Response.status(Response.Status.OK).entity(_facade.updateField(parts)).build();
        }catch (Exception e)
        {
            String err = "Error (probably missing id)" + e.getMessage();
            return Response.status(Response.Status.NOT_ACCEPTABLE).entity(err).build();
        }
    }


    @Path("removeAll")
    @GET
    public Response removeAll(){
        _facade.removeAll();
        return Response.status(Response.Status.OK).build();
    }


    @Path("{id}")
    @DELETE
    public Response removeById(@PathParam("id") long id)
    {
        _facade.removeById(id);
        return Response.status(Response.Status.OK).build();
    }


}
