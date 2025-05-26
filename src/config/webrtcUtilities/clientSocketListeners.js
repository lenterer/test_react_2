import { remoteDescSet, pendingIceCandidates } from './peerState';

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

    socket.on('receivedIceCandidateFromServer', iceC => {
        if (iceC) {
            const candidate = new RTCIceCandidate(iceC);
            if (remoteDescSet) {
                peerConnection.addIceCandidate(candidate).catch(console.error);
                console.log("Added ICE candidate");
            } else {
                pendingIceCandidates.push(candidate);
                console.log("Queued ICE candidate");
            }
        }
    })
}

export default clientSocketListeners