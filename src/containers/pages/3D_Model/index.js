import React, { Component } from "react";
import './3DModel.scss';
import ArmRobot from '../../../assets/3D_Model/ArmRobot.glb';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Model from '../../../components/atoms/Model';
import mqttService from '../../../config/mqtt'

class Model3D extends Component {
    constructor(props){
        super(props);
        this.state = {
            message: '0',
            bone: {
                Bone001: '0',
                Bone002: '0',
                Bone003: '0',
                Bone004: '0',
                Bone005: '0',
                Bone006: '0',
            },
            incoming: {
                text: '',
                time: ''
            },
            connected: false,
        };
    }

    componentDidMount(){
        mqttService.connect(
            this.handleMessage, 
            (status) => {
                this.setState({ connected: status });
            } 
        );
    }

    componentWillUnmount(){
        mqttService.disconnect();
    }

    handleMessage = (topic, payload) => {
        const now = new Date();
        const timeMessage = now.toLocaleTimeString();
        const [boneName, angleDeg] = payload.split(':');

        this.setState((prevState) => ({
            message: payload,
            bone: {
                ...prevState.bone,
                [boneName]: angleDeg
            },
        }));
    };

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        });
    };

    render() {
        const { message, incoming, connected } = this.state;

        return (
            <div className="model3d-page">
                <h1 className="model-title">Robot Arm 3D Viewer</h1>
                <p>Status: {connected ? 'Connected' : 'Disconnected'}</p>

                <div className="model-content">
                    <div className="model-canvas">
                        <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[5, 5, 5]} />
                            <Model rotationData={this.state.message} />
                            <OrbitControls />
                        </Canvas>
                    </div>

                    <div className="model-info">
                        <h2>Informasi Bagian</h2>
                        <p>Base 1 : {this.state.bone.Bone001}°</p>
                        <p>Base 2 : {this.state.bone.Bone002}°</p>
                        <p>Base 3 : {this.state.bone.Bone003}°</p>
                        <p>Base 4 : {this.state.bone.Bone004}°</p>
                        <p>Base 5 : {this.state.bone.Bone005}°</p>
                        <p>Base 6 : {this.state.bone.Bone006}°</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Model3D;