package cz.vutbr.fit.api;

import java.util.Set;

import cz.vutbr.fit.api.bl.facades.AuthorizationFacade;
import cz.vutbr.fit.api.bl.facades.EmployeeFacade;
import cz.vutbr.fit.api.bl.facades.UserFacade;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.security.enterprise.credential.Credential;
import jakarta.security.enterprise.credential.UsernamePasswordCredential;
import jakarta.security.enterprise.identitystore.CredentialValidationResult;
import jakarta.security.enterprise.identitystore.IdentityStore;

@ApplicationScoped
public class LocalIdentityStore implements IdentityStore
{
    AuthorizationFacade authorizationFacade;
    UserFacade userFacade;
    EmployeeFacade employeeFacade;

    @Inject
    LocalIdentityStore(AuthorizationFacade authorizationFacade, UserFacade userFacade, EmployeeFacade employeeFacade)
    {
        this.authorizationFacade = authorizationFacade;
        this.userFacade = userFacade;
        this.employeeFacade = employeeFacade;
    }


    @Override
    public CredentialValidationResult validate(Credential credential)
    {
        if (credential instanceof UsernamePasswordCredential)
        {
            if(authorizationFacade.verifyUserCredentials ((UsernamePasswordCredential) credential)){

                String userEmail = ((UsernamePasswordCredential) credential).getCaller();
                return new CredentialValidationResult(userEmail, Set.of(userFacade.getUserRole(userEmail)));
            }

            if(authorizationFacade.verifyEmployeeCredentials ((UsernamePasswordCredential) credential)){

                String userEmail = ((UsernamePasswordCredential) credential).getCaller();
                return new CredentialValidationResult(userEmail, Set.of(employeeFacade.getEmployeeRole(userEmail)));
            }
        }


        
        return CredentialValidationResult.INVALID_RESULT;
    }


}
