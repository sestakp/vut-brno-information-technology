package cz.vutbr.fit.api.pl.resources;


import cz.vutbr.fit.api.bl.facades.RoomFacade;
import cz.vutbr.fit.api.bl.facades.UserFacade;
import cz.vutbr.fit.api.bl.models.formModels.RoomFormModel;
import cz.vutbr.fit.api.bl.models.formModels.UserFormModel;
import cz.vutbr.fit.api.dal.entity.UserEntity;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.EntityPart;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

import java.util.List;

@Path("users")
public class UserResource extends ResourceBase {
	
	@Context HttpServletRequest request;

    private UserFacade userFacade;

    @Inject
    UserResource (UserFacade _facade)
    {
        this._facade = _facade;
        this.userFacade = _facade;
    }
    
    @PATCH
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @RolesAllowed({"MANAGER", "CUSTOMER", "RECEPTIONIST", "CLEANER", "COOK"})
    public Response updateField(List<EntityPart> parts) throws Exception
    {
    	
    	var principal = this.request.getUserPrincipal();

        return Response.status(Response.Status.OK).entity(this.userFacade.updateField(parts, principal.getName())).build();
    }

}
