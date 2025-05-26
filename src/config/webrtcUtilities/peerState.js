export let remoteDescSet = false;
export let pendingIceCandidates = [];

export function markRemoteDescSet(peerConnection) {
    remoteDescSet = true;
    pendingIceCandidates.forEach(candidate => {
        peerConnection.addIceCandidate(candidate).catch(console.error);
    });
    pendingIceCandidates = [];
}