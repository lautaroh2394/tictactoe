enum GameStatus {
    PENDING_START = 'PENDING_START',
    AWAITING_TURN = 'AWAITING_TURN',
    ACTIVE_TURN = 'ACTIVE_TURN',
}

export class TicTacToeGameClient {
    private clientId
    private webSocket
    public myTurn
    private status
    private gameId
    private grid

    constructor(
        webSocket,
        clientId,
        gameId
    ){
        this.clientId = clientId
        this.webSocket = webSocket;
        this.myTurn = false;
        this.status = GameStatus.PENDING_START
        this.gameId = gameId
        this.grid = new Array(9).fill(false)
        this.webSocket.onmessage = async (event) => {
            console.log(event)
            const receivedState = JSON.parse( event.data)
            this.updateState(receivedState)
        };
    }

    register(){
        this.webSocket.send(JSON.stringify({
            clientId: this.clientId,
            gameId: this.gameId,
            type: 'REGISTER'
        }))
    }

    async join(gameId){
        this.gameId = gameId
        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        await fetch(`/join/${gameId}`, { 
            method: 'post', 
            body: JSON.stringify({clientId: this.clientId}), 
            headers
        })
        this.register()
    }

    updateState(state){
        if (state.type == 'TURN'){
            this.myTurn = true
        }
        this.status = state.status
        this.grid = state.grid
        if (this.status == GameStatus.ACTIVE_TURN){
            // Update html ?
        }
    }

    markSpot(number){
        if (this.grid[number]) return alert('Casilla ya usada')
        
    }
}