import React from "react";
import "translations/i18n";
import {
	BrowserRouter,
	Switch,
	Route,
	Redirect
} from "react-router-dom";
import { AuthContext } from "context/Auth";

import LoginPage from "pages/LoginPage";

const initialState = {
    accessToken: null,
    refreshToken: null,
    account: null,
    server: null
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
									<Route exact path="/login" component={ LoginPage }/>
									<ProtectedRoute exact path="/" render={ () => console.log("context: ", props) }/>
								</Switch>
							</BrowserRouter>
						)
					}
				}
			</AuthContext.Consumer>
		</AuthContext.Provider>
	);
}

const ProtectedRoute = ({ render, ...routeProps }) => {
	const authContext = React.useContext(AuthContext);
	return (
		<Route
			{ ...routeProps }
			render={
				() => {
					if(authContext.state.account) {
						render();
					}
					else {
						return <Redirect to="/login"/>;
					}
				}
			}
		/>
	);
};