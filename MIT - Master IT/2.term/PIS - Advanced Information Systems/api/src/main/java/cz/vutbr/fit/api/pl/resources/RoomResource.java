package cz.vutbr.fit.api.pl.resources;

import java.security.Principal;

import cz.vutbr.fit.api.bl.facades.UserFacade;
import cz.vutbr.fit.api.dal.entity.UserEntity;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.SecurityContext;

import cz.vutbr.fit.api.bl.facades.RoomFacade;
import cz.vutbr.fit.api.bl.models.formModels.RoomFormModel;
import cz.vutbr.fit.api.bl.models.listModels.RoomListModel;
import cz.vutbr.fit.api.dal.entity.RoomEntity;
import jakarta.ejb.Remove;
import jakarta.inject.Inject;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.EntityPart;
import jakarta.ws.rs.core.GenericEntity;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

@Path("rooms")
public class RoomResource extends ResourceBase{

    RoomFacade roomFacade;

    @Inject
    RoomResource (RoomFacade _facade)
    {
        super(_facade);
        this.roomFacade = _facade;
    }
    
    @Path("getAvailableRooms")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAvailableRooms(@QueryParam("startDate") String start, @QueryParam("endDate") String end)
    {
        return Response.status(Response.Status.OK).entity(roomFacade.getAvailableRooms(start, end)).build();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @RolesAllowed("MANAGER")
    public Response create(List<EntityPart> form) throws Exception
    {
        return Response.status(Response.Status.OK).entity(_facade.Create(form)).build();
    }


    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @RolesAllowed("MANAGER")
    public Response update(List<EntityPart> parts) throws Exception
    {
        return Response.status(Response.Status.OK).entity(_facade.update(parts)).build();
    }

    @PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @RolesAllowed("MANAGER")
    public Response updateField(List<EntityPart> parts) throws Exception
    {
        try {
            return Response.status(Response.Status.OK).entity(_facade.updateField(parts)).build();
        } catch (Exception e)
        {
            String err = "Error (probably missing id)" + e.getMessage();
            return Response.status(Response.Status.NOT_ACCEPTABLE).entity(err).build();
        }
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
