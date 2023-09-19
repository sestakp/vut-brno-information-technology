package cz.vutbr.fit.api.dal.repositories;

import cz.vutbr.fit.api.bl.models.others.UpdateFieldModel;
import cz.vutbr.fit.api.dal.entity.EmployeeEntity;
import cz.vutbr.fit.api.dal.entity.UserEntity;
import cz.vutbr.fit.api.dal.factories.EntityFactory;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.TypedQuery;


import java.util.List;

@RequestScoped
public class    EmployeeRepository extends RepositoryBase<EmployeeEntity>{

    private EntityManager _entityManager;

    @Inject
    EmployeeRepository(EntityManager entityManager, EntityFactory entityFactory)
    {
        super(entityManager, "Employee", EmployeeEntity.class, entityFactory);
        this._entityManager = entityManager;

    }

    EmployeeRepository()
    {

    }


    @Override
    public long UpdateField(UpdateFieldModel model) throws Exception {
        if(model.fieldName.equals("city") ||
           model.fieldName.equals("state") ||
           model.fieldName.equals("street") ||
           model.fieldName.equals("zipCode"))
        {

            var employee = _entityManager.find(EmployeeEntity.class, model.id);

            if (employee != null) {
                switch (model.fieldName){
                    case "city":
                        employee.getAddress().setCity(model.value.toString());
                        break;
                    case "state":
                        employee.getAddress().setState(model.value.toString());
                        break;
                    case "street":
                        employee.getAddress().setStreet(model.value.toString());
                        break;
                    case "zipCode":
                        employee.getAddress().setZipCode(model.value.toString());
                        break;
                }
            }
            _entityManager.merge(employee);
            return model.id;
        }

        return super.UpdateField(model);
    }

    public EmployeeEntity getEmployeeByEmail(String email){
        return ( _entityManager.createNamedQuery("Employee.getByEmail", EmployeeEntity.class).setParameter("email", email).getResultList().stream().findFirst().orElse(null) );
    }




}
