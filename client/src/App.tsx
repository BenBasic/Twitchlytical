import React, { lazy, Suspense } from 'react';
import Loading from './components/Loading';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
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

const SearchPage = lazy(() => import('./components/SearchPage'));

const BrowsePage = lazy(() => import('./components/BrowsePage'));

console.log("MAIN APP HAS RELOADED")

function App() {
  return (

    <ApolloProvider client={client}>
      <NavBar />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage />
            }
          />
          <Route
            path="profile/:profileId"
            element={
              <ProfilePage />
            }
          />
          <Route
            path="game/:gameId"
            element={
              <GamePage />
            }
          />
          <Route
            path="/search/*"
            element={
              <SearchPage />
            }
          />
          <Route
            path="/browse/:type"
            element={
              <BrowsePage />
            }
          />
        </Routes>
      </Suspense>
      <Footer />
    </ApolloProvider>

  );
}

export default App;
