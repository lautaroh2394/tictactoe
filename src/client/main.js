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

window.game = new TicTacToeGameClient(socket, 'some-id')