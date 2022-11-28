import React, { useEffect } from 'react';
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// MUI imports
import { CssBaseline } from '@mui/material'

// Components
import Home from './Components/Home';
import Map from './Components/Map';
import Login from './Components/Login';
import Header from './Components/Header';
import AddMonument from './Components/AddMonument';
import Profile from './Components/Profile';
import ForestInspectorates from './Components/ForestInspectorates';
import ForestInspectorateDetail from './Components/ForestInspectorateDetail';
import MonumentDetail from './Components/MonumentDetail';


// Contexts
import DispatchContext from './Contexts/DispatchContext';
import StateContext from './Contexts/StateContext';


function App() {

  const initialState = {
    userUsername: localStorage.getItem('theUserUsername'),
    userEmail: localStorage.getItem('theUserEmail'),
    userId: localStorage.getItem('theUserId'),
    userToken: localStorage.getItem('theUserToken'),
    userIsLogged: localStorage.getItem('theUserUsername') ? true : false,
  };

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchToken":
        draft.userToken = action.tokenValue;
        break;
      case "userSignsIn":
        draft.userUsername = action.usernameInfo;
        draft.userEmail = action.emailInfo;
        draft.userId = action.IdInfo;
        draft.userIsLogged = true;
        break;
      case "logout":
        draft.userIsLogged = false;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  useEffect(() => {
    if (state.userIsLogged) {
      localStorage.setItem('theUserUsername', state.userUsername);
      localStorage.setItem('theUserEmail', state.userEmail);
      localStorage.setItem('theUserId', state.userId);
      localStorage.setItem('theUserToken', state.userToken);
    }
    else {
      localStorage.removeItem('theUserUsername');
      localStorage.removeItem('theUserEmail');
      localStorage.removeItem('theUserId');
      localStorage.removeItem('theUserToken');
    }
  }, [state.userIsLogged]);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <CssBaseline />
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/map' element={<Map />} />
            <Route path='/login' element={<Login />} />
            <Route path='/addmonument' element={<AddMonument />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/forestinspectorates' element={<ForestInspectorates />} />
            <Route path='/forestinspectorates/:id' element={<ForestInspectorateDetail />} />
            <Route path='/monuments/:id' element={<MonumentDetail />} />
            <Route path='/forestinspectorates/:id' element={<ForestInspectorateDetail />} />
          </Routes>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;