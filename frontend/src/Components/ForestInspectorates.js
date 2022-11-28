import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// Contexts
import StateContext from "../Contexts/StateContext";

// Assets
import defaultProfilePicture from "./Assets/Images/defaultPicture.jpg";

// MUI
import { Grid, Button, Typography, CircularProgress, Card, CardContent, CardMedia, CardActions } from "@mui/material";


function ForestInspectorates() {
	const navigate = useNavigate();
	const GlobalState = useContext(StateContext);

	const initialState = {
		dataIsLoading: true,
		forestInspectoratesList: [],
	};

	function ReducerFuction(draft, action) {
		switch (action.type) {
			case "catchForestInspectorates":
				draft.forestInspectoratesList = action.forestInspectoratesArray;
				break;
			case "loadingDone":
				draft.dataIsLoading = false;
				break;
		}
	}

	const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

	// request to get all profiles
	useEffect(() => {
		async function GetForestInspectorates() {
			try {
				const response = await Axios.get(
					`http://localhost:8000/api/profiles/`
				);
				console.log(response.data);
				dispatch({
					type: "catchForestInspectorates",
					forestInspectoratesArray: response.data,
				});
				dispatch({ type: "loadingDone" });
			} catch (e) {
				console.log(e.response);
			}
		}
		GetForestInspectorates();
	}, []);

	if (state.dataIsLoading === true) {
		return (
			<Grid
				container
				justifyContent="center"
				alignItems="center"
				style={{ height: "100vh" }}
			>
				<CircularProgress color="success" />
			</Grid>
		);
	}
	return (
		<Grid container justifyContent="flex-start" spacing={2} style={{ padding: '10px' }}>
			{state.forestInspectoratesList.map((forestInspectorate) => {

				function MonumentsDisplay() {
					if (forestInspectorate.administrator_monuments.length === 1) {

						return <Button color="success" size="small" onClick={() => navigate(`/forestinspectorates/${forestInspectorate.administrator}/`)}> 1 zabytek </Button>;

					} else if (forestInspectorate.administrator_monuments.length.toString().endsWith('2') ||
						forestInspectorate.administrator_monuments.length.toString().endsWith('3') ||
						forestInspectorate.administrator_monuments.length.toString().endsWith('4')) {
						return (
							<Button color="success" size="small" onClick={() => navigate(`/forestinspectorates/${forestInspectorate.administrator}/`)}>
								{forestInspectorate.administrator_monuments.length} zabytki
							</Button>
						);
					} else {
						return (
							<Button color="success" size="small" onClick={() => navigate(`/forestinspectorates/${forestInspectorate.administrator}/`)} >
								{forestInspectorate.administrator_monuments.length} zabytków
							</Button>
						);
					}
				}

				if (forestInspectorate.administrator_monuments.length > 0)
					return (
						<Grid item key={forestInspectorate.id} style={{ marginTop: '1rem', maxWidth: '18rem' }}>
							<Card >
								<CardMedia
									component="img"
									height="140"
									image={forestInspectorate.profile_picture ? forestInspectorate.profile_picture : defaultProfilePicture}
									alt="Profile Picture"
								/>
								<CardContent style={{ height: '10rem' }}>
									<Typography gutterBottom variant="h5" component="div">
										{forestInspectorate.administrator_forest_inspectorate}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{forestInspectorate.description.substring(0, 100)}...
									</Typography>
								</CardContent>
								<CardActions>
									{MonumentsDisplay()}
								</CardActions>
							</Card>
						</Grid>
					);
			})}
		</Grid>
	);
}
export default ForestInspectorates;
