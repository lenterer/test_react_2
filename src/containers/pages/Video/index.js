import React, { useState, useRef, useEffect } from 'react';
import './Video.scss'

const WebRTCComponent = () => {
  // State variables
  const [localStream, setLocalStream] = useState(null);
  const [startButtonDisabled, setStartButtonDisabled] = useState(false);
  const [callButtonDisabled, setCallButtonDisabled] = useState(true);
  const [hangupButtonDisabled, setHangupButtonDisabled] = useState(true);
  
  const signalingRef = useRef(null);
  const pendingCandidatesRef = useRef([]);

  // Refs for peer connections
  const pc1Ref = useRef(null);
  const pc2Ref = useRef(null);
  const startTimeRef = useRef(null);
  
  // Refs for video elements
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  // Offer options for WebRTC
  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
  };
  
  // Helper functions
  const getName = (pc) => {
    return (pc === pc1Ref.current) ? 'pc1' : 'pc2';
  };
  
  const getOtherPc = (pc) => {
    return (pc === pc1Ref.current) ? pc2Ref.current : pc1Ref.current;
  };
  
  useEffect(() => {
    signalingRef.current = new WebSocket('ws://localhost:8080');

    signalingRef.current.onmessage = async (message) => {
      let jsonData;

      // Handle jika message adalah Blob
      if (message.data instanceof Blob) {
        const text = await message.data.text();
        jsonData = JSON.parse(text);
      } else {
        jsonData = JSON.parse(message.data);
      }

      const data = jsonData;

      if (data.type === 'offer') {
        if (!pc2Ref.current) {
          pc2Ref.current = new RTCPeerConnection();
          pc2Ref.current.addEventListener('icecandidate', e => onIceCandidate(pc2Ref.current, e));
          pc2Ref.current.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc2Ref.current, e));
          pc2Ref.current.addEventListener('track', gotRemoteStream);
        }

        await pc2Ref.current.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await pc2Ref.current.createAnswer();
        await pc2Ref.current.setLocalDescription(answer);
        signalingRef.current.send(JSON.stringify(answer));

        // Apply pending candidates
        for (const candidate of pendingCandidatesRef.current) {
          await pc2Ref.current.addIceCandidate(candidate);
        }
        pendingCandidatesRef.current = [];

      } else if (data.type === 'answer') {
        if (!pc1Ref.current) {
          pc1Ref.current = new RTCPeerConnection();
          pc1Ref.current.addEventListener('icecandidate', e => onIceCandidate(pc1Ref.current, e));
          pc1Ref.current.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc1Ref.current, e));
        }

        await pc1Ref.current.setRemoteDescription(new RTCSessionDescription(data));

        // Apply pending candidates
        for (const candidate of pendingCandidatesRef.current) {
          await pc1Ref.current.addIceCandidate(candidate);
        }
        pendingCandidatesRef.current = [];

      } else if (data.type === 'candidate') {
        const candidate = new RTCIceCandidate(data.candidate);
        const pc = pc1Ref.current?.remoteDescription ? pc1Ref.current :
                  pc2Ref.current?.remoteDescription ? pc2Ref.current : null;

        if (pc && pc.remoteDescription) {
          await pc.addIceCandidate(candidate);
        } else {
          console.warn('Remote description belum tersedia, menyimpan ICE candidate...');
          pendingCandidatesRef.current.push(candidate);
        }
      }
    };
  }, []);

  // Event handlers for video elements
  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.addEventListener('loadedmetadata', function() {
        console.log(`Local video videoWidth: ${this.videoWidth}px, videoHeight: ${this.videoHeight}px`);
      });
    }
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.addEventListener('loadedmetadata', function() {
        console.log(`Remote video videoWidth: ${this.videoWidth}px, videoHeight: ${this.videoHeight}px`);
      });
      
      remoteVideoRef.current.addEventListener('resize', () => {
        console.log(`Remote video size changed to ${remoteVideoRef.current.videoWidth}x${remoteVideoRef.current.videoHeight} - Time since pageload ${performance.now().toFixed(0)}ms`);
        
        // Use the first onsize callback as an indication that video has started playing out
        if (startTimeRef.current) {
          const elapsedTime = window.performance.now() - startTimeRef.current;
          console.log('Setup time: ' + elapsedTime.toFixed(3) + 'ms');
          startTimeRef.current = null;
        }
      });
    }
  }, []);
  
  // WebRTC functions
  const start = async () => {
    console.log('Requesting local stream');
    setStartButtonDisabled(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
      console.log('Received local stream');
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setLocalStream(stream);
      setCallButtonDisabled(false);
    } catch (e) {
      alert(`getUserMedia() error: ${e.name}`);
      setStartButtonDisabled(false);
    }
  };
  
  const call = async () => {
    setCallButtonDisabled(true);
    setHangupButtonDisabled(false);
    console.log('Starting call');
    startTimeRef.current = window.performance.now();
    
    const videoTracks = localStream.getVideoTracks();
    const audioTracks = localStream.getAudioTracks();
    
    if (videoTracks.length > 0) {
      console.log(`Using video device: ${videoTracks[0].label}`);
    }
    
    if (audioTracks.length > 0) {
      console.log(`Using audio device: ${audioTracks[0].label}`);
    }
    
    const configuration = {};
    console.log('RTCPeerConnection configuration:', configuration);
    
    pc1Ref.current = new RTCPeerConnection(configuration);
    console.log('Created local peer connection object pc1');
    pc1Ref.current.addEventListener('icecandidate', e => onIceCandidate(pc1Ref.current, e));
    
    pc2Ref.current = new RTCPeerConnection(configuration);
    console.log('Created remote peer connection object pc2');
    pc2Ref.current.addEventListener('icecandidate', e => onIceCandidate(pc2Ref.current, e));
    
    pc1Ref.current.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc1Ref.current, e));
    pc2Ref.current.addEventListener('iceconnectionstatechange', e => onIceStateChange(pc2Ref.current, e));
    pc2Ref.current.addEventListener('track', gotRemoteStream);
    
    localStream.getTracks().forEach(track => pc1Ref.current.addTrack(track, localStream));
    console.log('Added local stream to pc1');
    
    try {
      console.log('pc1 createOffer start');
      const offer = await pc1Ref.current.createOffer(offerOptions);
      await pc1Ref.current.setLocalDescription(offer);
      signalingRef.current.send(JSON.stringify(offer));
    } catch (e) {
      onCreateSessionDescriptionError(e);
    }
  };
  
  const onCreateSessionDescriptionError = (error) => {
    console.log(`Failed to create session description: ${error.toString()}`);
  };
  
  const onCreateOfferSuccess = async (desc) => {
    console.log(`Offer from pc1\n${desc.sdp}`);
    console.log('pc1 setLocalDescription start');
    
    try {
      await pc1Ref.current.setLocalDescription(desc);
      onSetLocalSuccess(pc1Ref.current);
    } catch (e) {
      onSetSessionDescriptionError(e);
    }
    
    console.log('pc2 setRemoteDescription start');
    try {
      await pc2Ref.current.setRemoteDescription(desc);
      onSetRemoteSuccess(pc2Ref.current);
    } catch (e) {
      onSetSessionDescriptionError(e);
    }
    
    console.log('pc2 createAnswer start');
    try {
      const answer = await pc2Ref.current.createAnswer();
      await onCreateAnswerSuccess(answer);
    } catch (e) {
      onCreateSessionDescriptionError(e);
    }
  };
  
  const onSetLocalSuccess = (pc) => {
    console.log(`${getName(pc)} setLocalDescription complete`);
  };
  
  const onSetRemoteSuccess = (pc) => {
    console.log(`${getName(pc)} setRemoteDescription complete`);
  };
  
  const onSetSessionDescriptionError = (error) => {
    console.log(`Failed to set session description: ${error ? error.toString() : 'undefined'}`);
  };
  
  const gotRemoteStream = (e) => {
    if (remoteVideoRef.current && remoteVideoRef.current.srcObject !== e.streams[0]) {
      remoteVideoRef.current.srcObject = e.streams[0];
      console.log('pc2 received remote stream');
    }
  };
  
  const onCreateAnswerSuccess = async (desc) => {
    console.log(`Answer from pc2:\n${desc.sdp}`);
    console.log('pc2 setLocalDescription start');
    signalingRef.current.send(JSON.stringify(desc));
    
    try {
      await pc2Ref.current.setLocalDescription(desc);
      onSetLocalSuccess(pc2Ref.current);
    } catch (e) {
      onSetSessionDescriptionError(e);
    }
    
    console.log('pc1 setRemoteDescription start');
    try {
      await pc1Ref.current.setRemoteDescription(desc);
      onSetRemoteSuccess(pc1Ref.current);
    } catch (e) {
      onSetSessionDescriptionError(e);
    }
  };
  
  const onIceCandidate = async (pc, event) => {
    if (event.candidate) {
      signalingRef.current.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
    }
    console.log(`${getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
  };
  
  const onAddIceCandidateSuccess = (pc) => {
    console.log(`${getName(pc)} addIceCandidate success`);
  };
  
  const onAddIceCandidateError = (pc, error) => {
    console.log(`${getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
  };
  
  const onIceStateChange = (pc, event) => {
    if (pc) {
      console.log(`${getName(pc)} ICE state: ${pc.iceConnectionState}`);
      console.log('ICE state change event: ', event);
    }
  };
  
  const hangup = () => {
    console.log('Ending call');
    
    if (pc1Ref.current) {
      pc1Ref.current.close();
    }
    
    if (pc2Ref.current) {
      pc2Ref.current.close();
    }
    
    pc1Ref.current = null;
    pc2Ref.current = null;
    
    setHangupButtonDisabled(true);
    setCallButtonDisabled(false);
  };
  
  return (
    <div className="container">
      <h1>WebRTC Sample: Peer connection</h1>
      
      <div className="video">
        <div>
          <video ref={localVideoRef} playsInline autoPlay muted></video>
          <div>Local video</div>
        </div>
        <div>
          <video ref={remoteVideoRef} playsInline autoPlay></video>
          <div>Remote video</div>
        </div>
      </div>
      
      <div className="box">
        <button onClick={start} disabled={startButtonDisabled}>Start</button>
        <button onClick={call} disabled={callButtonDisabled}>Call</button>
        <button onClick={hangup} disabled={hangupButtonDisabled}>Hang Up</button>
      </div>
    </div>
  );
};

export default WebRTCComponent;