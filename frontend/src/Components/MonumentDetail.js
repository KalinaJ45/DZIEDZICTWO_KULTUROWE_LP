import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// Contexts
import StateContext from "../Contexts/StateContext";

// Assets
import defaultProfilePicture from "./Assets/Images/defaultPicture.jpg";

// Components
import MonumentUpdate from "./MonumentUpdate"

// MUI
import { Grid, Button, CircularProgress, Typography, Breadcrumbs, Link, Dialog, Snackbar } from "@mui/material";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import RoomIcon from '@mui/icons-material/Room';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

function MonumentDetail() {
	const navigate = useNavigate();
	const GlobalState = useContext(StateContext);
	const params = useParams();

	const initialState = {
		dataIsLoading: true,
		monumentInfo: "",
		administratorProfileInfo: "",
		openSnack: false,
		disabledBtn: false,
	};

	function ReducerFuction(draft, action) {
		switch (action.type) {
			case "catchMonumentInfo":
				draft.monumentInfo = action.monumentObject;
				break;

			case "loadingDone":
				draft.dataIsLoading = false;
				break;

			case "catchAdministratorProfileInfo":
				draft.administratorProfileInfo = action.profileObject;
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
		}
	}

	const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);
	const [currentPicture, setCurrentPicture] = useState(0);

	function NextPicture() {
		if (currentPicture === monumentPictures.length - 1) {
			return setCurrentPicture(0)
		}
		else {
			return setCurrentPicture(currentPicture + 1)
		}
	}

	function PreviousPicture() {
		if (currentPicture === 0) {
			return setCurrentPicture(monumentPictures.length - 1)
		}
		else {
			return setCurrentPicture(currentPicture - 1)
		}
	}

	async function DeleteHandler() {
		const confirmDelete = window.confirm("Czy na pewno chcesz usunąć obiekt?");
		if (confirmDelete) {
			try {
				const response = await Axios.delete(
					`http://localhost:8000/api/monuments/${params.id}/delete/`
				);
				console.log(response.data);
				dispatch({ type: 'openTheSnack' });
				dispatch({ type: 'disableTheButton' });


			} catch (e) {
				dispatch({ type: 'allowTheButton' });
				console.log(e.response.data);
			}
		}
	}

	useEffect(() => {
		if (state.openSnack) {
			setTimeout(() => {
				navigate("/map");
			}, 1500);
		}
	}, [state.openSnack]);

	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	// request to get monument info
	useEffect(() => {
		async function GetMonumentInfo() {
			try {
				const response = await Axios.get(
					`http://localhost:8000/api/monuments/${params.id}/`
				);
				console.log(response.data);
				dispatch({
					type: "catchMonumentInfo",
					monumentObject: response.data,
				});

			} catch (e) {
				console.log(e.response);
			}
		}
		GetMonumentInfo();
	}, []);

	// request to get profile info
	useEffect(() => {
		if (state.monumentInfo) {
			async function GetProfileInfo() {
				try {
					const response = await Axios.get(
						`http://localhost:8000/api/profiles/${state.monumentInfo.administrator}/`
					);
					console.log(response.data);
					dispatch({
						type: "catchAdministratorProfileInfo",
						profileObject: response.data,
					});
					dispatch({ type: "loadingDone" });
				} catch (e) {
					console.log(e.response);
				}
			}
			GetProfileInfo();
		}

	}, [state.monumentInfo]);

	const monumentPictures = [state.monumentInfo.picture1, state.monumentInfo.picture2, state.monumentInfo.picture3].filter((picture) => picture !== null)

	if (state.dataIsLoading === true) {
		return (
			<Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
				<CircularProgress color="success" />
			</Grid>
		);
	}

	return (
		<div style={{ marginLeft: '2rem', marginRight: '2rem', marginBottom: '2rem' }}>
			<Grid item style={{ marginTop: '1rem' }}>

				<Breadcrumbs aria-label="breadcrumb">
					<Link underline="hover" color="inherit" onClick={() => navigate("/map")} style={{ cursor: 'pointer' }}>
						Mapa
					</Link>

					<Typography color="text.primary">{state.monumentInfo.name}</Typography>
				</Breadcrumbs>
			</Grid>
			{/* image slider */}
			{monumentPictures.length > 0 ? (
				<Grid item container justifyContent='center' style={{ position: 'relative', marginTop: '1rem' }}>
					{monumentPictures.map((picture, index) => {
						return (
							<div key={index}>

								{index === currentPicture ? (<img src={picture} style={{ width: "45rem" }} />) : ("")}

							</div>
						)
					})}
					<ArrowCircleLeftIcon onClick={PreviousPicture} style={{ position: 'absolute', marginTop: '1rem', cursor: 'pointer', fontSize: '3rem', color: 'white', top: '50%', left: '27.5%' }} />
					<ArrowCircleRightIcon onClick={NextPicture} style={{ position: 'absolute', marginTop: '1rem', cursor: 'pointer', fontSize: '3rem', color: 'white', top: '50%', right: '27.5%' }} />

				</Grid>
			) : ("")}

			{/* more information */}
			<Grid item container style={{ padding: '1rem', border: '1px solid black', marginTop: '1rem' }}>
				<Grid item container direction='column' xs={7} spacing={1}>
					<Grid item>
						<Typography variant='h6' style={{ color: '#2E7D32' }}>  {state.monumentInfo.name} </Typography>
					</Grid>
					<RoomIcon />{" "}
					<Grid item >
						<Typography variant='subtitle1'> NADLEŚNICTWO {state.monumentInfo.administrator_forest_inspectorate} </Typography>
					</Grid>
					<Grid item >
						<Typography variant='subtitle1'> RDLP {state.monumentInfo.administrator_rdlp} </Typography>
					</Grid>
				</Grid>
				<Grid item container xs={5} alignItems='center'>
					<Grid item>
						<Typography variant='subtitle1' style={{ color: '#2E7D32', fontWeight: 'bolder' }}> {state.monumentInfo.function} | {state.monumentInfo.chronology}</Typography>
					</Grid>

				</Grid>
			</Grid>
			<Grid item container style={{ padding: '1rem', border: '1px solid black', marginTop: '1rem' }} justifyContent='flex-start'>
				{state.monumentInfo.availability ? (
					<Grid item xs={4} style={{ display: 'flex' }}>
						<CheckBoxIcon style={{ color: '#2E7D32', fontSize: '2rem' }} /> {" "}
						<Typography variant='subtitle1'>Obiekt dostępny dla turystów</Typography>
					</Grid>
				) : (
					<Grid item xs={4} style={{ display: 'flex' }}>
						<PriorityHighIcon /> {" "}
						<Typography variant='subtitle1'>Obiekt jest niedostępny dla turystów</Typography>
					</Grid>
				)}

				{state.monumentInfo.lease ? (
					<Grid item xs={4} style={{ display: 'flex' }}>
						<CheckBoxIcon style={{ color: '#2E7D32', fontSize: '2rem' }} /> {" "}
						<Typography variant='subtitle1'>Obiekt dzierżawiony</Typography>
					</Grid>
				) : ""}

			</Grid>
			{state.monumentInfo.description ? (
				<Grid item style={{ padding: '1rem', border: '1px solid black', marginTop: '1rem' }}>

					<Typography variant='subtitle1'>{state.monumentInfo.description}</Typography>
				</Grid>
			) : ""}
			{GlobalState.userId == state.monumentInfo.administrator ? (
				<Grid item container justifyContent='center'>
					<Button variant="contained" color="primary" onClick={handleClickOpen}>UAKTUALNIJ</Button>
					<Button variant="contained" color="error" onClick={DeleteHandler} disabled={state.disabledBtn}>USUŃ</Button>
					<Dialog open={open} onClose={handleClose} fullScreen >
						<MonumentUpdate monumentData={state.monumentInfo} closeDialog={handleClose} />
					</Dialog>
				</Grid>


			) : ('')}

			{/* administrator Info */}
			<Grid
				container
				style={{
					width: "50%",
					marginLeft: "auto",
					marginRight: "auto",
					border: "5px solid black",
					marginTop: "1rem",
					padding: "5px",
				}}
			>
				<Grid item xs={5}>
					<img
						style={{ height: "10rem", width: "15rem", cursor: 'pointer' }}
						src={
							state.administratorProfileInfo.profile_picture !== null
								? state.administratorProfileInfo.profile_picture
								: defaultProfilePicture
						}
						onClick={() => navigate(`/forestinspectorates/${state.administratorProfileInfo.administrator}/`)}
					/>
				</Grid>
				<Grid
					item
					container
					direction="column"
					justifyContent="center"
					xs={7}
				>
					<Grid item>
						<Typography
							variant="h5"
							style={{ textAlign: "center", marginTop: "1rem" }}
						>

							<span style={{ color: '#2E7D32', fontWeight: "bolder" }}>
								NADLEŚNICTWO {state.administratorProfileInfo.administrator_forest_inspectorate}
							</span>
						</Typography>
					</Grid>
					<Grid item>
						<Typography
							variant="h5"
							style={{ color: "gray", textAlign: "center", marginTop: "1rem" }}
						>
							<LocalPhoneIcon /> {state.administratorProfileInfo.phone_number}
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			<Snackbar
				open={state.openSnack}
				message="Zabytek został usunięty z bazy!"
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
			/>
		</div>

	);
}
export default MonumentDetail;
