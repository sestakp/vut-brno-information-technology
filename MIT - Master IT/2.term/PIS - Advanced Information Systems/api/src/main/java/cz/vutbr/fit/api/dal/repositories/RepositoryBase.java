package cz.vutbr.fit.api.dal.repositories;

import cz.vutbr.fit.api.bl.models.others.UpdateFieldModel;
import cz.vutbr.fit.api.dal.embedded.Address;
import cz.vutbr.fit.api.dal.entity.EmployeeEntity;
import cz.vutbr.fit.api.dal.entity.RoomEntity;
import cz.vutbr.fit.api.dal.entity.UserEntity;
import cz.vutbr.fit.api.dal.entity.interfaces.IEntity;
import cz.vutbr.fit.api.dal.factories.EntityFactory;
import cz.vutbr.fit.api.dal.repositories.interfaces.IRepository;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.hsqldb.rights.User;
import org.mindrot.jbcrypt.BCrypt;

import java.lang.reflect.Field;
import java.lang.reflect.Type;
import java.lang.reflect.ParameterizedType;
import java.util.List;


public class RepositoryBase<TEntity extends IEntity> implements IRepository<TEntity>, AutoCloseable{


    private  EntityManager _entityManager;
    private  String _queryBase;
    protected Class<TEntity> _type;

    private EntityFactory _entityFactory;
    //@Inject
    RepositoryBase(EntityManager entityManager, String queryBase, Class<TEntity> type, EntityFactory entityFactory)
    {
        this._entityManager = entityManager;
        this._queryBase = queryBase;
        this._type = type;
        this._entityFactory = entityFactory;
    }
    RepositoryBase()
    {
    }

    public List<TEntity> getAll()
    {
        return _entityManager.createNamedQuery(_queryBase+".getAll").getResultList();
    }

    public TEntity getById(long id){
        return _entityManager.find(_type, id);
    }

    public long Insert(TEntity entity)
    {
        _entityManager.persist(entity);
        return entity.getId();
    }

    public int generateBasicAccounts()
    {

        TypedQuery<UserEntity> query = _entityManager.createNamedQuery("User.getByEmail", UserEntity.class);
        query.setParameter("email", "client@test.com");
        List<UserEntity> results = query.getResultList();
        if (!results.isEmpty())
            return -1;

        Address address = new Address();
        address.setCity("Brno");
        address.setStreet("empstreet");
        address.setZipCode("12345");
        address.setState("CZ");

        EmployeeEntity manager = new EmployeeEntity();
        manager.setPasswordHash(BCrypt.hashpw("123456", BCrypt.gensalt()));
        manager.setRole("MANAGER");
        manager.setEmail("manager@test.com");
        manager.setAddress(address);

        manager.setName("Pepa");
        manager.setSurname("Novak");

        EmployeeEntity cleaner = new EmployeeEntity();
        cleaner.setPasswordHash(BCrypt.hashpw("123456", BCrypt.gensalt()));
        cleaner.setRole("CLEANER");
        cleaner.setEmail("cleaner@test.com");
        cleaner.setAddress(address);

        cleaner.setName("Pepa");
        cleaner.setSurname("Novak");

        EmployeeEntity cook = new EmployeeEntity();
        cook.setPasswordHash(BCrypt.hashpw("123456", BCrypt.gensalt()));
        cook.setRole("COOK");
        cook.setEmail("cook@test.com");
        cook.setAddress(address);

        cook.setName("Pepa");
        cook.setSurname("Novak");

        EmployeeEntity receptionist = new EmployeeEntity();
        receptionist.setPasswordHash(BCrypt.hashpw("123456", BCrypt.gensalt()));
        receptionist.setRole("RECEPTIONIST");
        receptionist.setEmail("receptionist@test.com");
        receptionist.setAddress(address);

        receptionist.setName("Pepa");
        receptionist.setSurname("Novak");

        UserEntity user = new UserEntity();
        user.setPasswordHash(BCrypt.hashpw("123456", BCrypt.gensalt()));
        user.setEmail("client@test.com");
        user.setName("Pepa");


        _entityManager.persist(user);
        _entityManager.persist(receptionist);
        _entityManager.persist(cook);
        _entityManager.persist(cleaner);
        _entityManager.persist(manager);

        return 1;
    }

    public long entityGenerator(){

        IEntity entity = _entityFactory.getEntity(_type);
        _entityManager.persist(entity);
        return entity.getId();
    }

    public long UpdateField(UpdateFieldModel model) throws Exception {


           if (model.fieldName.equals("password")) {

               model.fieldName = "passwordHash";

               String param = (String) model.value;
               model.value = (BCrypt.hashpw(param, BCrypt.gensalt()));

           }

           if (_type.equals(EmployeeEntity.class))
           {
               if (model.fieldName.equals("zipCode") || model.fieldName.equals("street") ||
                       model.fieldName.equals("city") || model.fieldName.equals("state")) {

                   EmployeeEntity employee = (EmployeeEntity) _entityManager.find(_type, model.id);
                   Address address = employee.getAddress();
                   Field field = Address.class.getDeclaredField(model.fieldName);
                   field.setAccessible(true);
                   field.set(address, model.value);
                   employee.setAddress(address);
                   return employee.getId();

               }
           }

        Field field = _type.getDeclaredField(model.fieldName);
        var entity = _entityManager.find(_type, model.id);


        if (entity != null) {

            field.setAccessible(true);
            if(field.getType().equals(List.class)){
                var list = (List) field.get(entity);

                if(list.contains(model.value)){
                    list.remove(model.value);
                }
                else{
                    list.add(model.value);
                }
                field.set(entity,list);
            }
            else{
                field.set(entity, model.value);
            }
            return entity.getId();
        }

       return -1;
    }

    public void removeAll()
    {
        _entityManager.createNamedQuery(_queryBase+".removeAll");
    }

    public void removeById(long id)
    {
        _entityManager.remove(_entityManager.find(_type, id));
    }

    public long Update(TEntity entity)
    {
        _entityManager.merge(entity);
        return entity.getId();
    }


    @Override
    public void close() throws Exception {
        _entityManager.close();
    }
}
