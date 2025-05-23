
const clientSocketListeners = (socket,typeOfCall,callStatus,
    updateCallStatus,peerConnection)=>{
    socket.on('answerResponse',entireOfferObj=>{
        console.log(entireOfferObj);
        updateCallStatus(prev => ({
            ...prev,
            answer: entireOfferObj.answer,
            myRole: typeOfCall
        }))
    })

    socket.on('receivedIceCandidateFromServer',iceC=>{
        if(iceC){
            peerConnection.addIceCandidate(iceC);
            console.log(iceC)
            console.log("Added an iceCandidate to existing page presence")
            // setShowCallInfo(false);
        }
    })
}

export default clientSocketListeners
