import React, { lazy, Suspense } from 'react';
// import logo from './logo.svg';
// import TopStats from './components/TopStats';
import NavBar from './components/NavBar';
// import Header from './components/Header';
// import HomeCharts from './components/HomeCharts';
// import TopClips from './components/TopClips';
// import HomePies from './components/HomePies';

// import HomePage from './components/HomePage';
// import ProfilePage from './components/ProfilePage';
// import GamePage from './components/GamePage';
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

const HomePage = lazy(() => import('./components/HomePage'));

const ProfilePage = lazy(() => import('./components/ProfilePage'));

const GamePage = lazy(() => import('./components/GamePage'));

function App() {
  return (

    <ApolloProvider client={client}>
      <Suspense fallback={<h1>Loading!</h1>}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <NavBar />
                <HomePage />
              </>
            }
          />
          <Route
            path="profile/:profileId"
            element={
              <>
                <NavBar />
                <ProfilePage />
              </>
            }
          />
          <Route
            path="game/:gameId"
            element={
              <>
                <NavBar />
                <GamePage />
              </>
            }
          />
        </Routes>
      </Suspense>
    </ApolloProvider>

  );
}

export default App;
