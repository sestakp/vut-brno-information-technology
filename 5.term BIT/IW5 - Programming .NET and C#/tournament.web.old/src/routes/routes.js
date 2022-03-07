const ROUTES = [
    {
        name: 'Game',
        path: '/Game',
    },
    {
        name: 'Person',
        path: '/Person',
    },
    {
        name: 'Result',
        path: '/Result',
    },
    {
        name: 'Slot',
        path: '/Slot',
    },
    {
        name: 'Team',
        path: '/Team',
    },
    {
        name: 'TournamentPlacement',
        path: '/TournamentPlacement',
    },
    {
        name: 'Home',
        path: '/',
    },
];

const NavBarLinks = [
    {
        name: 'Game',
        path: '/Game',
        label: "Games",
    },
    {
        name: 'Person',
        path: '/Person',
        label: "Persons",
    },
    {
        name: 'Result',
        path: '/Result',
        label: "Results"
    },
    {
        name: 'Slot',
        path: '/Slot',
        label: 'Slots',
    },
    {
        name: 'Team',
        path: '/Team',
        label: 'Teams',
    },
    {
        name: 'TournamentPlacement',
        path: '/TournamentPlacement',
        label: 'Tournament placements',
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
