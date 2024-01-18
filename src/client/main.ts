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

const inviteButton = document.getElementById("inviteButton");
if (inviteButton) {
    inviteButton.hidden = false
    inviteButton.addEventListener('click', ()=>{
        const game = window["game"]
        if (!game){
            alert('no se creó ningún juego')
            return
        }
        navigator.clipboard.writeText(window["game"].gameId);
        alert('copiado id de game al portapapeles')
    })
}

const createButton = document.getElementById("createButton")
if (createButton) {
    createButton.addEventListener('click', async ()=>{
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
    })
}

const joinButton = document.getElementById("joinButton")
const gameId = document.getElementById("gameId")
if (joinButton && gameId){
    joinButton.addEventListener('click', async ()=>{
        const game = new TicTacToeGameClient(
            socket, 
            clientId, 
            gameId
        )
        await game.join(gameId["value"])
        window["game"] = game
        await game.register()
    })
}