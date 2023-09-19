package cz.vutbr.fit.api.pl.resources;

import cz.vutbr.fit.api.bl.facades.ReviewFacade;
import cz.vutbr.fit.api.bl.facades.RoomFacade;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("reviews")
public class ReviewResource extends ResourceBase{

    private ReviewFacade _reviewFacade;
    @Inject
    ReviewResource (ReviewFacade _facade)
    {
        this._facade = _facade;
        this._reviewFacade = _facade;

    }

    @Path("getByUserId/{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getByUserId(@PathParam("id") long id)
    {
        return Response.status(Response.Status.OK).entity(_reviewFacade.getByUserId(id)).build();
    }

    @Path("removeAll")
    @GET
    @RolesAllowed("MANAGER")
    public Response removeAll(){
        _facade.removeAll();
        return Response.status(Response.Status.OK).build();
    }


    @Path("{id}")
    @DELETE
    @RolesAllowed("MANAGER")
    public Response removeById(@PathParam("id") long id)
    {
        _facade.removeById(id);
        return Response.status(Response.Status.OK).build();
    }
}
