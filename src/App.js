import React from "react";
import "translations/i18n";
import {
	BrowserRouter,
	Switch,
	Route
} from "react-router-dom";
import { AuthContext } from "context/Auth";
import Definitions from "utils/Definitions";
import { useTranslation } from "react-i18next";

import { AiOutlineBarChart } from "react-icons/ai";
import { MdSupervisorAccount, MdMovie } from "react-icons/md";

import LoginPage from "pages/LoginPage";
import Sidebar from "components/Sidebar";
import InfoPage from "pages/InfoPage";
import AccountsPage from "pages/AccountsPage";
import MoviesPage from "pages/MoviesPage";

const initialState = {
    accessToken: null,
    refreshToken: null,
    account: null,
    server: null
};

export default function App() {
	const [state, setState] = React.useState(initialState);

	const { t } = useTranslation();
	const routes = [
		{
			path: "/",
			name: t("app.main"),
			component: InfoPage,
			icon: AiOutlineBarChart
		},
		{
			path: "/accounts",
			name: t("app.accounts"),
			component: AccountsPage,
			icon: MdSupervisorAccount
		},
		{
			path: "/movies",
			name: t("app.movies"),
			component: MoviesPage,
			icon: MdMovie
		}
	];

	return (
		<AuthContext.Provider value={{ state: state, setState: setState }}>
			<AuthContext.Consumer>
				{
					props => {
						if(props.state.account) {
							return (
								<BrowserRouter>
									<div
										style={{
											display: "flex",
											flex: 1,
											flexDirection: "row",
											backgroundColor: Definitions.PRIMARY_COLOR
										}}
									>
										<Sidebar
											routes={ routes }
										/>
										<Switch>
											{
												routes.map((route) => {
													return <Route key={ route.path } exact path={ route.path } component={ route.component }/>;
												})
											}
										</Switch>
									</div>
								</BrowserRouter>
							);
						}
						else {
							return <LoginPage/>;
						}
					}
				}
			</AuthContext.Consumer>
		</AuthContext.Provider>
	);
}