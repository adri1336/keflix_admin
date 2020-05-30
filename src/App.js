import React from "react";
import "translations/i18n";
import {
	BrowserRouter,
	Switch,
	Route
} from "react-router-dom";
import { AuthContext } from "context/Auth";

import LoginPage from "pages/LoginPage";

const initialState = {
    accessToken: null,
    refreshToken: null,
    account: null,
    server: "test"
};

export default function App() {
	const [state, setState] = React.useState(initialState);

	return (
		<AuthContext.Provider value={{ state: state, setState: setState }}>
			<AuthContext.Consumer>
				{
					props => {
						return (
							<BrowserRouter>
								<Switch>
									<Route exact path="/" component={ LoginPage }/>
								</Switch>
							</BrowserRouter>
						)
					}
				}
			</AuthContext.Consumer>
		</AuthContext.Provider>
	);
}
