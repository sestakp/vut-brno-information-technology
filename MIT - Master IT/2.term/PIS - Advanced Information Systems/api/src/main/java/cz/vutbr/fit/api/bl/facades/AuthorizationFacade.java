package cz.vutbr.fit.api.bl.facades;

import cz.vutbr.fit.api.bl.mappers.EmployeeMapper;
import cz.vutbr.fit.api.bl.mappers.UserMapper;
import cz.vutbr.fit.api.bl.models.detailModels.IDetailModel;
import cz.vutbr.fit.api.dal.unitOfWork.UnitOfWork;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.security.enterprise.credential.UsernamePasswordCredential;
import org.mindrot.jbcrypt.BCrypt;

@RequestScoped
public class AuthorizationFacade {

    private UnitOfWork _unitOfWork;
    private EmployeeMapper _employeeMaper;
    private UserMapper _userMapper;

    @Inject
    AuthorizationFacade(UnitOfWork unitOfWork, EmployeeMapper employeeMaper, UserMapper userMapper) {
        this._unitOfWork = unitOfWork;
        this._employeeMaper = employeeMaper;
        this._userMapper = userMapper;
    }
    AuthorizationFacade(){

    }
    public boolean verifyUserCredentials(UsernamePasswordCredential credentials) {

        var password = credentials.getPasswordAsString();
        var userEmail = credentials.getCaller();

        var user = _unitOfWork.getUserRepository().getUserByEmail(userEmail);

        if (user != null) {
            return BCrypt.checkpw(password, user.getPasswordHash());
        }

        return false;
    }

    public boolean verifyEmployeeCredentials(UsernamePasswordCredential credentials) {

        var password = credentials.getPasswordAsString();
        var employeeEmail = credentials.getCaller();

        var employee = _unitOfWork.getEmployeeRepository().getEmployeeByEmail(employeeEmail);

        if (employee != null) {
            return BCrypt.checkpw(password, employee.getPasswordHash());
        }


        return false;
    }

    public IDetailModel login(String name, String password) {

        UsernamePasswordCredential credentials = new UsernamePasswordCredential(name, password);
        var verify = verifyUserCredentials(credentials);

        if(verify) {
            return _userMapper.MapEntityToDetail(_unitOfWork.getUserRepository().getUserByEmail(name));
        }


        verify = verifyEmployeeCredentials(credentials);

        if(verify) {
            return _employeeMaper.MapEntityToDetail(_unitOfWork.getEmployeeRepository().getEmployeeByEmail(name));
        }

        return null;
    }

    public String ping(){
        return "<script>window.close()</script>";
    }
}
