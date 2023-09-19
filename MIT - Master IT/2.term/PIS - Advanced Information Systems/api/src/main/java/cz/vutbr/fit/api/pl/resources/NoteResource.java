package cz.vutbr.fit.api.pl.resources;

import cz.vutbr.fit.api.bl.facades.EmployeeFacade;
import cz.vutbr.fit.api.bl.facades.NoteFacade;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Response;

@Path("notes")
public class NoteResource extends ResourceBase {

    private NoteFacade noteFacade;

    @Inject
    NoteResource (NoteFacade _facade)
    {
        this._facade = _facade;
        this.noteFacade = _facade;
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
