import React from "react";
import "./i18n";
import {
	BrowserRouter,
	Switch,
	Route
} from "react-router-dom";

import LoginPage from "pages/LoginPage";

export default function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={ LoginPage }/>
			</Switch>
		</BrowserRouter>
	);
}
