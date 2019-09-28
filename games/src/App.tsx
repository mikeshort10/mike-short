import React, { Component } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { Granger, LightBright, Clubs, Calculator, Conway } from "./components";

export default class App extends Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route
						path={`/games/lindsay-granger`}
						component={Granger}
					/>
					<Route
						path={`/games/light-bright`}
						component={LightBright}
					/>
					<Route path={`/clubs`} component={Clubs} />
					<Route path={`/trip-calculator`} component={Calculator} />
					<Route
						path={`/games/conways-game-of-life`}
						component={Conway}
					/>
				</Switch>
			</Router>
		);
	}
}
