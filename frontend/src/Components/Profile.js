import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// Contexts
import StateContext from "../Contexts/StateContext";

// Assets
import defaultProfilePicture from "./Assets/Images/defaultPicture.jpg";

// Components
import ProfileUpdate from "./ProfileUpdate";

// MUI
import { Grid, Button, TextField, Typography, CircularProgress } from "@mui/material";

function Profile() {
	const navigate = useNavigate();
	const GlobalState = useContext(StateContext);

	const initialState = {
		userProfile: {
			forestInspectorate: "",
			rdlp: "",
			address: "",
			phoneNumber: "",
			email: "",
			description: "",
			profilePic: "",
			administratorId: "",
			administratorMonuments: [],
		},
		dataIsLoading: true,
	};

	function ReducerFuction(draft, action) {
		switch (action.type) {

			case "catchUserProfileInfo":
				draft.userProfile.forestInspectorate = action.profileObject.administrator_forest_inspectorate;
				draft.userProfile.rdlp = action.profileObject.rdlp;
				draft.userProfile.address = action.profileObject.address;
				draft.userProfile.phoneNumber = action.profileObject.phone_number;
				draft.userProfile.email = action.profileObject.email;
				draft.userProfile.description = action.profileObject.description;
				draft.userProfile.profilePic = action.profileObject.profile_picture;
				draft.userProfile.administratorMonuments = action.profileObject.administrator_monuments;
				draft.userProfile.administratorId = action.profileObject.administrator;
				break;

			case 'loadingDone':
				draft.dataIsLoading = false;
				break;
		}
	}

	const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);


	// request to get profile info
	useEffect(() => {
		async function GetProfileInfo() {
			try {
				const response = await Axios.get(
					`http://localhost:8000/api/profiles/${GlobalState.userId}/`
				);
				console.log(response.data)
				dispatch({
					type: "catchUserProfileInfo",
					profileObject: response.data,
				});
				dispatch({ type: "loadingDone" });
			} catch (e) {
				console.log(e.response)

			}
		}
		GetProfileInfo();
	}, []);

	function MonumentsDisplay() {
		if (state.userProfile.administratorMonuments.length === 0) {
			return (
				<Button
					onClick={() => navigate(`/forestinspectorates/${state.userProfile.administratorId}`)}
					disabled
					size="small"
					color="success"
				>
					0 ZABYTKÓW
				</Button>
			);
		} else if (state.userProfile.administratorMonuments.length === 1) {
			return (
				<Button
					onClick={() => navigate(`/forestinspectorates/${state.userProfile.administratorId}`)}
					size="small"
					color="success"
				>
					1 ZABYTEK
				</Button>
			);

		} else if (state.userProfile.administratorMonuments.length.toString().endsWith('2') ||
			state.userProfile.administratorMonuments.length.toString().endsWith('3') ||
			state.userProfile.administratorMonuments.length.toString().endsWith('4')) {
			return (
				<Button
					onClick={() => navigate(`/forestinspectorates/${state.userProfile.administratorId}`)}
					size="small"
					color="success"
				>
					{state.userProfile.administratorMonuments.length} ZABYTKI
				</Button>
			);

		} else {
			return (
				<Button
					onClick={() => navigate(`/forestinspectorates/${state.userProfile.administratorId}`)}
					size="small"
					color="success"
				>
					{state.userProfile.administratorMonuments.length} ZABYTKÓW
				</Button>
			);
		}
	}

	function WelcomeDisplay() {
		if (
			state.userProfile.address === null ||
			state.userProfile.address === "" ||
			state.userProfile.phoneNumber === null ||
			state.userProfile.phoneNumber === "" ||
			state.userProfile.description === null ||
			state.userProfile.description === ""
		) {
			return (
				<Typography
					variant="h5"
					style={{ textAlign: "center", marginTop: "1rem" }}
				>
					Witaj{" "}
					<span style={{ color: "#2E7D32", fontWeight: "bolder" }}>
						{GlobalState.userUsername}
					</span>{" "}
					, prześlij poniższy formularz, aby uzupełnić swój profil.
				</Typography>
			);
		}
		else {
			return (
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
					<Grid item xs={6}>
						<img
							style={{ height: "10rem" }}
							src={
								state.userProfile.profilePic !== null
									? state.userProfile.profilePic
									: defaultProfilePicture
							}
						/>
					</Grid>
					<Grid
						item
						container
						direction="column"
						justifyContent="center"
						xs={6}
					>
						<Grid item>
							<Typography
								variant="h5"
								style={{ textAlign: "center", marginTop: "1rem" }}
							>
								Witaj{" "}
								<span style={{ color: "#2E7D32", fontWeight: "bolder" }}>
									{GlobalState.userUsername}
								</span>
							</Typography>
						</Grid>
						<Grid item>
							<Typography
								variant="h5"
								style={{ textAlign: "center", marginTop: "1rem" }}
							>
								Masz: {MonumentsDisplay()}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
			);
		}
	}

	if (state.dataIsLoading === true) {
		return (
			<Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
				<CircularProgress color="success" />
			</Grid>
		)
	};
	return (
		<>
			<div>{WelcomeDisplay()}</div>
			<ProfileUpdate userProfile={state.userProfile} />
		</>

	);
}
export default Profile;
