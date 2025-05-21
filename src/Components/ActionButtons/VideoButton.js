
const VideoButton = ({localFeedEl,callStatus,localStream,updateCallStatus,peerConnection})=>{

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
            <i className="fa fa-caret-up choose-video"></i>
            <div className="button camera" onClick={startStopVideo}>
                <i className="fa fa-video"></i>
                <div className="btn-text">{callStatus.video === "enabled" ? "Stop" : "Start"} Video</div>
            </div>
        </div>
    )
}
export default VideoButton;