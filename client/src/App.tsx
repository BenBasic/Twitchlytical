import React from 'react';
import logo from './logo.svg';
import TopStats from './components/TopStats';
import TopData from './components/TotalData';
import AreaChart from './components/AreaChart';
import './App.css';

function App() {
  return (
    <>
    <AreaChart />
    <TopData />
    <TopStats />
    </>
  );
}

export default App;
