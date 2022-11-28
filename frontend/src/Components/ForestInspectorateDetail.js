import React, { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// Contexts
import StateContext from "../Contexts/StateContext";

// Assets
import defaultPicture from "./Assets/Images/defaultPicture.jpg";

// MUI
import { Grid, CircularProgress, Typography, Card, CardContent, CardMedia, CardActions } from "@mui/material";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';


function ForestInspectorateDetail() {
	const navigate = useNavigate();
	const GlobalState = useContext(StateContext);
	const params = useParams();

	const initialState = {
		userProfile: {
			forestInspectorate: "",
			rdlp: "",
			address: "",
			phoneNumber: "",
			administrator_email: "",
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
				draft.userProfile.administrator_email = action.profileObject.administrator_email;
				draft.userProfile.description = action.profileObject.description;
				draft.userProfile.profilePic = action.profileObject.profile_picture;
				draft.userProfile.administratorMonuments = action.profileObject.administrator_monuments;
				draft.userProfile.administratorId = action.profileObject.administrator;
				break;

			case "loadingDone":
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
					`http://localhost:8000/api/profiles/${params.id}/`
				);

				dispatch({
					type: "catchUserProfileInfo",
					profileObject: response.data,
				});
				dispatch({ type: "loadingDone" });
			} catch (e) { }
		}
		GetProfileInfo();
	}, []);

	if (state.dataIsLoading === true) {
		return (
			<Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
				<CircularProgress color="success" />
			</Grid>
		);
	}
	return (

		<div>
			{" "}
			<Grid
				container
				style={{
					width: "60%",
					marginLeft: "auto",
					marginRight: "auto",
					border: "5px solid black",
					marginTop: "1rem",
					padding: "5px",
				}}
			>
				<Grid item xs={5}>
					<img
						style={{ height: "15rem", width: "20rem" }}
						src={
							state.userProfile.profilePic !== null
								? state.userProfile.profilePic
								: defaultPicture
						}
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
							<span style={{ color: "#2E7D32", fontWeight: "bolder" }}>
								NADLEŚNICTWO {state.userProfile.forestInspectorate}
							</span>
						</Typography>
					</Grid>

					<Grid item>
						<Typography
							variant="h6"
							style={{ textAlign: "center", marginTop: "1rem" }}
						>
							<span style={{ color: "black" }}>
								RDLP {state.userProfile.rdlp}
							</span>
						</Typography>
					</Grid>
					<Grid item>
						<Typography
							variant="h6"
							style={{ textAlign: "center", marginTop: "1rem" }}
						>
							<span style={{ color: "black" }}>
								{state.userProfile.address}
							</span>
						</Typography>
					</Grid>

					<Grid item>
						<Typography
							variant="h5"
							style={{ color: "gray", textAlign: "center", marginTop: "1rem" }}
						>
							<EmailIcon /> {state.userProfile.administrator_email}
						</Typography>
					</Grid>
					<Grid item>
						<Typography
							variant="h5"
							style={{ color: "gray", textAlign: "center", marginTop: "1rem" }}
						>
							<LocalPhoneIcon /> {state.userProfile.phoneNumber}
						</Typography>
					</Grid>
				</Grid>
				<Grid item style={{ marginTop: "1rem", padding: '5px' }}>
					{state.userProfile.description}
				</Grid>
			</Grid>
			<Grid container justifyContent="flex-start" spacing={2} style={{ padding: '10px' }}>
				{state.userProfile.administratorMonuments.map((monument) => {
					function PictureDisplay() {
						if (monument.picture1 === null && monument.picture2 !== null) {
							return `http://localhost:8000${monument.picture2}`;
						}
						else if (monument.picture1 === null && monument.picture2 === null && monument.picture3 !== null) {
							return `http://localhost:8000${monument.picture3}`;
						}
						else if (monument.picture1 === null && monument.picture2 === null && monument.picture3 === null) {
							return defaultPicture;
						}
						else {
							return `http://localhost:8000${monument.picture1}`;
						}
					}
					return (
						<Grid item key={monument.id} style={{ marginTop: '1rem', maxWidth: '20rem' }}>
							<Card >
								<CardMedia
									component="img"
									height="140"
									image={PictureDisplay()}
									alt="Monument Picture"
									onClick={() => navigate(`/monuments/${monument.id}/`)}
									style={{ cursor: 'pointer' }}
								/>
								<CardContent>
									<Typography gutterBottom variant="h5" component="div">
										{monument.name}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{monument.description.substring(0, 100)}...
									</Typography>
								</CardContent>
								<CardActions>
								</CardActions>
							</Card>
						</Grid>

					);
				})}
			</Grid>
		</div>
	);
}
export default ForestInspectorateDetail;
