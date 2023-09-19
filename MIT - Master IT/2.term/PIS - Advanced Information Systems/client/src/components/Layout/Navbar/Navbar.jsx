import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../assets/Logo';
import authorizationActions from '../../../redux/authorization/authorizationActions';
import authorizationSelector from '../../../redux/authorization/authorizationSelector';
import roles from '../../../utils/roles.js';
import "./Navbar.css";


const Navbar = (props) => {

  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  return (
    <AppBar position="static" style={{ color: "black" }}>
      <Container maxWidth="xl" style={{ color: "black" }}>
        <Toolbar disableGutters>
          <div onClick={() => navigate('/home')}>
            <Logo />
          </div>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={(e) => { navigate('/rooms'); handleCloseNavMenu(e) }}>
                <Typography textAlign="center">Rooms</Typography>
              </MenuItem>
              <MenuItem onClick={(e) => { navigate('/employees'); handleCloseNavMenu(e) }}>
                <Typography textAlign="center">Employees</Typography>
              </MenuItem>
              <MenuItem onClick={(e) => { navigate('/cleaner'); handleCloseNavMenu(e) }}>
                <Typography textAlign="center">Cleaner</Typography>
              </MenuItem>
              <MenuItem onClick={(e) => { navigate('/cook'); handleCloseNavMenu(e) }}>
                <Typography textAlign="center">Cook</Typography>
              </MenuItem>
              <MenuItem onClick={(e) => { navigate('/receptionist'); handleCloseNavMenu(e) }}>
                <Typography textAlign="center">Receptionist</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {props.currentUser.role === roles.MANAGER &&
              <Button
              onClick={(e) => { navigate('/rooms'); handleCloseNavMenu(e) }}
              sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Rooms
              </Button>
            }
            
            {props.currentUser.role === roles.MANAGER &&
              <Button
                onClick={(e) => { navigate('/employees'); handleCloseNavMenu(e) }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Employees
              </Button>
            }
            {(props.currentUser.role === roles.MANAGER || props.currentUser.role === roles.CLEANER) &&
              <Button
                onClick={(e) => { navigate('/cleaner'); handleCloseNavMenu(e) }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Cleaner
              </Button>
            }
            {(props.currentUser.role === roles.MANAGER || props.currentUser.role === roles.COOK) &&
              <Button
                onClick={(e) => { navigate('/cook'); handleCloseNavMenu(e) }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Cook
              </Button>
            }
            {(props.currentUser.role === roles.MANAGER || props.currentUser.role === roles.RECEPTIONIST) &&
              <Button
                onClick={(e) => { navigate('/receptionist'); handleCloseNavMenu(e) }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Receptionist
              </Button> 
            }
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {props.currentUser.role !== roles.COOK && props.currentUser.role !== roles.CLEANER &&
              <Button onClick={() => navigate('/reserveRoom')} variant="outlined" style={{ color: "white", borderColor: "white", marginRight: "15px" }}> Reserve room</Button>    
            }
            {props.currentUser.email !== ""  &&
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src={props.currentUser.avatar ?? "/static/images/avatar/2.jpg"} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={(e) => { navigate('/profile'); handleCloseUserMenu(e) }}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center" onClick={props.logout}>Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            }
            {props.currentUser.email === "" &&
              <>
                <Button onClick={() => navigate('/signIn')} variant="outlined" style={{ color: "white", borderColor: "white", marginRight: "15px" }}> Sign in</Button>
                <Button onClick={() => navigate('/signUp')} variant="outlined" style={{ color: "white", borderColor: "white", marginRight: "15px" }}> Sign up</Button>
              </>
            }
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}


const mapStateToProps = (state, ownProps) => ({
  currentUser: authorizationSelector.getUser(state),

});

const mapDispatchToProps = (dispatch, ownProps) => ({
 logout: () => dispatch(authorizationActions.logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);