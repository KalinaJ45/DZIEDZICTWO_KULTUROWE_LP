import React, { useContext, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

// MUI imports
import { AppBar, Toolbar, Typography, IconButton, Button, Menu, MenuItem, Snackbar } from '@mui/material'

// Contexts
import StateContext from '../Contexts/StateContext';
import DispatchContext from '../Contexts/DispatchContext';

// Assets
import logoLP from './Assets/Images/LogoLP.png'

function Header() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const GlobalDispatch = useContext(DispatchContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function HandleProfile() {
    setAnchorEl(null);
    navigate("/profile");
  };

  const [openSnack, setOpenSnack] = useState(false);

  async function HandleLogout() {
    setAnchorEl(null);
    const confirmLogout = window.confirm('Czy na pewno chcesz się wylogować?');
    if (confirmLogout) {
      try {
        const response = await Axios.post("http://localhost:8000/api-auth-djoser/token/logout/", GlobalState.userToken, { headers: { Authorization: 'Token '.concat(GlobalState.userToken) } }
        );
        console.log(response);
        GlobalDispatch({ type: "logout" });
        setOpenSnack(true);
        navigate("/");
      } catch (e) {
        console.log(e.response);
      }
    }
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <AppBar position="static" style={{ backgroundColor: 'black' }}>
        <Toolbar>
          <div style={{ marginRight: 'auto' }}>
            <IconButton href='https://www.lasy.gov.pl/pl' style={{ marginLeft: '1rem' }}>
              <img src={logoLP} alt='Forest museum icon' style={{ height: '3.4rem' }}></img>
            </IconButton>
            <Button color="inherit" onClick={() => navigate("/")}>
              <Typography variant="h5" style={{ marginLeft: '1rem' }} >
                DZIEDZICTWO KULTUROWE LP
              </Typography>
            </Button>
          </div>
          <div>
            <Button color="inherit" onClick={() => navigate("/map")}>
              <Typography variant="h6" style={{ marginLeft: '2rem', marginRight: '2rem' }} >
                MAPA ZABYTKÓW
              </Typography>
            </Button>
            <Button color="inherit" onClick={() => navigate("/forestinspectorates")}>
              <Typography variant="h6" style={{ marginRight: '1rem' }} >
                NADLEŚNICTWA
              </Typography>
            </Button>
          </div>

          {GlobalState.userIsLogged ? (
            <div style={{ marginLeft: 'auto', marginRight: '1rem' }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate("/addmonument")}
                style={{ width: '11rem', fontSize: '1.1rem', marginRight: '1rem' }} >
                DODAJ ZABYTEK
              </Button>
              <Button
                onClick={handleClick}
                style={{ backgroundColor: 'white', color: 'black', width: '11rem', fontSize: '1.1rem', marginLeft: '0.5rem', ':hover': { backgroundColor: '#006453' } }}>
                {GlobalState.userUsername}
              </Button>
            </div>
          ) : (
            <div style={{ marginLeft: 'auto', marginRight: '1rem' }}>
              <Button
                variant="contained"
                color="success"
                disabled
                style={{ width: '11rem', fontSize: '1.1rem', marginRight: '1rem' }} >
                DODAJ ZABYTEK
              </Button>
              <Button onClick={() => navigate("/login")} style={{ backgroundColor: 'white', color: 'black', width: '11rem', fontSize: '1.1rem', marginLeft: '0.5rem', ':hover': { backgroundColor: '#006453' } }}>
                ZALOGUJ SIĘ
              </Button>
            </div>
          )}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem
              style={{ backgroundColor: 'red', color: 'white', width: '15rem', fontWeight: 'bolder', borderRadius: '15px', marginBottom: '0.25rem', }}
              onClick={HandleProfile}>
              Profil
            </MenuItem>
            <MenuItem
              style={{ backgroundColor: '#2E7D32', color: 'white', width: '15rem', fontWeight: 'bolder', borderRadius: '15px' }}
              onClick={HandleLogout}>
              Wylogowanie
            </MenuItem>
          </Menu>
          <Snackbar
            open={openSnack}
            onClose={() => setOpenSnack(false)}
            message="Zostałeś wylogowany!"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            autoHideDuration={1500}
          />
        </Toolbar>
      </AppBar>
    </div>
  );
}
export default Header;


