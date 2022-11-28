import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useImmerReducer } from "use-immer";
import { useNavigate } from 'react-router-dom';

// React leaflet
import { MapContainer, TileLayer, Marker, Popup, WMSTileLayer, LayersControl, useMap, } from 'react-leaflet';
import { Icon } from 'leaflet';

// MUI
import { Grid, CircularProgress, AppBar, Typography, Button, Card, CardHeader, CardMedia, CardContent, IconButton, CardActions } from "@mui/material";
import RoomIcon from '@mui/icons-material/Room';

// Map icons
import archeologiczneiIconPng from './Assets/Mapicons/archeologiczneIcon.png'
import nieruchomeIconPng from './Assets/Mapicons/nieruchomeIcon.png'
import ruchomeIconPng from './Assets/Mapicons/ruchomeIcon.png'

// Legend images
import nadlesnictwaImagePng from './Assets/Legendimages/nadlesnictwaImage.png'
import rdlpImagePng from './Assets/Legendimages/rdlpImage.png'

// Default image
import defaultPicture from './Assets/Images/defaultPicture.jpg'


function Map() {
  const navigate = useNavigate();
  const archeologiczneIcon = new Icon({
    iconUrl: archeologiczneiIconPng,
    iconSize: [40, 40],
  });
  const nieruchomeIcon = new Icon({
    iconUrl: nieruchomeIconPng,
    iconSize: [40, 40],
  });
  const ruchomeIcon = new Icon({
    iconUrl: ruchomeIconPng,
    iconSize: [40, 40],
  });

  const [monuments, setMonuments] = useState([]);
  const [dataIsLoading, setDataIsLoading] = useState(true);

  const initialState = {
    mapInstance: null,
  };

  function ReducerFuction(draft, action) {
    switch (action.type) {

      case "getMap":
        draft.mapInstance = action.mapData;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

  function TheMapComponent() {
    const map = useMap();
    dispatch({ type: "getMap", mapData: map });
    return null;
  }

  function ImageDisplay(monument) {
    if (monument.picture1 === null && monument.picture2 !== null) {
      return monument.picture2;
    }
    else if (monument.picture1 === null && monument.picture2 === null && monument.picture3 !== null) {
      return monument.picture3;
    }
    else if (monument.picture1 === null && monument.picture2 === null && monument.picture3 === null) {
      return defaultPicture;
    }
    else {
      return monument.picture1;
    }
  }

  useEffect(() => {
    const source = Axios.CancelToken.source();
    async function GetMonuments() {
      try {
        const response = await Axios.get('http://localhost:8000/api/monuments/',
          { cancelToken: source.token });
        setMonuments(response.data);
        setDataIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    }
    GetMonuments();
    return () => {
      source.cancel();
    }
  }, []);

  if (dataIsLoading === true) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <CircularProgress color="success" />
      </Grid>
    )
  }

  return (
    <Grid container>
      <Grid item xs={4}>
        {monuments.map((monument) => {
          return (
            <Card key={monument.id} style={{ margin: '0.5rem', border: '1px solid black' }}>
              <CardHeader
                action={
                  <IconButton aria-label="settings" onClick={() => state.mapInstance.flyTo([monument.latitude, monument.longitude], 16)}>
                    <RoomIcon />
                  </IconButton>
                }
                title={monument.name}
              />
              <CardMedia
                style={{ paddingRight: '1rem', paddingLeft: '1rem', height: '20rem', width: '30rem', cursor: 'pointer' }}
                component="img"
                image={ImageDisplay(monument)}
                alt={monument.name}
                onClick={() => navigate(`/monuments/${monument.id}/`)}
              />
              <CardContent>
                <Typography variant="body2">
                  {monument.description.substring(0, 100)}...
                </Typography>
              </CardContent>
              {<CardActions disableSpacing>
                <IconButton aria-label="add to favorites" onClick={() => navigate(`/forestinspectorates/${monument.administrator_id}/`)}>
                  Nadleśnictwo {monument.administrator_forest_inspectorate}
                </IconButton>
              </CardActions>}
            </Card>
          );
        })}
      </Grid>
      <Grid item xs={8} style={{ marginTop: '0.5rem' }}>
        <AppBar position='sticky'>
          <div style={{ height: "100vh" }}>
            <MapContainer center={[52.11, 19.21]} zoom={6} scrollWheelZoom={true}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <TheMapComponent />
              {monuments.map((monument) => {
                function IconDisplay() {
                  if (monument.category === 'Zabytek archeologiczny') {
                    return archeologiczneIcon;
                  }
                  else if (monument.category === 'Zabytek nieruchomy') {
                    return nieruchomeIcon;
                  }
                  else if (monument.category === 'Zabytek ruchomy') {
                    return ruchomeIcon;
                  }
                }
                return (
                  <Marker
                    key={monument.id}
                    icon={IconDisplay()}
                    position={[
                      monument.latitude,
                      monument.longitude,
                    ]}
                  >
                    <Popup>
                      <Typography variant="h6" align="center">{monument.name}</Typography>
                      <div style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                        <img
                          alt=""
                          src={ImageDisplay(monument)}
                          style={{ height: "14rem", width: "18rem" }}
                          onClick={() => navigate(`/monuments/${monument.id}/`)}
                        />
                      </div>
                      <Typography variant="body1">{monument.description.substring(0, 100)}...</Typography>
                      <Button variant="contained" color='success' fullWidth onClick={() => navigate(`/monuments/${monument.id}/`)} style={{ marginTop: '0.5rem' }} >
                        ZOBACZ WIĘCEJ
                      </Button >
                    </Popup>
                  </Marker>
                );
              })}
              <LayersControl position="topright" collapsed={false}>
                <LayersControl.Overlay checked name={`<img src=${nadlesnictwaImagePng}></img> Nadleśnictwa`
                }>
                  <WMSTileLayer url="http://mapserver.bdl.lasy.gov.pl/arcgis/services/WMS_BDL_kat_wlasnosci/MapServer/WmsServer?" format="image/png" transparent='true' tiles='true' layers="5">
                  </WMSTileLayer>
                </LayersControl.Overlay>
                <LayersControl.Overlay checked name={`<img src=${rdlpImagePng}></img> RDLP`
                }>
                  <WMSTileLayer url="http://mapserver.bdl.lasy.gov.pl/arcgis/services/WMS_BDL_kat_wlasnosci/MapServer/WmsServer?" format="image/png" transparent='true' tiles='true' layers="6">
                  </WMSTileLayer>
                </LayersControl.Overlay>
              </LayersControl>
            </MapContainer>
          </div>
        </AppBar>
      </Grid>
    </Grid>
  );
}
export default Map;






