import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { useImmerReducer } from "use-immer";

// MUI imports
import { Typography, Button, Grid, TextField, Snackbar, Alert } from '@mui/material'

// Contexts
import DispatchContext from '../Contexts/DispatchContext';

function Login() {
  const navigate = useNavigate();
  const GlobalDispatch = useContext(DispatchContext);

  const initialState = {
    usernameValue: "",
    passwordValue: "",
    sendRequest: 0,
    token: "",
    openSnack: false,
    disabledBtn: false,
    serverError: false,
  };

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchUsernameChange":
        draft.usernameValue = action.usernameChosen;
        draft.serverError = false;
        break;
      case "catchPasswordChange":
        draft.passwordValue = action.passwordChosen;
        draft.serverError = false;
        break;
      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break;
      case "catchToken":
        draft.token = action.tokenValue;
        break;
      case "openTheSnack":
        draft.openSnack = true;
        break;
      case "disableTheButton":
        draft.disabledBtn = true;
        break;
      case "allowTheButton":
        draft.disabledBtn = false;
        break;
      case "catchServerError":
        draft.serverError = true;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  function FormSubmit(e) {
    e.preventDefault();
    console.log("the form has benn submitted");
    dispatch({ type: 'changeSendRequest' });
    dispatch({ type: 'disableTheButton' });
  }
  useEffect(() => {
    if (state.sendRequest) {
      const source = Axios.CancelToken.source();
      async function SignIn() {
        try {
          const response = await Axios.post(
            'http://localhost:8000/api-auth-djoser/token/login/',
            {
              username: state.usernameValue,
              password: state.passwordValue,
            },
            {
              cancelToken: source.token,
            }
          );
          console.log(response);
          dispatch({ type: 'catchToken', tokenValue: response.data.auth_token });
          GlobalDispatch({ type: 'catchToken', tokenValue: response.data.auth_token });
        } catch (error) {
          console.log(error.response);
          dispatch({ type: 'allowTheButton' });
          dispatch({ type: 'catchServerError' });
        }
      }
      SignIn();
      return () => {
        source.cancel();
      };
    }
  }, [state.sendRequest]);

  // Get user info
  useEffect(() => {
    if (state.token !== '') {
      const source = Axios.CancelToken.source();
      async function GetUserInfo() {
        try {
          const response = await Axios.get(
            'http://localhost:8000/api-auth-djoser/users/me/',
            {
              headers: { Authorization: 'Token '.concat(state.token) }
            },
            {
              cancelToken: source.token,
            }
          );
          console.log(response);
          GlobalDispatch({ type: 'userSignsIn', usernameInfo: response.data.username, emailInfo: response.data.email, IdInfo: response.data.id });
          dispatch({ type: 'openTheSnack' });
        } catch (error) {
          console.log(error.response);
        }
      }
      GetUserInfo();
      return () => {
        source.cancel();
      };
    }
  }, [state.token]);

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [state.openSnack]);

  return (
    <div style={{ width: '50%', marginLeft: 'auto', marginRight: 'auto', marginTop: '3rem', border: '5px solid ', padding: '3rem' }}>
      <form onSubmit={FormSubmit}>
        <Grid item container justifyContent='center' >
          <Typography variant="h4">ZALOGUJ SIĘ</Typography>
        </Grid>

        {state.serverError ? (<Alert severity="error">Nieprawidłowa nazwa użytkownika lub hasło!</Alert>
        ) : (
          ""
        )}

        <Grid item container style={{ marginTop: '1rem' }}>
          <TextField id="username" label="Nazwa użytkownika" variant="outlined" fullWidth value={state.usernameValue} onChange={(e) => dispatch({ type: 'catchUsernameChange', usernameChosen: e.target.value })} error={state.serverError ? true : false} />
        </Grid>
        <Grid item container style={{ marginTop: '1rem' }}>
          <TextField id="password" label="Hasło" variant="outlined" fullWidth type="password" value={state.passwordValue} onChange={(e) => dispatch({ type: 'catchPasswordChange', passwordChosen: e.target.value })} error={state.serverError ? true : false} />
        </Grid>

        <Grid item container xs={8} style={{ marginTop: '1rem', marginLeft: 'auto', marginRight: 'auto' }}>
          <Button variant="contained" color='success' fullWidth type="submit" style={{ fontSize: '1.1rem', marginLeft: '1rem', '&:hover': { backgroundColor: 'blue' } }} disabled={state.disabledBtn}>ZALOGU SIĘ</Button>
        </Grid>
      </form>

      <Snackbar
        open={state.openSnack}
        message="Jesteś zalogowany!"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      />
    </div>
  );
}
export default Login;