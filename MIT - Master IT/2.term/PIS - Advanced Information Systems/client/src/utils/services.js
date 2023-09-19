import { BsSnow } from 'react-icons/bs';
import { MdPets } from 'react-icons/md';
import { MdAccessible } from 'react-icons/md';
import { AiOutlineWifi } from 'react-icons/ai';

const services = {
    AIRCONDITIONER: {
        key: "AIRCONDITIONER",
        index: 0,
        name: "Air conditioner",
        icon: BsSnow
    },

    PET_FRIENDLY: {
        key: "PET_FRIENDLY",
        index: 1,
        name: "Pet friendly",
        icon: MdPets
    },

    ACCESIBLE: {
        key: "ACCESIBLE",
        index: 2,
        name: "Accesible",
        icon: MdAccessible
    },

    WIFI: {
        key: "WIFI",
        index: 3,
        name: "WIFI",
        icon: AiOutlineWifi
    }


}

export default services