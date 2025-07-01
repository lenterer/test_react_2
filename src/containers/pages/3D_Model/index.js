import { useEffect } from 'react'
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Model from '../../../components/atoms/Model';
import mqttService from '../../../config/mqtt';
import './3DModel.scss'

const Model3D = ({callStatus,updateCallStatus,setLocalStream,
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

    return (
        <div className="container">
            <h1 className="model-title">Robot Arm 3D Viewer</h1>
            <p>Status: {connected ? 'Connected' : 'Disconnected'}</p>
            <div className='row-content'>
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

export default Model3D
