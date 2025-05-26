import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import socketConnection from '../../../config/webrtcUtilities/socketConnection';
import ActionButtons from '../../../components/atoms/ActionButtons/ActionButtons';
import VideoMessageBox from '../../../components/atoms/MessageBox';
import './index.css';

const AnswerVideo = ({remoteStream, localStream,peerConnection,
    callStatus,updateCallStatus,offerData,userName})=>{
    const remoteFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
    const localFeedEl = useRef(null); //this is a React ref to a dom element, so we can interact with it the React way
    const navigate = useNavigate();
    const [ videoMessage, setVideoMessage ] = useState("Please enable video to start!")
    const [ answerCreated, setAnswerCreated ] = useState(false)
    
    //send back to home if no localStream
    useEffect(()=>{
        if(!localStream){
            navigate(`/`)
        }else{
            //set video tags
            remoteFeedEl.current.srcObject = remoteStream
            localFeedEl.current.srcObject = localStream
        }
    },[])

    //set video tags
    // useEffect(()=>{

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

    //User has enabled video, but not made answer
    useEffect(()=>{
        const addOfferAndCreateAnswerAsync = async()=>{
            //add offer
            await peerConnection.setRemoteDescription(offerData.offer)
            console.log(peerConnection.signalingState)
            //make answer
            console.log("creating answer...")
            const answer = await peerConnection.createAnswer()
            peerConnection.setLocalDescription(answer)
            const copyOfferData = {...offerData}
            copyOfferData.answer = answer
            copyOfferData.answerUserNama = userName
            const socket = socketConnection(userName)
            const offerIceCandidates = await socket.emitWithAck('newAnswer',copyOfferData)
            offerIceCandidates.forEach(c=>{
                peerConnection.addIceCandidate(c)
                console.log("==Added Ice Candidate From Offerer==")
            })
        }
        if(!answerCreated && callStatus.videoEnabled){
            addOfferAndCreateAnswerAsync()
        }
    },[callStatus.videoEnabled,answerCreated])
    

    //
    const shareVideo = async()=>{

    }

    return (
        <div>
            <div className="videos">
                <VideoMessageBox message={videoMessage} />
                <video id="local-feed" ref={localFeedEl} autoPlay playsInline></video>
                <video id="remote-feed" ref={remoteFeedEl} autoPlay playsInline></video> 
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
    )
}

export default AnswerVideo
