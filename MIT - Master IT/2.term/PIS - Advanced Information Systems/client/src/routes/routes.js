const ROUTES = [
  {
    name: "home",
    path: "/home",
  },
  {
    name: "credits",
    path: "/credits",
  },
  {
    name: "reserveRoom",
    path: "/reserveRoom",
  },
  {
    name: "signIn",
    path: "/signIn",
  },
  {
    name: "signUp",
    path: "/signUp",
  },

  {
    name: "profile",
    path: "/profile",
  },

  {
    name: "rooms",
    path: "/rooms",
  },

  {
    name: 'cleaner',
    path: '/cleaner',
  },
  {
    name: 'cook',
    path: '/cook',
  },

  {
    name: "employees",
    path: "/employees",
  },  
  {
    name: "receptionist",
    path: "/receptionist",
  },  
  {
    name: "doc",
    path: "/doc",
  },
];

const NavBarLinks = [
  {
    name: "Conferences",
    path: "/",
  },
  {
    name: "Profile",
    path: "/profile",
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
