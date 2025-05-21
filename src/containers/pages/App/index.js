import React from 'react';
import logo from '../../../assets/img/logo/logo.svg';
import './App.scss';
import{ BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Dashboard from '../Dashboard';
import Login from '../Login';
import Register from '../Register';
import Model3D from '../3D_Model'
import Video from '../Video'
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { store } from '../../../config/redux';

function App()  {
    return(
        <Provider store={store}>
            <Router>
                <div>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/dashboard">Home</Link>
                            </li>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                            <li>
                                <Link to="/register">Register</Link>
                            </li>
                            <li>
                                <Link to="/3dmodel">3D Model</Link>
                            </li>
                            <li>
                                <Link to="/video">Video</Link>
                            </li>
                        </ul>
                    </nav>
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/3dmodel" element={<Model3D />} />
                        <Route path="/video" element={<Video />} />
                    </Routes>
                </div>
            </Router>
        </Provider>
    );
}

export default App;