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
import { MdSupervisorAccount, MdMovie, MdSettings } from "react-icons/md";

import LoginPage from "pages/Login";
import Sidebar from "components/Sidebar";
import InfoPage from "pages/Info";
import AccountsPage from "pages/Accounts";
import MoviesPage from "pages/Movies";
import ConfigPage from "pages/Config";

export default function App() {
	const [state, setState] = React.useState(null);

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
		},
		{
			path: "/config",
			name: t("app.config"),
			component: ConfigPage,
			icon: MdSettings,
			separator: true
		}
	];
	const sidebarWidth = 250;

	return (
		<AuthContext.Provider value={{ state: state, setState: setState }}>
			<AuthContext.Consumer>
				{
					props => {
						if(props.state?.account) {
							return (
								<BrowserRouter>
									<div
										style={{
											display: "flex",
											flex: 1,
											flexDirection: "row"
										}}
									>
										<Sidebar
											routes={ routes }
											width={ sidebarWidth }
										/>
										<div
											style={{
												marginLeft: sidebarWidth,
												display: "flex",
												flex: 1,
												minHeight: "100vh",
												backgroundColor: Definitions.PRIMARY_COLOR
											}}
										>
											<Switch>
												{
													routes.map((route) => {
														return <Route key={ route.path } exact path={ route.path } component={ route.component }/>;
													})
												}
											</Switch>
										</div>
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