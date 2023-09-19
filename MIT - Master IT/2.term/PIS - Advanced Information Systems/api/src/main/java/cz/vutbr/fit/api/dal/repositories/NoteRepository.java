package cz.vutbr.fit.api.dal.repositories;

import cz.vutbr.fit.api.dal.entity.EmployeeEntity;
import cz.vutbr.fit.api.dal.entity.NoteEntity;
import cz.vutbr.fit.api.dal.entity.ReservationEntity;
import cz.vutbr.fit.api.dal.entity.RoomEntity;
import cz.vutbr.fit.api.dal.factories.EntityFactory;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;

import java.util.List;

@RequestScoped
public class NoteRepository extends RepositoryBase<NoteEntity> {

    private EntityManager _entityManager;
    @Inject
    NoteRepository(EntityManager entityManager, EntityFactory entityFactory)
    {
        super(entityManager, "Note", NoteEntity.class, entityFactory);
        this._entityManager = entityManager;
    }

    NoteRepository()
    {

    }

    public void removeById(long id)
    {
        Query query = _entityManager.createQuery(
                "SELECT r FROM RoomEntity r JOIN r.notes n WHERE n.id = :noteId",
                RoomEntity.class);
        query.setParameter("noteId", id);
        List<RoomEntity> rooms = query.getResultList();

        Query query2 = _entityManager.createQuery(
                "SELECT r FROM ReservationEntity r JOIN r.notes n WHERE n.id = :noteId",
                ReservationEntity.class);
        query2.setParameter("noteId", id);
        List<ReservationEntity> reservations = query2.getResultList();

        for (RoomEntity room : rooms)
        {
            List<NoteEntity> notes = room.getNotes();
            notes.remove(_entityManager.find(_type, id));
            room.setNotes(notes);
        }

        for (ReservationEntity reservation : reservations)
        {
            List<NoteEntity> notes = reservation.getNotes();
            notes.remove(_entityManager.find(_type, id));
            reservation.setNotes(notes);
        }


        _entityManager.remove(_entityManager.find(_type, id));
    }

}
