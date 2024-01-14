const PENDING_START = 'PENDING_START'
const AWAITING_TURN = 'AWAITING_TURN'
const ACTIVE_TURN = 'ACTIVE_TURN'

export class TicTacToeGameClient {
    constructor(
        webSocket,
        clientId,
    ){
        this.clientId = clientId
        this.webSocket = webSocket;
        this.myTurn = false;
        this.status = PENDING_START
        this.grid = new Array(9).fill(false)
        this.webSocket.onmessage = async (event) => {
            console.log(event)
            //const receivedState = JSON.parse(await event.data.text())
            const receivedState = JSON.parse( event.data)
            this.updateState(receivedState)
        };
    }

    create(){
        this.gameId = 'some-game-id'
        this.webSocket.send(JSON.stringify({
            type: 'CREATE',
            gameId: 'some-game-id',
            clientId: this.clientId,
        }))
    }

    join(gameId){
        this.gameId = gameId
        this.webSocket.send(JSON.stringify({
            type: 'JOIN',
            clientId: this.clientId,
            gameId
        }))
    }

    updateState(state){
        this.status = state.status
        if (this.status == ACTIVE_TURN){
            // Update html ?
        }
    }

    markSpot(number){
        if (this.grid[number]) return alert('Casilla ya usada')
        this.grid[number] = true
        this.status = AWAITING_TURN
        const message = {
            type: 'ACTION',
            move: number,
            clientId: this.clientId,
            gameId: this.gameId
        }
        this.webSocket.send(JSON.stringify(message))
        console.log(this.grid)
    }
}