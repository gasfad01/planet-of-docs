import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import './index.css';

// Importing JSX components
import Navigation from './components/Navigation'
import Home from './components/Home'
import Store from './components/Store'
import Ownership from './components/Ownership'
import Transfer from './components/Transfer'
import Me from './components/Me'
import NotFound from './components/NotFound'
import Footer from './components/Footer'

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Router>
    <Navigation />
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/ownership" element={<Ownership />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/me" element={<Me />} />
        <Route path='*' exact={true} element={<NotFound />} >
      </Route>
    </Routes>
    <Footer />
    </Router>,

    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
