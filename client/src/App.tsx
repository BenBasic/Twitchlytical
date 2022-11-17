import React from 'react';
import logo from './logo.svg';
import TopStats from './components/TopStats';
import NavBar from './components/NavBar';
import Header from './components/Header';
import HomeCharts from './components/HomeCharts';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
	useQuery,
} from "@apollo/client";
import { Routes, Route } from "react-router-dom";
import { setContext } from "@apollo/client/link/context";
import './App.css';

// Constructing an http link, assigning uri to the URL of the GraphQL endpoint to send requests to
const httpLink = createHttpLink({
	uri: "http://localhost:3001/graphql",
});

const authLink = setContext((_, { headers }) => {
	// Getting the authentication token from local storage
	const token = localStorage.getItem("id_token");
	console.log("token is " + token);


	// Returning the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

// Creating a new ApolloClient (This is an Apollo Client constructor)
const client = new ApolloClient({
	// Chaining the HTTP link and the authorization link
	link: authLink.concat(httpLink),
	// Assigning cache to InMemoryCache object, this stores the results of its GraphQL queries in cache
	cache: new InMemoryCache(),
});

function App() {
  return (

    <ApolloProvider client={client}>
      <Routes>
        <Route
            path="/"
            element={
              <>
                <NavBar />
                <Header />
                <HomeCharts />
                <TopStats />
              </>
            }
          />
      </Routes>
    </ApolloProvider>

  );
}

export default App;
