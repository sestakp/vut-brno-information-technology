package cz.vutbr.fit.api.dal.producers;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Disposes;
import jakarta.enterprise.inject.Produces;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

import java.util.HashMap;

@ApplicationScoped
public class EntityManagerFactoryProducer {

    @Produces
    @ApplicationScoped
    public EntityManagerFactory produceEntityManagerFactory() {
        return Persistence.createEntityManagerFactory("default", new HashMap<>());
    }

    public void close(@Disposes EntityManagerFactory entityManagerFactory) {
        entityManagerFactory.close();
    }
}