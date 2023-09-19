package cz.vutbr.fit.api.dal.repositories;

import cz.vutbr.fit.api.dal.entity.UserEntity;
import cz.vutbr.fit.api.dal.factories.EntityFactory;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.TypedQuery;
import org.hsqldb.rights.User;

import java.util.List;

@RequestScoped
public class UserRepository extends RepositoryBase<UserEntity>{

    private EntityManager _entityManager;

    @Inject
    UserRepository(EntityManager entityManager, EntityFactory entityFactory)
    {
        super(entityManager, "User", UserEntity.class, entityFactory);
        this._entityManager = entityManager;

    }

    UserRepository()
    {

    }

    public long Insert(UserEntity entity)
    {
        var result = _entityManager.createNamedQuery("User.getByEmail", UserEntity.class).setParameter("email", entity.getEmail()).getResultList();

        if (result.isEmpty()) {
            return super.Insert(entity);
        }

        else return -1;

    }



    public UserEntity getUserByEmail(String email){
        return ( _entityManager.createNamedQuery("User.getByEmail", UserEntity.class).setParameter("email", email).getResultList().stream().findFirst().orElse(null) );
    }

}
