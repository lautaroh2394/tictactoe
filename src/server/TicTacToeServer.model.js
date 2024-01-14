export class TicTacToeServer{
    constructor(gameId, wsServer){
        this.grid = new Array(9).fill(null)
        this.players = []
        this.activePlayer;
        this.gameId = gameId
        this.wsServer = wsServer
    }

    canPlayerJoin(){
        return this.players.length <= 2
    }

    addPlayer(clientId){
        if (this.players.length >= 2) {
            console.log('attempted to overadd players')
            return
        }
        this.players.push({clientId})
        if (this.players.length == 2){
            console.log('2 players already')
            this.activePlayer = 0
        }
    }

    canPlayerPlay(clientId){
        return this.players.some(player => player.clientId == clientId) && this.players[this.activePlayer].clientId == clientId
    }

    notifyPlayerJoined(clientId){
        this.wsServer.clients.forEach(client => client.send(JSON.stringify({
            type: 'MESSAGE',
            message: `player ${clientId} joined`
        })))
    }

    play(clientId, move){
        if (!!this.grid[move]) return false
        this.grid[move] = {
            clientId
        }
        this.activePlayer = (this.activePlayer + 1) % 2
    }


}