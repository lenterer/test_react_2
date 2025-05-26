import { useEffect } from 'react'
import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client'
import prepForCall from '../../../config/webrtcUtilities/prepForCall'
import socketConnection from '../../../config/webrtcUtilities/socketConnection'
import clientSocketListeners from '../../../config/webrtcUtilities/clientSocketListeners'
import createPeerConnection from '../../../config/webrtcUtilities/createPeerConn'
import './index.css'

const Video = ({callStatus,updateCallStatus,setLocalStream,
    setRemoteStream,remoteStream,peerConnection,setPeerConnection,
    localStream,userName, setUserName,offerData,setOfferData})=>{

    const [ typeOfCall, setTypeOfCall ] = useState()
    const [joined, setJoined] = useState(false)
    const [availableCalls, setAvailableCalls] = useState([])
    const navigate = useNavigate();

    //called on "Call" or "Answer"
    const initCall = async(typeOfCall)=>{
        // set localstream and getUserMedia
        await prepForCall(callStatus,updateCallStatus,setLocalStream)
        console.log("GUM access granted!")
        setTypeOfCall(typeOfCall) //offer or answer
    }

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
            navigate(`/${typeOfCall}?token=${Math.random()}`)
        }
    },[remoteStream,peerConnection])

    useEffect(()=>{
        
    })

    const call = async()=>{
        //call related stuff goes here
        initCall('offer')
    }

    const answer = (callData)=>{
        //answer related stuff goes here
        initCall('answer')
        setOfferData(callData)
    }

    if(!joined){
        return(
            <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
                <input
                    type="text"
                    className="form-control mb-3 username-input"
                    placeholder="Enter your username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <button 
                    onClick={()=>setJoined(true)} 
                    className="btn btn-primary btn-lg"
                >Join</button>
            </div> 
        )
    }

    return (
        <div className="container">
            <div className="row">
                <h1>{userName}</h1>
                <div className="custom-col"> 
                    <h2>Make a call</h2>
                    <button 
                        onClick={call} 
                        className="btn btn-success btn-lg hang-up"
                    >
                        Start Call
                    </button>
                </div>
                <div className="custom-col"> 
                    <h2>Available Calls</h2>
                    {availableCalls.map((callData,i)=>
                        <div className="col mb-2" key={i}>
                            <button 
                                onClick={()=>{answer(callData)}}
                                className="btn btn-lg btn-warning hang-up"
                            >
                            Answer Call From {callData.offererUserName}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Video
