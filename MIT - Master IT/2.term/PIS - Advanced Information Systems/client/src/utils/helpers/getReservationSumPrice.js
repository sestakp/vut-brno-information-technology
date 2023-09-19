import prices from "../prices";



const getReservationSumPrice = (reservation) => {
    var endDate = new Date(reservation.endDate)
    var startDate = new Date(reservation.startDate)
    
    const diffTime = Math.abs(endDate - startDate);
    const numberOfDaysInReservation = Math.ceil((diffTime / (1000 * 60 * 60 * 24)) + 1); 

    let sum_price = 0;

    let reservedRooms = []

    if(reservation.selectedRooms !== undefined){
        reservedRooms = reservation.rooms.filter(r => reservation.selectedRooms.includes(r.id))
    }
    else{
        reservedRooms = reservation.rooms
    }

    for(var i = 0; i < reservedRooms.length; i++){
        var room = reservedRooms[i]
        sum_price += room.price * numberOfDaysInReservation
    }

    sum_price += reservation.normalBreakfast * prices.normalBreakfast * numberOfDaysInReservation
    sum_price += reservation.veganBreakfast * prices.veganBreakfast * numberOfDaysInReservation
    sum_price += reservation.vegetarianBreakfast * prices.vegetarianBreakfast * numberOfDaysInReservation

    
    sum_price += Number(reservation.insideParking) * prices.insideParking * numberOfDaysInReservation
    sum_price += Number(reservation.outsideParking) * prices.outsideParking * numberOfDaysInReservation
    sum_price += Number(reservation.vipParking) * prices.vipParking * numberOfDaysInReservation

    return sum_price;
}

export default getReservationSumPrice