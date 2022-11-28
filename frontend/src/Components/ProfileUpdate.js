import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// Contexts
import StateContext from "../Contexts/StateContext";

// MUI
import { Grid, Button, TextField, Typography, Snackbar } from "@mui/material";

function ProfileUpdate(props) {
	const navigate = useNavigate();
	const GlobalState = useContext(StateContext);

	console.log(props.userProfile);

	const initialState = {

		forestInspectorateValue: props.userProfile.forestInspectorate,
		rdlpValue: props.userProfile.rdlp,
		addressValue: props.userProfile.address,
		phoneNumberValue: props.userProfile.phoneNumber,
		emailValue: props.userProfile.email,
		descriptionValue: props.userProfile.description,
		uploadedPicture: [],
		profilePictureValue: props.userProfile.profilePic,
		sendRequest: 0,
		openSnack: false,
		disabledBtn: false,
	};

	function ReducerFuction(draft, action) {
		switch (action.type) {

			case "catchAddressChange":
				draft.addressValue = action.addressChosen;
				break;

			case "catchPhoneNumberChange":
				draft.phoneNumberValue = action.phoneNumberChosen;
				break;

			case "catchDescriptionChange":
				draft.descriptionValue = action.descriptionChosen;
				break;

			case "catchUploadedPictureChosen":
				draft.uploadedPicture = action.uploadedPictureChosen;
				break;

			case "catchUploadedPicture":
				draft.uploadedPicture = action.pictureChosen;
				break;

			case "catchProfilePictureChange":
				draft.profilePictureValue = action.profilePictureChosen;
				break;

			case "changeSendRequest":
				draft.sendRequest = draft.sendRequest + 1;
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

	// Use effect to cath uplaoded picture
	useEffect(() => {
		if (state.uploadedPicture[0]) {
			dispatch({
				type: "catchProfilePictureChange",
				profilePictureChosen: state.uploadedPicture[0],
			});
		}
	}, [state.uploadedPicture[0]]);

	// use effect to send the request
	useEffect(() => {
		if (state.sendRequest) {
			async function UpdateProfile() {
				const formData = new FormData();

				if (
					typeof state.profilePictureValue === "string" ||
					state.profilePictureValue === null
				) {
					formData.append("address", state.addressValue);
					formData.append("phone_number", state.phoneNumberValue);
					formData.append("description", state.descriptionValue);
					formData.append("administrator", GlobalState.userId);
				} else {
					formData.append("address", state.addressValue);
					formData.append("phone_number", state.phoneNumberValue);
					formData.append("profile_picture", state.profilePictureValue);
					formData.append("description", state.descriptionValue);
					formData.append("administrator", GlobalState.userId);
				}
				try {
					const response = await Axios.patch(
						`http://localhost:8000/api/profiles/${GlobalState.userId}/update/`,
						formData
					);

					console.log(response.data);
					dispatch({ type: 'openTheSnack' });
				} catch (e) {
					console.log(e.response);
					dispatch({ type: 'allowTheButton' });
				}
			}
			UpdateProfile();
		}
	}, [state.sendRequest]);

	function FormSubmit(e) {
		e.preventDefault();
		dispatch({ type: "changeSendRequest" });
		dispatch({ type: 'disableTheButton' });
	}

	function ProfilePictureDisplay() {
		if (typeof state.profilePictureValue !== "string") {
			return (
				<ul>
					{state.profilePictureValue ? (
						<li>{state.profilePictureValue.name}</li>
					) : (
						""
					)}
				</ul>
			);
		} else if (typeof state.profilePictureValue === "string") {
			return (
				<Grid
					item
					style={{
						marginTop: "1rem",
						marginRight: "auto",
						marginLeft: "auto",
					}}
				>
					<img
						src={props.userProfile.profilePic}
						style={{ height: "5rem" }}
					/>
				</Grid>
			);
		}
	}

	useEffect(() => {
		if (state.openSnack) {
			setTimeout(() => {
				navigate(0);
			}, 1500);
		}
	}, [state.openSnack]);

	return (
		<>
			<div style={{ width: "50%", marginLeft: "auto", marginRight: "auto", marginTop: "3rem", border: "5px solid black", padding: "3rem" }}>
				<form onSubmit={FormSubmit}>
					<Grid item container justifyContent="center">
						<Typography variant="h4">PROFIL NADLEŚNICTWA</Typography>
					</Grid>

					<Grid item container style={{ marginTop: "1rem" }}>
						<TextField
							id="forestInspectorate"
							label="Nadleśnictwo"
							variant="outlined"
							fullWidth
							disabled
							value={state.forestInspectorateValue}

						/>
					</Grid>

					<Grid item container style={{ marginTop: "1rem" }}>
						<TextField
							id="rdlp"
							label="RDLP"
							variant="outlined"
							fullWidth
							disabled
							value={state.rdlpValue}

						/>
					</Grid>

					<Grid item container style={{ marginTop: "1rem" }}>
						<TextField
							id="address"
							label="Adres*"
							variant="outlined"
							fullWidth
							value={state.addressValue}
							onChange={(e) =>
								dispatch({
									type: "catchAddressChange",
									addressChosen: e.target.value,
								})
							}
						/>
					</Grid>

					<Grid item container style={{ marginTop: "1rem" }}>
						<TextField
							id="phoneNumber"
							label="Numer telefonu*"
							variant="outlined"
							fullWidth
							value={state.phoneNumberValue}
							onChange={(e) =>
								dispatch({
									type: "catchPhoneNumberChange",
									phoneNumberChosen: e.target.value,
								})
							}
						/>
					</Grid>

					<Grid item container style={{ marginTop: "1rem" }}>
						<TextField
							id="email"
							label="Email"
							variant="outlined"
							fullWidth
							disabled
							value={GlobalState.userEmail}
						/>
					</Grid>

					<Grid item container style={{ marginTop: "1rem" }}>
						<TextField
							id="description"
							label="Opis"
							variant="outlined"
							multiline
							rows={6}
							fullWidth
							value={state.descriptionValue}
							onChange={(e) =>
								dispatch({
									type: "catchDescriptionChange",
									descriptionChosen: e.target.value,
								})
							}
						/>
					</Grid>

					<Grid item container>
						{ProfilePictureDisplay()}
					</Grid>

					<Grid
						item
						container
						xs={6}
						style={{
							marginTop: "1rem",
							marginLeft: "auto",
							marginRight: "auto",
						}}
					>
						<Button
							variant="contained"
							component="label"
							fullWidth
							style={{ fontSize: "0.8rem", border: "1px solid black", marginLeft: "1rem" }}
						>
							ZDJĘCIE PROFILOWE
							<input
								type="file"
								accept="image/png, image/gif, image/jpeg"
								hidden
								onChange={(e) =>
									dispatch({
										type: "catchUploadedPicture",
										pictureChosen: e.target.files,
									})
								}
							/>
						</Button>
					</Grid>

					<Grid
						item
						container
						xs={8}
						style={{
							marginTop: "1rem",
							marginLeft: "auto",
							marginRight: "auto",
						}}
					>
						<Button
							variant="contained"
							color="success"
							fullWidth
							type="submit"
							style={{ fontSize: "1.1rem", marginLeft: "1rem" }}
							disabled={state.disabledBtn}
						>
							UAKTUALNIJ
						</Button>
					</Grid>
				</form>
				<Snackbar
					open={state.openSnack}
					message="Twój profil został uaktualniony!"
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center",
					}}
				/>
			</div>
		</>
	);
}
export default ProfileUpdate;
