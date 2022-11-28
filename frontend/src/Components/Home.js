import React from 'react';
import { useNavigate } from 'react-router-dom';

// Assets
import background from './Assets/Images/background.jpg'

// MUI imports
import { Button, Typography } from '@mui/material'

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div style={{ position: "relative", zIndex: "100", }}>
        <img src={background} alt="" style={{ height: "92vh", width: "100%", }}></img>
        <div style={{ position: "absolute", zIndex: "100", top: '100px', left: '40px', textAlign: 'center' }} >
          <Typography variant='h2' style={{ color: "white", fontWeight: "bolder" }}>
            POZNAJ <span style={{ color: 'yellow' }}>DZIEDZICTWO KULTUROWE</span> LASÓW PAŃSTWOWYCH
          </Typography>
          <Button
            color='success'
            variant='contained'
            onClick={() => navigate("/map")}
            style={{ fontSize: "2rem", borderRadius: "15px", marginTop: '2rem', boxShadow: '3px 3px 3px white' }}> ZOBACZ ZABYTKI</Button>
        </div>
      </div>
    </>
  );
}
export default Home;