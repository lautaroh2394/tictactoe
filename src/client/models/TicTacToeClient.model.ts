enum GameStatus {
    PENDING_START = 'PENDING_START',
    AWAITING_TURN = 'AWAITING_TURN',
    ACTIVE_TURN = 'ACTIVE_TURN',
    FINISHED = 'FINISHED'
}

export class TicTacToeGameClient {
    private clientId
    private webSocket
    private status
    public gameId
    private grid

    constructor(
        webSocket,
        clientId,
        gameId
    ){
        this.clientId = clientId
        this.webSocket = webSocket;
        this.status = GameStatus.PENDING_START
        this.gameId = gameId
        this.grid = new Array(9).fill(null)
        this.webSocket.onmessage = async (event) => {
            console.log(event)
            const receivedState = JSON.parse( event.data)
            this.updateState(receivedState)
        };
        document.getElementById("board")?.addEventListener('click',ev=>{
            console.log('clicked board')
            if (ev?.target){
                const number = (ev.target as Element).getAttribute("number");
                this.markSpot(number)
            }
        })
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
        const res = await fetch(`/join/${gameId}`, { 
            method: 'post', 
            body: JSON.stringify({clientId: this.clientId}), 
            headers
        })
        res.status == 200 && this.register()
    }

    updateState(state){
        /*if (state.type == 'STATUS'){*/
        let status = 
            state.state == 'ACTIVE_TURN' ? 
                state.clientId == this.clientId ? 
                    'ACTIVE_TURN' : 'AWAITING_TURN'
                    : state.state
        console.log('status: ', status)
        this.status = status
        this.grid = state.grid
        this.render()
        //}
    }

    render(){
        console.log('rendered game')
        const messageToClient = document.getElementById('messageToPlayer')
        if (!messageToClient) return;
        messageToClient.removeAttribute('hidden')
        if (this.status == GameStatus.FINISHED){
            messageToClient.textContent = "juego terminado"
        }
        if (this.status == GameStatus.PENDING_START){
            messageToClient.textContent = "esperando inicio del juego"
        }
        if (this.status == GameStatus.ACTIVE_TURN){
            messageToClient.textContent = "tu turno"
        }
        if (this.status == GameStatus.AWAITING_TURN){
            messageToClient.textContent = "esperando turno"
        }
        let board;
        if (board = document.getElementById("board")){
            const cells = [...board.children[0].children].map(e=> [...e.children]).flat()
            this.grid.map((e, index) => {
                if (!!e){
                    cells[index].textContent = e.clientId == this.clientId ? 'X' : 'O'
                }
            })
        }
    }

    async markSpot(number){
        if (this.status == GameStatus.FINISHED) return alert('juego terminado')
        if (this.status == GameStatus.AWAITING_TURN) return alert('no es tu turno')
        if (this.status == GameStatus.PENDING_START) return alert('esperando que empieze el juego')
        if (this.status == GameStatus.ACTIVE_TURN){
            if (this.grid[number]) return alert('Casilla ya usada')

            const headers = new Headers()
            headers.append("Content-Type", "application/json")
            await fetch(`/game/${this.gameId}/action`, { 
                method: 'post', 
                body: JSON.stringify({
                    clientId: this.clientId,
                    move: number
                }), 
                headers
            })
        }
    }
}