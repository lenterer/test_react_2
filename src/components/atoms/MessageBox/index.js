const VideoMessage = ({message}) => {
    if(message){
        return <div className="call-info"> <h4>{message}</h4></div>
    } else{
        return <></>
    }
}

export default VideoMessage