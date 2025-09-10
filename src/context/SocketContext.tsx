
import openSocket,{ Socket, io, } from "socket.io-client"

export const socketConnect=(token)=>{
  console.log('process.env.SOCKET_BASE_URL',process.env.SOCKET_BASE_URL)
  const socket=openSocket(`wss://sustainability-api.fandoro.com`, {
    auth:{
      token:`Bearer ${token}`
    },
    extraHeaders: {
      "authorization": `Bearer ${token}`
    }
  })
  console.log('socket.connected',socket.connected)
  return socket;
}