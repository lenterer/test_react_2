import { useState, useEffect, useRef } from 'react';
import HangupButton from './HangupButton'
import socket from '../../../config/webrtcUtilities/socketConnection'
import VideoButton from './VideoButton';
import AudioButton from './AudioButton';

const ActionButtons = ({callStatus,localFeedEl, remoteFeedEl,updateCallStatus,localStream,peerConnection})=>{
    // const callStatus = useSelector(state=>state.callStatus);
    const menuButtons = useRef(null)

    return(
        <div id="menu-buttons" ref={menuButtons}>
            <div className="left">
                <AudioButton 
                    localFeedEl={localFeedEl}
                    callStatus={callStatus}
                    updateCallStatus={updateCallStatus}
                    localStream={localStream}
                    peerConnection={peerConnection}                    
                />
                <VideoButton 
                    localFeedEl={localFeedEl}
                    callStatus={callStatus}
                    localStream={localStream}
                    updateCallStatus={updateCallStatus}
                    peerConnection={peerConnection}
                />
            </div>
            <div className="right">
                <HangupButton
                    localFeedEl={localFeedEl}
                    remoteFeedEl={remoteFeedEl}
                    peerConnection={peerConnection}
                    callStatus={callStatus}
                    updateCallStatus={updateCallStatus}
                />
            </div>        
        </div>
    )
}

export default ActionButtons;