import { io } from 'socket.io-client';

let socket;
const socketConnection = userName =>{
    //check to see if the socket is already connected
    if(socket && socket.connected){
        //if so, then just return it so whoever needs it, can use it
        return socket;
    }else{
        //its not connected... connect!
        //socket = io.connect('http://localhost:8181',{
        //socket = io.connect('https://192.168.255.5:8181',{
        socket = io.connect('https://server-rtc-production.up.railway.app',{
            auth: {
                // jwt,
                password: "x",
                userName, 
            }
        });
        if(userName == 'test'){
            console.log("Testing...")
            const ping = socket.emitWithAck('test').then(resp=>{
                console.log(resp)
            })
        }
        
        return socket;
    }
}

export default socketConnection;
