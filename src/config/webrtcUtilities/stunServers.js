const peerConfiguration = {
    iceServers: [
        // Objek pertama: berisi SEMUA server STUN
        {
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302',
                // 'stun:stun2.l.google.com:19302',
                // 'stun:stun3.l.google.com:19302',
                // 'stun:stun4.l.google.com:19302',
                // 'stun:stunserver.org'
            ]
         }, // <-- Koma pemisah setelah objek STUN ditutup

        // Objek kedua: Konfigurasi TURN pertama
        {
            urls: "turn:global.relay.metered.ca:80",
            username: "f00e8814970176f0f1c52730",
            credential: "jMadhYKIv1AKUVqU",
        },
        {
            urls: "turn:global.relay.metered.ca:80?transport=tcp",
            username: "f00e8814970176f0f1c52730",
            credential: "jMadhYKIv1AKUVqU",
        },
        {
            urls: "turn:global.relay.metered.ca:443",
            username: "f00e8814970176f0f1c52730",
            credential: "jMadhYKIv1AKUVqU",
        },
        {
            urls: "turns:global.relay.metered.ca:443?transport=tcp",
            username: "f00e8814970176f0f1c52730",
            credential: "jMadhYKIv1AKUVqU",
        },
    ]
};

export default peerConfiguration;