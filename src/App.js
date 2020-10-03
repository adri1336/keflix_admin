import React from "react";
import "translations/i18n";
import {
	Router,
	Switch,
	Route,
	Redirect
} from "react-router-dom";
import { AuthContext } from "context/Auth";
import { history } from "context/History";
import Definitions from "utils/Definitions";
import { useTranslation } from "react-i18next";

import { AiOutlineBarChart } from "react-icons/ai";
import { MdSupervisorAccount, MdMovie, MdTv, MdSettings } from "react-icons/md";
import { FaTheaterMasks } from "react-icons/fa";

import LoginPage from "pages/Login";
import Sidebar from "components/Sidebar";
import InfoPage from "pages/Info";
import AccountsPage from "pages/Accounts";
import GenresPage from "pages/Genres";
import MoviesPage from "pages/Movies";
import TvsPage from "pages/Tvs";
import ConfigPage from "pages/Config";
import AccountPage from "pages/Account";
import GenrePage from "pages/Genre";
import AddMoviePage from "pages/AddMovie";
import MoviePage from "pages/Movie";
import AddTvPage from "pages/AddTv";
import TvPage from "pages/Tv";
import TvEpisodesPage from "pages/TvEpisodes";
import AddTvEpisodePage from "pages/AddTvEpisode";

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
			path: "/genres",
			name: t("app.genres"),
			component: GenresPage,
			icon: FaTheaterMasks
		},
		{
			path: "/movies",
			name: t("app.movies"),
			component: MoviesPage,
			icon: MdMovie
		},
		{
			path: "/tvs",
			name: t("app.tvs"),
			component: TvsPage,
			icon: MdTv
		},
		{
			path: "/config",
			name: t("app.config"),
			component: ConfigPage,
			icon: MdSettings,
			separator: true
		},
		{
			sidebar: false,
			path: "/account",
			component: AccountPage
		},
		{
			sidebar: false,
			path: "/genre",
			component: GenrePage
		},
		{
			sidebar: false,
			path: "/movie/add",
			component: AddMoviePage
		},
		{
			sidebar: false,
			path: "/movie",
			component: MoviePage
		},
		{
			sidebar: false,
			path: "/tv/add",
			component: AddTvPage
		},
		{
			sidebar: false,
			path: "/tv",
			component: TvPage
		},
		{
			sidebar: false,
			path: "/tv/episodes",
			component: TvEpisodesPage
		},
		{
			sidebar: false,
			path: "/tv/episodes/add",
			component: AddTvEpisodePage
		}
	];

	return (
		<AuthContext.Provider value={{ state: state, setState: setState }}>
			<AuthContext.Consumer>
				{
					props => {
						if(props.state?.account) {
							return (
								<Router history={ history }>
									<div
										style={{
											display: "flex",
											flex: 1,
											flexDirection: "row"
										}}
									>
										<Sidebar
											routes={ routes }
											width={ Definitions.SIDEBAR_WIDTH }
										/>
										<div
											style={{
												marginLeft: Definitions.SIDEBAR_WIDTH,
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
												<Route render={ () => <Redirect to="/"/> }/>
											</Switch>
										</div>
									</div>
								</Router>
							);
						}
						else {
							history.replace("/");
							return <LoginPage/>;
						}
					}
				}
			</AuthContext.Consumer>
		</AuthContext.Provider>
	);
}