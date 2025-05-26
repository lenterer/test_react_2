import { useState, useEffect, useRef } from 'react';

const VideoButton = ({localFeedEl,callStatus,localStream,updateCallStatus,peerConnection})=>{

    const [showVideoMenu, setShowVideoMenu] = useState(false);
    const [videoDevices, setVideoDevices] = useState([]);

    useEffect(() => {
    if (showVideoMenu) {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const filtered = devices.filter(d => d.kind === "videoinput");
            setVideoDevices(filtered);
        });
    }
    }, [showVideoMenu]);

    const toggleVideoMenu = () => {
        setShowVideoMenu(prev => !prev);
    };

    const handleVideoSettings = () => {
        // Open settings logic
        setShowVideoMenu(false);
    };

    const handleChooseCamera = () => {
        // Choose camera logic
        setShowVideoMenu(false);
    };

    //handle user clicking on video button
    const startStopVideo = ()=>{
        const copyCallStatus = {...callStatus}
        //use case:
        if(copyCallStatus.videoEnabled){
            //1. video enabled, disable
            copyCallStatus.videoEnabled = false
            updateCallStatus(copyCallStatus)
            const tracks = localStream.getVideoTracks()
            tracks.forEach(track=>track.enabled = false)
        }else if(copyCallStatus.videoEnabled === false){
            //2. video disable, enable
            copyCallStatus.videoEnabled = true
            updateCallStatus(copyCallStatus)
            const tracks = localStream.getVideoTracks()
            tracks.forEach(track=>track.enabled = true)
        }else if(copyCallStatus.videoEnabled === null){
            //3. video null. init
            console.log("init video")
            copyCallStatus.videoEnabled = true
            updateCallStatus(copyCallStatus)
            localStream.getTracks().forEach(track=>{
                peerConnection.addTrack(track,localStream)
            })
        }
    }

    return(
        <div className="button-wrapper video-button d-inline-block">
            {showVideoMenu && (
                <div className="video-menu-dropdown position-absolute bg-white border p-2">
                    <div className="mb-2 fw-bold">Connected Cameras</div>
                    {videoDevices.length > 0 ? (
                    videoDevices.map((device, idx) => (
                        <div key={device.deviceId || idx}>
                        {device.label || `Camera ${idx + 1}`}
                        </div>
                    ))
                    ) : (
                        <div>No video devices found</div>
                    )}
                    <div onClick={handleVideoSettings}>Video Settings</div>
                    <div onClick={handleChooseCamera}>Choose Camera</div>
                </div>
            )}
            <i className="fa fa-caret-up choose-video" onClick={toggleVideoMenu}></i>
            <div className="button camera" onClick={startStopVideo}>
                {callStatus.videoEnabled === null ? (
                    <i className="fa-solid fa-ban"></i>
                ): callStatus.videoEnabled ?(
                    <i className="fa fa-video"></i>
                ): (
                    <i className="fa fa-video-slash"></i>
                )}
                <div className="btn-text">{callStatus.video === "enabled" ? "Stop" : "Start"} Video</div>
            </div>
        </div>
    )
}
export default VideoButton;