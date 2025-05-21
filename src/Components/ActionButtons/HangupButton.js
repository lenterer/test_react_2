
const HangupButton = ({remoteFeedEl, localFeedEl,peerConnection, callStatus, setCallStatus})=>{

    const hangupCall = ()=>{
        if(peerConnection){
            const copyCallStatus = {...callStatus}
            copyCallStatus.current = 'complete'
                peerConnection.close();
                peerConnection.onicecandidate = null;
                peerConnection.onaddstram = null;
                peerConnection = null;
            
            localFeedEl.current.srcObject = null
            remoteFeedEl.current.srcObject = null
        }
    }

    if(callStatus.current === "complete"){
        return <></>
    }

    return(
        <button 
            onClick={hangupCall} 
            className="btn btn-danger hang-up"
        >Hang Up</button>
    )
}

export default HangupButton