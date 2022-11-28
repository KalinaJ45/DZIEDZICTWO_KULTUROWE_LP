import React, { useEffect, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// Data
import centroidsData from './Data/centroidsData.json'

// React Leaflet
import { MapContainer, TileLayer, Marker, useMap, WMSTileLayer } from "react-leaflet";

// Contexts
import StateContext from "../Contexts/StateContext";

// MUI
import { Grid, Typography, Button, TextField, FormControlLabel, Checkbox, Snackbar, Alert } from "@mui/material";


const categoryOptions = [
	{
		value: "",
		label: "",
	},
	{
		value: "Zabytek archeologiczny",
		label: "Zabytek archeologiczny",
	},
	{
		value: "Zabytek nieruchomy",
		label: "Zabytek nieruchomy",
	},
	{
		value: "Zabytek ruchomy",
		label: "Zabytek ruchomy",
	},
];

const zabytekArcheologicznyOptions = [
	{
		value: "",
		label: "",
	},
	{
		value: "grodzisko",
		label: "grodzisko",
	},
	{
		value: "osada",
		label: "osada",
	},
	{
		value: "obozowisko",
		label: "obozowisko",
	},
	{
		value: "jaskinia/schronisko",
		label: "jaskinia/schronisko",
	},
	{
		value: "relikty miasta/wsi",
		label: "relikty miasta/wsi",
	},
	{
		value: "ślad osadniczy",
		label: "ślad osadniczy",
	},
	{
		value: "inne/nieokreślone stanowisko osadnicze",
		label: "inne/nieokreślone stanowisko osadnicze",
	},
	{
		value: "cmentarzysko kurhanowe",
		label: "cmentarzysko kurhanowe",
	},
	{
		value: "cmentarzysko megalityczne",
		label: "cmentarzysko megalityczne",
	},
	{
		value: "cmentarzysko płaskie",
		label: "cmentarzysko płaskie",
	},
	{
		value: "inne/nieokreślone cmentarzysko",
		label: "inne/nieokreślone cmentarzysko",
	},
	{
		value: "kurhan",
		label: "kurhan",
	},
	{
		value: "grób megalityczny",
		label: "grób megalityczny",
	},
	{
		value: "grób płaski",
		label: "grób płaski",
	},
	{
		value: "inny grób",
		label: "inny grób",
	},
	{
		value: "miejsce kultu",
		label: "miejsce kultu",
	},
	{
		value: "umocnienia obronne",
		label: "umocnienia obronne",
	},
	{
		value: "miejsce eksploatacji surowca",
		label: "miejsce eksploatacji surowca",
	},
	{
		value: "miejsce produkcji",
		label: "miejsce produkcji",
	},
	{
		value: "ślady dawnej uprawy roli",
		label: "ślady dawnej uprawy roli",
	},
	{
		value: "pozostałości urządzeń komunikacyjnych  i transportowych",
		label: "pozostałości urządzeń komunikacyjnych  i transportowych",
	},
	{
		value: "stanowisko archeologiczne o innej/nieokreślonej funkcji",
		label: "stanowisko archeologiczne o innej/nieokreślonej funkcji",
	},
	{
		value: "inny zabytek archeologiczny",
		label: "inny zabytek archeologiczny",
	},
];

const zabytekNieruchomyOptions = [
	{
		value: "",
		label: "",
	},
	{
		value: "krajobraz kulturowy",
		label: "krajobraz kulturowy",
	},
	{
		value: "historyczny układ przestrzenny",
		label: "historyczny układ przestrzenny",
	},
	{
		value: "budynek rezydencjonalny",
		label: "budynek rezydencjonalny",
	},
	{
		value: "budynek gospodarczy",
		label: "budynek gospodarczy",
	},
	{
		value: "budynek przemysłowy",
		label: "budynek przemysłowy",
	},
	{
		value: "budynek użyteczności publicznej",
		label: "budynek użyteczności publicznej",
	},
	{
		value: "budynek sakralny",
		label: "budynek sakralny",
	},
	{
		value: "mała architektura",
		label: "mała architektura",
	},
	{
		value: "inne dzieło architektury i budownictwa",
		label: "inne dzieło architektury i budownictwa",
	},
	{
		value: "dzieło techniki i przemysłowe",
		label: "dzieło techniki i przemysłowe",
	},
	{
		value: "twierdza",
		label: "twierdza",
	},
	{
		value: "zamek",
		label: "zamek",
	},
	{
		value: "dwór obronny",
		label: "dwór obronny",
	},
	{
		value: "fort",
		label: "fort",
	},
	{
		value: "działobitnia",
		label: "działobitnia",
	},
	{
		value: "fortyfikacja polowa",
		label: "fortyfikacja polowa",
	},
	{
		value: "schron",
		label: "schron",
	},
	{
		value: "inny obiekt budownictwa obronnego",
		label: "inny obiekt budownictwa obronnego",
	},
	{
		value: "park",
		label: "park",
	},
	{
		value: "ogród",
		label: "ogród",
	},
	{
		value: "arboretum",
		label: "arboretum",
	},
	{
		value: "aleja",
		label: "aleja",
	},
	{
		value: "drzewostan",
		label: "drzewostan",
	},
	{
		value: "inna zieleń zabytkowa",
		label: "inna zieleń zabytkowa",
	},
	{
		value: "cmentarz świecki",
		label: "cmentarz świecki",
	},
	{
		value: "cmentarz wojenny i wojskowy",
		label: "cmentarz wojenny i wojskowy",
	},
	{
		value: "cmentarz specjalny",
		label: "cmentarz specjalny",
	},
	{
		value: "cmentarz wyznaniowy",
		label: "cmentarz wyznaniowy",
	},
	{
		value: "cmentarz prywatny",
		label: "cmentarz prywatny",
	},
	{
		value: "cmentarz epidemiczny",
		label: "cmentarz epidemiczny",
	},
	{
		value: "inny cmentarz",
		label: "inny cmentarz",
	},
	{
		value: "inny obiekt pamięci",
		label: "inny obiekt pamięci",
	},
	{
		value: "inny zabytek nieruchomy",
		label: "inny zabytek nieruchomy",
	},

];

const zabytekRuchomyOptions = [
	{
		value: "",
		label: "",
	},
	{
		value: "zabytek ruchomy",
		label: "zabytek ruchomy",
	},
];

function AddMonument() {
	const navigate = useNavigate();
	const GlobalState = useContext(StateContext);

	const initialState = {
		nameValue: "",
		inspireIdValue: "",
		forestInspectorateValue: "",
		rdlpValue: "",
		categoryValue: "",
		functionValue: "",
		chronologyValue: "",
		documentsValue: "",
		descriptionValue: "",
		leaseValue: false,
		availabilityValue: true,
		latitudeValue: "",
		longitudeValue: "",
		picture1Value: "",
		picture2Value: "",
		picture3Value: "",
		mapInstance: null,
		markerPosition: {
			lat: "52.11",
			lng: "19.21",
		},
		uploadedPictures: [],
		sendRequest: 0,
		userProfile: {
			forestInspectorate: "",
			rdlp: "",
			phoneNumber: "",
			address: "",
			description: "",
		},
		openSnack: false,
		disabledBtn: false,
		nameErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		inspireIdErrors: {
			hasErrors: false,
			errorMessage: "",
		},


		categoryErrors: {
			hasErrors: false,
			errorMessage: "",
		},
		functionErrors: {
			hasErrors: false,
			errorMessage: "",
		},

		chronologyErrors: {
			hasErrors: false,
			errorMessage: "",
		},

		documentsErrors: {
			hasErrors: false,
			errorMessage: "",
		},
	};

	function ReducerFuction(draft, action) {
		switch (action.type) {
			case "catchNameChange":
				draft.nameValue = action.nameChosen;
				draft.nameErrors.hasErrors = false;
				draft.nameErrors.errorMessage = "";
				break;

			case "catchInspireIdChange":
				draft.inspireIdValue = action.inspireIdChosen;
				draft.inspireIdErrors.hasErrors = false;
				draft.inspireIdErrors.errorMessage = "";
				break;

			case "catchForestInspectorateChange":
				draft.forestInspectorateValue = action.forestInspectorateChosen;

				break;

			case "catchRdlpChange":
				draft.rdlpValue = action.rdlpChosen;

				break;

			case "catchCategoryChange":
				draft.categoryValue = action.categoryChosen;
				draft.categoryErrors.hasErrors = false;
				draft.categoryErrors.errorMessage = "";
				break;

			case "catchFunctionChange":
				draft.functionValue = action.functionChosen;
				draft.functionErrors.hasErrors = false;
				draft.functionErrors.errorMessage = "";
				break;

			case "catchChronologyChange":
				draft.chronologyValue = action.chronologyChosen;
				draft.chronologyErrors.hasErrors = false;
				draft.chronologyErrors.errorMessage = "";
				break;

			case "catchDocumentsChange":
				draft.documentsValue = action.documentsChosen;
				draft.documentsErrors.hasErrors = false;
				draft.documentsErrors.errorMessage = "";
				break;

			case "catchDescriptionChange":
				draft.descriptionValue = action.descriptionChosen;
				break;

			case "catchLeaseChange":
				draft.leaseValue = action.leaseChosen;
				break;

			case "catchAvailabilityChange":
				draft.availabilityValue = action.availabilityChosen;
				break;

			case "catchLatitudeChange":
				draft.latitudeValue = action.latitudeChosen;
				break;

			case "catchLongitudeChange":
				draft.longitudeValue = action.longitudeChosen;
				break;

			case "catchPicture1Change":
				draft.picture1Value = action.picture1Chosen;
				break;

			case "catchPicture2Change":
				draft.picture2Value = action.picture2Chosen;
				break;

			case "catchPicture3Change":
				draft.picture3Value = action.picture3Chosen;
				break;

			case "getMap":
				draft.mapInstance = action.mapData;
				break;

			case "changeMarkerPosition":
				draft.markerPosition.lat = action.changeLatitude;
				draft.markerPosition.lng = action.changeLongitude;
				draft.latitudeValue = "";
				draft.longitudeValue = "";
				break;

			case "catchUploadedPictures":
				draft.uploadedPictures = action.picturesChosen;
				break;

			case "changeSendRequest":
				draft.sendRequest = draft.sendRequest + 1;
				break;

			case "catchUserProfileInfo":
				draft.userProfile.forestInspectorate = action.profileObject.administrator_forest_inspectorate;
				draft.userProfile.rdlp = action.profileObject.rdlp;
				draft.userProfile.phoneNumber = action.profileObject.phone_number;
				draft.userProfile.address = action.profileObject.address;
				draft.userProfile.description = action.profileObject.description;
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

			case "catchNameErrors":
				if (action.nameChosen.length === 0) {
					draft.nameErrors.hasErrors = true;
					draft.nameErrors.errorMessage = "Pole nie może być puste!";
				}
				break;

			case "catchInspireIdErrors":
				if (action.inspireIdChosen.length === 0) {
					draft.inspireIdErrors.hasErrors = true;
					draft.inspireIdErrors.errorMessage = "Pole nie może być puste!";
				}
				break;

			case "catchCategoryErrors":
				if (action.categoryChosen.length === 0) {
					draft.categoryErrors.hasErrors = true;
					draft.categoryErrors.errorMessage = "Pole nie może być puste!";
				}
				break;

			case "catchFunctionErrors":
				if (action.functionChosen.length === 0) {
					draft.functionErrors.hasErrors = true;
					draft.functionErrors.errorMessage = "Pole nie może być puste!";
				}
				break;

			case "catchChronologyErrors":
				if (action.chronologyChosen.length === 0) {
					draft.chronologyErrors.hasErrors = true;
					draft.chronologyErrors.errorMessage = "Pole nie może być puste!";
				}
				break;

			case "catchDocumentsErrors":
				if (action.documentsChosen.length === 0) {
					draft.documentsErrors.hasErrors = true;
					draft.documentsErrors.errorMessage = "Pole nie może być puste!";
				}
				break;

			case "emptyName":
				draft.nameErrors.hasErrors = true;
				draft.nameErrors.errorMessage = "Pole nie może być puste!";
				break;

			case "emptyInspireId":
				draft.inspireIdErrors.hasErrors = true;
				draft.inspireIdErrors.errorMessage = "Pole nie może być puste!";
				break;

			case "emptyForestInspectorate":
				draft.forestInspectorateErrors.hasErrors = true;
				draft.forestInspectorateErrors.errorMessage = "Pole nie może być puste!";
				break;

			case "emptyRdlp":
				draft.rdlpErrors.hasErrors = true;
				draft.rdlpErrors.errorMessage = "Pole nie może być puste!";
				break;

			case "emptyCategory":
				draft.categoryErrors.hasErrors = true;
				draft.categoryErrors.errorMessage = "Pole nie może być puste!";
				break;

			case "emptyFunction":
				draft.functionErrors.hasErrors = true;
				draft.functionErrors.errorMessage = "Pole nie może być puste!";
				break;

			case "emptyChronology":
				draft.chronologyErrors.hasErrors = true;
				draft.chronologyErrors.errorMessage = "Pole nie może być puste!";
				break;

			case "emptyDocuments":
				draft.documentsErrors.hasErrors = true;
				draft.documentsErrors.errorMessage = "Pole nie może być puste!";
				break;
		}
	}

	const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

	function TheMapComponent() {
		const map = useMap();
		dispatch({ type: "getMap", mapData: map });
		return null;
	}

	// Use effect to change the map view depending on the forest inspectorate
	// Changing the map view depending on the forest inspectorate

	useEffect(() => {
		centroidsData.features.map(centroid => {
			if (centroid.properties.ins_name === state.userProfile.forestInspectorate) {
				state.mapInstance.setView([centroid.geometry.coordinates[1],
				centroid.geometry.coordinates[0]], 12);

				dispatch({
					type: "changeMarkerPosition",
					changeLatitude: centroid.geometry.coordinates[1],
					changeLongitude: centroid.geometry.coordinates[0],
				});
			}
		}
		)
	}, [state.userProfile.forestInspectorate]);

	// Draggable marker

	const markerRef = useRef(null);
	const eventHandlers = useMemo(
		() => ({
			dragend() {
				const marker = markerRef.current;
				dispatch({
					type: "catchLatitudeChange",
					latitudeChosen: marker.getLatLng().lat,
				});
				dispatch({
					type: "catchLongitudeChange",
					longitudeChosen: marker.getLatLng().lng,
				});
			},
		}),
		[]
	);

	// Catching picture fields
	useEffect(() => {
		if (state.uploadedPictures[0]) {
			dispatch({
				type: "catchPicture1Change",
				picture1Chosen: state.uploadedPictures[0],
			});
		}
	}, [state.uploadedPictures[0]]);

	useEffect(() => {
		if (state.uploadedPictures[1]) {
			dispatch({
				type: "catchPicture2Change",
				picture2Chosen: state.uploadedPictures[1],
			});
		}
	}, [state.uploadedPictures[1]]);

	useEffect(() => {
		if (state.uploadedPictures[2]) {
			dispatch({
				type: "catchPicture3Change",
				picture3Chosen: state.uploadedPictures[2],
			});
		}
	}, [state.uploadedPictures[2]]);

	// request to get profile info

	useEffect(() => {
		async function GetProfileInfo() {
			try {
				const response = await Axios.get(
					`http://localhost:8000/api/profiles/${GlobalState.userId}/`
				);

				dispatch({
					type: "catchUserProfileInfo",
					profileObject: response.data,
				});
			} catch (e) { }
		}
		GetProfileInfo();
	}, []);

	function FormSubmit(e) {
		e.preventDefault();
		if (
			!state.nameErrors.hasErrors &&
			!state.inspireIdErrors.hasErrors &&
			!state.categoryErrors.hasErrors &&
			!state.functionErrors.hasErrors &&
			!state.chronologyErrors.hasErrors &&
			!state.documentsErrors.hasErrors &&
			state.latitudeValue &&
			state.longitudeValue
		) {
			dispatch({ type: "changeSendRequest" });
			dispatch({ type: "disableTheButton" });
		} else if (state.nameValue === "") {
			dispatch({ type: "emptyName" });
			window.scrollTo(0, 0);
		} else if (state.inspireIdValue === "") {
			dispatch({ type: "emptyInspireId" });
			window.scrollTo(0, 0);
		} else if (state.categoryValue === "") {
			dispatch({ type: "emptyCategory" });
			window.scrollTo(0, 0);
		} else if (state.functionValue === "") {
			dispatch({ type: "emptyFunction" });
			window.scrollTo(0, 0);
		} else if (state.chronologyValue === "") {
			dispatch({ type: "emptyChronology" });
			window.scrollTo(0, 0);
		} else if (state.documentsValue === "") {
			dispatch({ type: "emptyDocuments" });
			window.scrollTo(0, 0);
		}
	}

	useEffect(() => {
		if (state.sendRequest) {
			async function AddMonument() {
				const formData = new FormData();
				formData.append("name", state.nameValue);
				formData.append("inspire_id", state.inspireIdValue);
				formData.append("forest_inspectorate", state.userProfile.forestInspectorate);
				formData.append("rdlp", state.userProfile.rdlp);
				formData.append("category", state.categoryValue);
				formData.append("function", state.functionValue);
				formData.append("chronology", state.chronologyValue);
				formData.append("documents", state.documentsValue);
				formData.append("description", state.descriptionValue);
				formData.append("lease", state.leaseValue);
				formData.append("availability", state.availabilityValue);
				formData.append("latitude", state.latitudeValue);
				formData.append("longitude", state.longitudeValue);
				formData.append("picture1", state.picture1Value);
				formData.append("picture2", state.picture2Value);
				formData.append("picture3", state.picture3Value);
				formData.append("administrator", GlobalState.userId);
				try {
					const response = await Axios.post(
						"http://localhost:8000/api/monuments/create/", formData);
					console.log(response);
					dispatch({ type: 'openTheSnack' });
				} catch (e) {
					dispatch({ type: 'allowTheButton' });
					console.log(e.response);
				}
			}
			AddMonument();
		}
	}, [state.sendRequest]);

	function SubmitButtonDisplay() {
		if (
			state.userProfile.address !== null &&
			state.userProfile.address !== "" &&
			state.userProfile.phoneNumber !== null &&
			state.userProfile.phoneNumber !== "" &&
			state.userProfile.description !== null &&
			state.userProfile.description !== ""
		) {
			return (
				<Button
					variant="contained"
					fullWidth
					type="submit"
					color="success"
					style={{ fontSize: "1.1rem", marginLeft: "1rem" }}

					disabled={state.disabledBtn}
				>
					DODAJ
				</Button>
			);
		} else if
			(state.userProfile.address === null ||
			state.userProfile.address === "" ||
			state.userProfile.phoneNumber === null ||
			state.userProfile.phoneNumber === "" ||
			state.userProfile.description === null ||
			state.userProfile.description === ""
		) {
			return (
				<Button
					variant="contained"
					color="success"
					fullWidth
					style={{ fontSize: "1.1rem", marginLeft: "1rem" }}
					onClick={() => navigate("/profile")}
				>
					UZUPEŁNIJ SWÓJ PROFIL, ABY DODAĆ ZABYTEK
				</Button>
			);

		}
	}

	useEffect(() => {
		if (state.openSnack) {
			setTimeout(() => {
				navigate("/map");
			}, 1500);
		}
	}, [state.openSnack]);

	return (
		<div style={{ width: "75%", marginLeft: "auto", marginRight: "auto", marginTop: "3rem", border: "5px solid black", padding: "3rem" }}>
			<form onSubmit={FormSubmit}>
				<Grid item container justifyContent="center">
					<Typography variant="h4">DODAJ ZABYTEK</Typography>
				</Grid>
				<Grid item container style={{ marginTop: "1rem" }}>
					<TextField
						id="name"
						label="Nazwa obiektu*"
						variant="standard"
						fullWidth
						value={state.nameValue}
						onChange={(e) =>
							dispatch({
								type: "catchNameChange",
								nameChosen: e.target.value,
							})
						}
						onBlur={(e) =>
							dispatch({
								type: "catchNameErrors",
								nameChosen: e.target.value,
							})
						}
						error={state.nameErrors.hasErrors ? true : false}
						helperText={state.nameErrors.errorMessage}
					/>
				</Grid>
				<Grid item container style={{ marginTop: "1rem" }}>
					<TextField
						id="inspireId"
						label="Inspire Id*"
						variant="standard"
						fullWidth
						value={state.inspireIdValue}
						onChange={(e) =>
							dispatch({
								type: "catchInspireIdChange",
								inspireIdChosen: e.target.value,
							})
						}
						onBlur={(e) =>
							dispatch({
								type: "catchInspireIdErrors",
								inspireIdChosen: e.target.value,
							})
						}
						error={state.inspireIdErrors.hasErrors ? true : false}
						helperText={state.inspireIdErrors.errorMessage}
					/>
				</Grid>
				<Grid item container justifyContent="space-between">

					<Grid item xs={5} style={{ marginTop: "1rem" }}>
						<TextField
							id="forestInspectorate"
							label="Nadleśnictwo"
							variant="standard"
							fullWidth
							disabled
							value={state.userProfile.forestInspectorate}
						/>
					</Grid>
					<Grid item xs={5} style={{ marginTop: "1rem" }}>
						<TextField
							id="rdlp"
							label="RDLP"
							variant="standard"
							fullWidth
							disabled
							value={state.userProfile.rdlp}
						/>
					</Grid>
				</Grid>
				<Grid item container justifyContent="space-between">
					<Grid item xs={5} style={{ marginTop: "1rem" }}>
						<TextField
							id="category"
							label="Kategoria"
							variant="standard"
							fullWidth
							value={state.categoryValue}
							onBlur={(e) =>
								dispatch({
									type: "catchCategoryErrors",
									categoryChosen: e.target.value,
								})
							}
							onChange={(e) =>
								dispatch({
									type: "catchCategoryChange",
									categoryChosen: e.target.value,
								})
							}
							error={state.categoryErrors.hasErrors ? true : false}
							helperText={state.categoryErrors.errorMessage}
							select
							SelectProps={{
								native: true,
							}}
						>
							{categoryOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}

						</TextField>
					</Grid>
					<Grid item xs={5} style={{ marginTop: "1rem" }}>
						<TextField
							id="function"
							label="Funkcja"
							variant="standard"
							fullWidth
							value={state.functionValue}
							onBlur={(e) =>
								dispatch({
									type: "catchFunctionErrors",
									functionChosen: e.target.value,
								})
							}
							onChange={(e) =>
								dispatch({
									type: "catchFunctionChange",
									functionChosen: e.target.value,
								})
							}
							error={state.functionErrors.hasErrors ? true : false}
							helperText={state.functionErrors.errorMessage}
							select
							SelectProps={{
								native: true,
							}}
						>
							{state.categoryValue === "Zabytek archeologiczny"
								? zabytekArcheologicznyOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))
								: ""}

							{state.categoryValue === "Zabytek nieruchomy"
								? zabytekNieruchomyOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))
								: ""}

							{state.categoryValue === "Zabytek ruchomy"
								? zabytekRuchomyOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))
								: ""}
						</TextField>
					</Grid>
				</Grid>
				<Grid item container style={{ marginTop: "1rem" }}>
					<TextField
						id="chronology"
						label="Chronologia*"
						variant="standard"
						fullWidth
						value={state.chronologyValue}
						onChange={(e) =>
							dispatch({
								type: "catchChronologyChange",
								chronologyChosen: e.target.value,
							})
						}
						onBlur={(e) =>
							dispatch({
								type: "catchChronologyErrors",
								chronologyChosen: e.target.value,
							})
						}
						error={state.chronologyErrors.hasErrors ? true : false}
						helperText={state.chronologyErrors.errorMessage}
					/>
				</Grid>
				<Grid item container style={{ marginTop: "1rem" }}>
					<TextField
						id="documents"
						label="Dokumenty dotyczące ochrony*"
						variant="standard"
						fullWidth
						value={state.documentsValue}
						onChange={(e) =>
							dispatch({
								type: "catchDocumentsChange",
								documentsChosen: e.target.value,
							})
						}
						onBlur={(e) =>
							dispatch({
								type: "catchDocumentsErrors",
								documentsChosen: e.target.value,
							})
						}
						error={state.documentsErrors.hasErrors ? true : false}
						helperText={state.documentsErrors.errorMessage}
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
				<Grid item container justifyContent="space-between">
					<Grid item xs={4} style={{ marginTop: "1rem" }}>
						<FormControlLabel
							control={
								<Checkbox
									checked={state.leaseValue}
									onChange={(e) =>
										dispatch({
											type: "catchLeaseChange",
											leaseChosen: e.target.checked,
										})
									}
								/>
							}
							label="Obiekt dzierżawiony"
						/>
					</Grid>
					<Grid item xs={4} style={{ marginTop: "1rem" }}>
						<FormControlLabel
							control={
								<Checkbox
									checked={state.availabilityValue}
									onChange={(e) =>
										dispatch({
											type: "catchAvailabilityChange",
											availabilityChosen: e.target.checked,
										})
									}
								/>
							}
							label="Obiekt dostępny dla turystów"
						/>
					</Grid>

				</Grid>

				{/* Map */}
				<Grid item style={{ marginTop: "1rem" }}>
					{state.latitudeValue && state.longitudeValue ? (
						<Alert severity="success">
							Współrzędne zabytku: {state.latitudeValue},{" "}
							{state.longitudeValue}
						</Alert>
					) : (
						<Alert severity="warning">
							Wskaż lokalizację zabytku na mapie przed wysłaniem formularza!
						</Alert>
					)}
				</Grid>
				<Grid item container style={{ height: "35rem", marginTop: "1rem" }}>
					<MapContainer
						center={[52.11, 19.21]}
						zoom={6}
						scrollWheelZoom={true}
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<TheMapComponent />
						<WMSTileLayer url="http://mapserver.bdl.lasy.gov.pl/arcgis/services/WMS_BDL_kat_wlasnosci/MapServer/WmsServer?" format="image/png" transparent='true' tiles='true' layers="5">
						</WMSTileLayer>
						<Marker
							draggable
							eventHandlers={eventHandlers}
							position={state.markerPosition}
							ref={markerRef}
						></Marker>
					</MapContainer>
				</Grid>

				<Grid
					item
					container
					xs={6}
					style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
				>
					<Button
						variant="contained"
						component="label"
						fullWidth
						style={{ fontSize: "0.8rem", border: "1px solid black", marginLeft: "1rem" }}
					>
						ZAŁADUJ FOTOGRAFIE (MAX 3)
						<input
							type="file"
							multiple
							accept="image/png, image/gif, image/jpeg"
							hidden
							onChange={(e) =>
								dispatch({
									type: "catchUploadedPictures",
									picturesChosen: e.target.files,
								})
							}
						/>
					</Button>
				</Grid>
				<Grid item container>
					<ul>
						{state.picture1Value ? <li>{state.picture1Value.name}</li> : ""}
						{state.picture2Value ? <li>{state.picture2Value.name}</li> : ""}
						{state.picture3Value ? <li>{state.picture3Value.name}</li> : ""}
					</ul>
				</Grid>
				<Grid
					item
					container
					xs={8}
					style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
				>
					{SubmitButtonDisplay()}
				</Grid>
			</form>

			<Snackbar
				open={state.openSnack}
				message="Zabytek został dodany!"
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
			/>
		</div>
	);
}
export default AddMonument;
