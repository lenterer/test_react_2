import { useEffect } from 'react'
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client'
import prepForCall from '../../../config/webrtcUtilities/prepForCall'
import socketConnection from '../../../config/webrtcUtilities/socketConnection'
import clientSocketListeners from '../../../config/webrtcUtilities/clientSocketListeners'
import createPeerConnection from '../../../config/webrtcUtilities/createPeerConn'
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Model from '../../../components/atoms/Model';
import mqttService from '../../../config/mqtt';
import './Dashboard.scss'

const Dashboard = ({callStatus,updateCallStatus,setLocalStream,
    setRemoteStream,remoteStream,peerConnection,setPeerConnection,
    localStream,userName, setUserName,offerData,setOfferData})=>{

    const [ typeOfCall, setTypeOfCall ] = useState()
    const [joined, setJoined] = useState(false)
    const [availableCalls, setAvailableCalls] = useState([])
    const navigate = useNavigate();

    const [message, setMessage] = useState('0');
    const [bone, setBone] = useState({
        Bone001: '0',
        Bone002: '0',
        Bone003: '0',
        Bone004: '0',
        Bone005: '0',
        Bone006: '0',
    });
    const [connected, setConnected] = useState(false);

    //called on "Call" or "Answer"
    const initCall = async(typeOfCall)=>{
        // set localstream and getUserMedia
        await prepForCall(callStatus,updateCallStatus,setLocalStream)
        console.log("GUM access granted!")
        setTypeOfCall(typeOfCall) //offer or answer
    }

    // Handle MQTT connect/disconnect (seperti componentDidMount / WillUnmount)
    useEffect(() => {
        mqttService.connect(handleMessage, (status) => {
            setConnected(status);
        });

        return () => {
            mqttService.disconnect();
        };
    }, []);

    // Handler untuk menerima pesan dari MQTT
    const handleMessage = (topic, payload) => {
        const now = new Date();
        const timeMessage = now.toLocaleTimeString();
        const [boneName, angleDeg] = payload.split(':');
        const boneMap = {
            '1': 'Bone001',
            '2': 'Bone002',
            '3': 'Bone003',
            '4': 'Bone004',
            '5': 'Bone005'
        };

        if (boneMap[boneName]) {
            setMessage(`${boneMap[boneName]}:${angleDeg}`);
            setBone(prev => ({
                ...prev,
                [boneMap[boneName]]: angleDeg
            }));
        }
    };
    
    //Test backend connection
    // useEffect(()=>{
    //     const test = async()=>{
    //         const socket = socketConnection("test")
    //     }
    //     //if this works, you will get pong in the console!
    //     test()
    // },[])
    
    //Nothing happens until the user clicks join
    //(Helps with React double render)
    useEffect(()=>{
        if(joined){
            const setCalls = data=>{
                setAvailableCalls(data)
                console.log(data)
            }
            const socket = socketConnection(userName)
            socket.on("availableOffers",setCalls)
            socket.on("newOfferWaiting",setCalls)
        }

    },[joined])


    //We have media via GUM. setup the peerConnection w/listeners
    useEffect(()=>{
        if(callStatus.haveMedia && !peerConnection){
            // prepForCall finished and updated callStatus
            const { peerConnection, remoteStream } = createPeerConnection(userName,typeOfCall)
            setPeerConnection(peerConnection)
            setRemoteStream(remoteStream)
        }
    },[callStatus.haveMedia])

    //We know which type of client this is and have PC.
    //Add socketlisteners
    useEffect(()=>{
        if(typeOfCall && peerConnection){
            const socket = socketConnection(userName)
            clientSocketListeners(socket,typeOfCall,callStatus,updateCallStatus,peerConnection)
        }
    },[typeOfCall,peerConnection])

    //once remoteStream AND pc are ready, navigate
    useEffect(()=>{
        if(remoteStream && peerConnection){
            navigate(`/${typeOfCall}?token=${userName}`)
        }
    },[remoteStream,peerConnection])

    const call = async()=>{
        //call related stuff goes here
        initCall('offer')
    }

    const answer = (callData)=>{
        //answer related stuff goes here
        initCall('answer')
        setOfferData(callData)
    }

    return (
        <div className="container">
            <h1 className="model-title">Robot Arm 3D Viewer</h1>
            <p>Status: {connected ? 'Connected' : 'Disconnected'}</p>
            <div className='row-content'>
                {joined ? (
                    <div className="model-video">
                        <h1>{userName}</h1>
                        <div className="video-columns">
                            <div className="custom-col">
                            <h4>Make a call</h4>
                            <button onClick={call} className="btn btn-success btn-sm">
                                Start Call
                            </button>
                            </div>

                            <div className="custom-col">
                            <h4>Available Calls</h4>
                            {availableCalls.map((callData, i) => (
                                <div className="mb-2" key={i}>
                                <button
                                    onClick={() => answer(callData)}
                                    className="btn btn-warning btn-sm w-100"
                                >
                                    Answer {callData.offererUserName}
                                </button>
                                </div>
                            ))}
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="model-video">
                        <input
                            type="text"
                            className="form-control mb-3 username-input"
                            placeholder="Enter your username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <button onClick={() => setJoined(true)} className="btn btn-primary btn-lg">
                            Join
                        </button>
                    </div>
                )}

                {/* Kolom kanan */}
                <div className="model-right">
                    <div className="model-canvas">
                        <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[5, 5, 5]} />
                        <Model rotationData={message} />
                        <OrbitControls />
                        </Canvas>
                    </div>

                    <div className="model-info">
                        <h2>Informasi Bagian</h2>
                        <div className="model-info-grid">
                            <div className="info-row">
                                <p>Base 1 : {bone.Bone001}°</p>
                                <p>Base 2 : {bone.Bone002}°</p>
                                <p>Base 3 : {bone.Bone003}°</p>
                            </div>
                            <div className="info-row">
                                <p>Base 4 : {bone.Bone004}°</p>
                                <p>Base 5 : {bone.Bone005}°</p>
                                <p>Base 6 : {bone.Bone006}°</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
