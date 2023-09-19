



export default function filterRoomsInReservation(rooms, services, selectedRooms){
    if(services.length === 0) return rooms;
    let filteredRooms = rooms;
    services.forEach(s => {
        filteredRooms = filteredRooms.filter(r => r.services.includes(s) || selectedRooms.includes(r.id))
    });

    return filteredRooms

}