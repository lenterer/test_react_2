import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import mqttService from '../../../config/mqtt';
import socketConnection from '../../../config/webrtcUtilities/socketConnection';
import ActionButtons from '../../../components/atoms/ActionButtons/ActionButtons';
import VideoMessageBox from '../../../components/atoms/MessageBox';
import { markRemoteDescSet } from '../../../config/webrtcUtilities/peerState'
import Model from '../../../components/atoms/Model';
import '../Video_Answer/index.css';

const CallerVideo = ({remoteStream, localStream,peerConnection,callStatus,updateCallStatus,userName})=>{
    const remoteFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
    const localFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
    const navigate = useNavigate();
    const [ videoMessage, setVideoMessage ] = useState("Please enable video to start!")
    const [ offerCreated, setOfferCreated ] = useState(false)

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

        setMessage(payload);
        setBone(prev => ({
            ...prev,
            [boneName]: angleDeg
        }));
    };

    //send back to home if no localStream
    useEffect(()=>{
        if(!localStream){
            navigate(`/`)
        }else{
            //set video tags
            // remoteFeedEl.current.srcObject = remoteStream
            localFeedEl.current.srcObject = localStream
        }
    },[])
    
    //set video tags
    // useEffect(()=>{
    //     remoteFeedEl.current.srcObject = remoteStream
    //     localFeedEl.current.srcObject = localStream
    // },[])

    //if we have tracks, disable the video message
    useEffect(()=>{
        if(peerConnection){
            peerConnection.ontrack = e=>{
                if(e?.streams?.length){
                    setVideoMessage("")
                }else{
                    setVideoMessage("Disconnected...")
                }
            }
        }
    },[peerConnection])

    //once the user has shared video, start WebRTC'ing :)
    useEffect(()=>{
        const shareVideoAsync = async()=>{
            const offer = await peerConnection.createOffer()
            peerConnection.setLocalDescription(offer)
            //start collecting ice candidate
            const socket = socketConnection(userName)
            socket.emit('newOffer',offer)
            setOfferCreated(true)
            setVideoMessage("awaiting answer...")
            console.log("created offer, setLocalDesc, emitted offer, updated videoMess")
        }
        if(!offerCreated && callStatus.videoEnabled){
            //create offer
            console.log("making offer")
            shareVideoAsync()
        }
    },[callStatus.videoEnabled,offerCreated])
    

    useEffect(()=>{
        console.log(callStatus)
        const addAnswerAsync = async()=>{
            console.log(callStatus)
            await peerConnection.setRemoteDescription(callStatus.answer);
            markRemoteDescSet(peerConnection);
            console.log(peerConnection.signalingState)
            console.log("Answer added!")
        }
        if(callStatus.answer && peerConnection.signalingState !== 'stable'){
            addAnswerAsync()
        }
    },[callStatus])

    return (
        <div className="container">
            <h1 className="model-title">Robot Arm 3D Viewer</h1>
            <p>Status: {connected ? 'Connected' : 'Disconnected'}</p>
            <div className="row-content">
                <div className="model-video">
                    <div className="videos">
                        <VideoMessageBox message={videoMessage} />
                        <video id="local-feed" ref={localFeedEl} autoPlay playsInline></video>
                        {/* <video id="remote-feed" ref={remoteFeedEl} autoPlay playsInline></video> */}
                    </div>
                    <ActionButtons 
                        localFeedEl={localFeedEl}
                        remoteFeedEl={remoteFeedEl}
                        callStatus={callStatus}
                        localStream={localStream}
                        updateCallStatus={updateCallStatus}
                        peerConnection={peerConnection}
                    />
                </div>

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

export default CallerVideo
