import React from 'react';
import logo from '../../../assets/img/logo/logo.svg';
import{ BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { store } from '../../../config/redux';
import Dashboard from '../Dashboard';
import Login from '../Login';
import Register from '../Register';
import Model3D from '../3D_Model';
import Video from '../Video';
import CallerVideo from '../Video_Caller';
import AnswerVideo from '../Video_Answer';
import './App.scss';

function App()  {

    //holds: callStatus, haveMedia, videoEnabled, audioEnabled, 
    // haveOffer
    const [ callStatus, updateCallStatus ] = useState({})
    const [ localStream, setLocalStream ] = useState(null)
    const [ remoteStream, setRemoteStream ] = useState(null)
    const [ peerConnection, setPeerConnection ] = useState(null)
    const [ userName, setUserName ] = useState("")
    const [ offerData, setOfferData ] = useState(null)

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
                        <Route exact path="/video" element={
                            <Video 
                                callStatus={callStatus} 
                                updateCallStatus={updateCallStatus}
                                localStream={localStream}
                                setLocalStream={setLocalStream}
                                remoteStream={remoteStream}
                                setRemoteStream={setRemoteStream}
                                peerConnection={peerConnection}
                                setPeerConnection={setPeerConnection}
                                userName={userName}
                                setUserName={setUserName}
                                offerData={offerData}
                                setOfferData={setOfferData}
                            />
                            }/>
                        <Route exact path="/offer" element={
                            <CallerVideo 
                                callStatus={callStatus} 
                                updateCallStatus={updateCallStatus} 
                                localStream={localStream}
                                setLocalStream={setLocalStream}
                                remoteStream={remoteStream}
                                setRemoteStream={setRemoteStream}  
                                peerConnection={peerConnection}
                                userName={userName}
                                setUserName={setUserName}            
                            />} 
                        />
                        <Route exact path="/answer" element={
                            <AnswerVideo 
                                callStatus={callStatus} 
                                updateCallStatus={updateCallStatus} 
                                localStream={localStream}
                                setLocalStream={setLocalStream}
                                remoteStream={remoteStream}
                                setRemoteStream={setRemoteStream}               
                                peerConnection={peerConnection}
                                userName={userName}
                                setUserName={setUserName}
                                offerData={offerData}
                            />} 
                        />
                    </Routes>
                </div>
            </Router>
        </Provider>
    );
}

export default App;