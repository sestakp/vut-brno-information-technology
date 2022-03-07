/*
* Author: Vojtěch Kulíšek
*/
const ROUTES = [
    {
        name: 'login',
        path: '/login',
    },
    {
        name: 'register',
        path: '/register',
    },
    {
        name: 'forgot-password',
        path: '/forgot-password',
    },
    {
        name: 'reset-password',
        path: '/reset-password',
    },
    {
        name: 'home',
        path: '/',
    },
    {
        name: 'profile',
        path: '/profile',
    },
    {
        name: 'conference',
        path: '/conference',
    },    
    {
        name: 'conferenceDetail',
        path: '/conference/detail/:id',
    },  
    {
        name: 'conferenceUpdate',
        path: '/conference/update',
    },
    {
        name: 'conferenceReservation',
        path: '/conference/reservation/:id',
    },
    {
        name: 'presentation',
        path: '/presentation',
    },    
    {
        name: 'presentationDetail',
        path: '/presentation/detail/:id',
    },    
    {
        name: 'presentationUpdate',
        path: '/presentation/update',
    },
    {
        name: 'room',
        path: '/room',
    },
    {
        name: 'roomDetail',
        path: '/room/detail/:id',
    },    
    {
        name: 'roomUpdate',
        path: '/room/update',
    },
    {
        name: 'ticket',
        path: '/ticket',
    }
];

const NavBarLinks = [
    {
        name: 'Conferences',
        path: '/',
    },
    {
        name: 'Profile',
        path: '/profile',
    },
];

const getAllRoutes = () => {
    return ROUTES;
};

const getAllNavLinks = () => {
    return NavBarLinks;
};

const getRoute = (name, params) => {
    let route = ROUTES.filter((route) => route.name === name)[0];
    if (params) {
        for (const [key, value] of Object.entries(params)) {
            route = { ...route, path: route.path.replace(`:${key}`, value) };
        }
    }
    return route;
};

export { getAllRoutes, getRoute, getAllNavLinks };
