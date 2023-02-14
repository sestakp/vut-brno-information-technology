const ROUTES = [
  {
    name: "Game",
    path: "/Game",
  },
  {
    name: "GameUpdate",
    path: "/Game/Update",
  },
  {
    name: "GameDetail",
    path: "/Game/Detail/:id",
  },

  {
    name: "Player",
    path: "/Player",
  },
  {
    name: "PlayerUpdate",
    path: "/Player/Update",
  },
  {
    name: "PlayerDetail",
    path: "/Player/Detail/:id",
  },
  {
    name: "Slot",
    path: "/Slot",
  },
  {
    name: "SlotUpdate",
    path: "/Slot/Update",
  },
  {
    name: "SlotDetail",
    path: "/Slot/Detail/:id",
  },
  {
    name: "Team",
    path: "/Team",
  },
  {
    name: "TeamUpdate",
    path: "/Team/Update",
  },
  {
    name: "TeamDetail",
    path: "/Team/Detail/:id",
  },
  {
    name: "TournamentVenue",
    path: "/TournamentVenue",
  },
  {
    name: "TournamentVenueUpdate",
    path: "/TournamentVenue/Update",
  },  
  {
    name: "TournamentVenueDetail",
    path: "/TournamentVenue/Detail/:id",
  },
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Search",
    path: "/Search"
  }
];

const NavBarLinks = [
  {
    name: "Game",
    path: "/Game",
    label: "Games",
  },
  {
    name: "Player",
    path: "/Player",
    label: "Players",
  },
  {
    name: "Team",
    path: "/Team",
    label: "Teams",
  },
  {
    name: "TournamentVenue",
    path: "/TournamentVenue",
    label: "Tournament venues",
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
