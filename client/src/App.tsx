import React from "react";
import logo from "./logo.svg";
import TopStats from "./components/TopStats";
import Header from "./components/Headers";
import Stats from "./components/stats";
import Clips from "./components/clips";
import "./App.css";

function App() {
	return (
		<>
			<Header />;
			<Stats />
			<Clips />;
			<TopStats />;
		</>
	);
}

export default App;
