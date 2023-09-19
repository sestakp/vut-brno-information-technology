package cz.vutbr.fit.api.pl.resources;

import cz.vutbr.fit.api.bl.facades.ReservationFacade;
import cz.vutbr.fit.api.bl.facades.RoomFacade;
import cz.vutbr.fit.api.bl.models.others.ParkingInfo;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.EntityPart;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("reservations")
public class ReservationResource extends ResourceBase{

    @Context HttpServletRequest request;
    private ReservationFacade reservationFacade;
    @Inject
    ReservationResource(ReservationFacade _facade)
    {
        this._facade = _facade;
        this.reservationFacade = _facade;
    }

    @Path("{id}")
    @RolesAllowed("CUSTOMER")
    @DELETE
    public Response removeById(@PathParam("id") long id)
    {
        var principal = this.request.getUserPrincipal();

        reservationFacade.removeById(id, principal.getName());
        return Response.status(Response.Status.OK).build();
    }

    @Path("getReservationsByUserId")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getReservationsByUserId(@QueryParam("userId") long userId)
    {
        return Response.status(Response.Status.OK).entity(reservationFacade.getReservationsByUserId(userId)).build();
    }

    @Path("getMealInfo")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @RolesAllowed({"MANAGER", "COOK"})
    public Response getMealInfo()
    {
        return Response.status(Response.Status.OK).entity(reservationFacade.getMealInfo()).build();
    }

    @Path("getTakenParkingSlots")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTakenParkingSlots(@QueryParam("startDate") String start, @QueryParam("endDate") String end)
    {
        return Response.status(Response.Status.OK).entity(reservationFacade.getTakenParkingSlots(start, end)).build();
    }

    @PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @RolesAllowed({"RECEPTIONIST", "MANAGER"})
    public Response updateField(List<EntityPart> parts) throws Exception
    {

        try {
            return Response.status(Response.Status.OK).entity(reservationFacade.updateField(parts)).build();
        }catch (Exception e)
        {
            String err = "Error (probably missing id)" + e.getMessage();
            return Response.status(Response.Status.NOT_ACCEPTABLE).entity(err).build();
        }
    }


}
