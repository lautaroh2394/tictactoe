import { setupCounter } from './counter.js'
import { TicTacToeGameClient } from './models/TicTacToeClient.model.js';

setupCounter(document.querySelector('#counter'))
let socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
    console.log('web socket connected')
};

socket.onclose = () => {
    console.log('web socket closed')
};

socket.onerror = (error) => {
    console.error(`WebSocket error: ${error}`);
};

socket.onmessage = async (event) => {
    console.log(event)
};

document.querySelector('#counter').addEventListener('click', (ev)=>{
    socket.send(ev.target.textContent);
})
window.clientId = crypto.randomUUID()
const headers = new Headers()
headers.append("Content-Type", "application/json")

const createRes = await fetch('/create-game', { method: 'post', body: JSON.stringify({clientId}), headers})
const { gameId } = await createRes.json()


//r = await fetch('/join/df4814cc-9f6f-41f1-97db-a4ffc2f16657', { method: 'post', body: '{"clientId": "123456", "gameId": "243edabe-c026-4ca0-9df0-307589fbb840"}', headers: h})
window.game = new TicTacToeGameClient(
    socket, 
    clientId, 
    gameId
)
game.register()