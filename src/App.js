import logo from './logo.svg';
import React from 'react';
import { Route, Routes, useParams } from "react-router-dom";
import AppContainer from './components/AppContainer/AppContainer';
import appRoutes from './appRoutes';
import "./App.scss";


const makeRoutes = () => {
  return appRoutes.map((r, i) => {
    const Component = r.component;
    let allProps = { ...r.props };

    return <Route key={i}
      path={r.path}
      element={<Component {...allProps} />} />
  });
}

function App() {
  return (
    <div className="App">
      <Routes>{makeRoutes()}</Routes>
    </div>
  );
}

export default App;