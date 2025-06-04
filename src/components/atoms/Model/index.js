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

    useEffect(() => {
        if (rotationData && bonesRef.current) {
            const [boneName, angleDeg] = rotationData.split(':');
            const bone = bonesRef.current[boneName];
            const degToRad = (angleDeg * Math.PI) / 180
            const rad = (deg) => (deg * Math.PI) / 180;
            if (bone) {
                if(boneName === 'Bone001'){
                    bone.rotation.y = 0 + degToRad;
                }else if(boneName === 'Bone002'){
                    bone.rotation.x = 0 + degToRad;
                }else if(boneName === 'Bone003'){
                    bone.rotation.z = rad(50) + degToRad;
                }else if(boneName === 'Bone004'){
                    bone.rotation.z = rad(90) + degToRad;
                }else if(boneName === 'Bone005'){
                    bone.rotation.z = rad(90) + degToRad;
                }
            }
        }
    }, [rotationData])

    // useFrame(() => {
    //     if (rotationData && bonesRef.current) {
    //         const [boneName, angleDeg] = rotationData.split(':');
    //         const bone = bonesRef.current[boneName];
    //         const degToRad = (angleDeg * Math.PI) / 180
    //         if (bone) {
    //             if(boneName === 'Bone001'){
    //                 bone.rotation.y += degToRad;
    //             }else if(boneName === 'Bone002'){
    //                 bone.rotation.x = degToRad;
    //             }else {
    //                 bone.rotation.z = degToRad;
    //             } 
    //         }
    //     }
    // }, [rotationData]);

    // Rotasi bone setiap frame
    // useFrame(() => {
    //     const bone = bonesRef.current['Bone003'];
    //     const degToRad = (deg) => (deg * Math.PI) / 180;
    //     if (bone) {
    //         bone.rotation.z = degToRad(50); 
    //     }
    // });

    return <primitive ref={groupRef} object={gltf.scene} scale={scale} />;
}