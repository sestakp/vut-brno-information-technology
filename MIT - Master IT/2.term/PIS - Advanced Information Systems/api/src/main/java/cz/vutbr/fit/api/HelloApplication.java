package cz.vutbr.fit.api;

import cz.vutbr.fit.api.common.enums.Roles;
import jakarta.annotation.security.DeclareRoles;
import jakarta.security.enterprise.authentication.mechanism.http.BasicAuthenticationMechanismDefinition;
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;


@ApplicationPath("api")
@DeclareRoles({"MANAGER", "CUSTOMER", "RECEPTIONIST", "CLEANER", "COOK"})
@BasicAuthenticationMechanismDefinition(realmName = "admin-area")
public class HelloApplication extends Application {

}