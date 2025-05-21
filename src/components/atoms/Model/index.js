import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useRef, useEffect } from 'react';
import ArmRobot from '../../../assets/3D_Model/ArmRobot.glb';
import * as THREE from 'three';

export default function Model({ scale = [0.7, 0.7, 0.7], rotationData }) {
    const gltf = useLoader(GLTFLoader, ArmRobot);
    const groupRef = useRef();
    const bonesRef = useRef({});

    useEffect(() => {
        if (!groupRef.current) return;

        bonesRef.current = {};
        groupRef.current.traverse((child) => {
            if (child.isBone) {
                bonesRef.current[child.name] = child;
            }
        });
    }, [gltf]);

    useFrame(() => {
        if (rotationData && bonesRef.current) {
            const [boneName, angleDeg] = rotationData.split(':');
            const bone = bonesRef.current[boneName];
            if (bone) {
                if(boneName === 'Bone001'){
                    bone.rotation.y = THREE.MathUtils.degToRad(parseFloat(angleDeg));
                }else if(boneName === 'Bone002'){
                    bone.rotation.x = THREE.MathUtils.degToRad(parseFloat(angleDeg));
                }else {
                    bone.rotation.z = THREE.MathUtils.degToRad(parseFloat(angleDeg));
                } 
            }
        }
    }, [rotationData]);

    return <primitive ref={groupRef} object={gltf.scene} scale={scale} />;
}