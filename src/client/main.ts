import { TicTacToeGameClient } from './models/TicTacToeClient.model.js';

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

const clientId = crypto.randomUUID();
window["clientId"] = clientId;
const headers = new Headers()
headers.append("Content-Type", "application/json")

const createRes = await fetch('/create-game', { method: 'post', body: JSON.stringify({clientId}), headers})
const { gameId } = await createRes.json()

const game = new TicTacToeGameClient(
    socket, 
    clientId, 
    gameId
)
window["game"] = game
game.register()