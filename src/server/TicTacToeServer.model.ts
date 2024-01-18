import { randomUUID } from "crypto";

export class TicTacToeServer{
    private grid: Array<any>;
    private players: Array<any> = []
    private activePlayer;
    public gameId: string;
    private wsServer;
    private state;

    constructor(wsServer){
        this.grid = new Array(9).fill(null)
        this.activePlayer;
        this.gameId = randomUUID()
        this.wsServer = wsServer
        this.state = 'PENDING_START'
    }

    canPlayerJoin(clientId: string){
        return (
            this.players.length < 2 && 
            !this.players.some(e => e.clientId == clientId)
        )
    }

    async addPlayer(clientId: string){
        if (
         !this.canPlayerJoin(clientId)   
            ) {
            console.log('attempted to overadd players')
            return false
        }
        this.players.push({clientId})
        if (this.players.length == 2){
            console.log('2 players in game')
            this.activePlayer = 0
            this.state = 'IN_PROGRESS'
        }
        if (this.state == 'IN_PROGRESS'){
            await this.notifyPlayersStatus()
            await this.notifyActivePlayer()
        }
        return true
    }

    canPlayerPlay(clientId: string){
        return this.players.some(player => player.clientId == clientId) && this.players[this.activePlayer].clientId == clientId
    }

    notifyPlayerJoined(clientId: string){
        this.wsServer.clients.forEach(client => client.send(JSON.stringify({
            type: 'MESSAGE',
            message: `player ${clientId} joined`
        })))
        console.log('nofifyPlayerJoined')
    }

    async notifyPlayersStatus(){
        const clients = [
            ...this.wsServer.clients
        ]
        await Promise.all(clients.map(client => 
                client.send(JSON.stringify({
                    type: 'STATUS',
                    state: this.state,
                    grid: this.grid
                })
            )))
        console.log('notifyPlayerStatus')
    }

    async notifyActivePlayer(){
        /*
        this.players[this.activePlayer].socket.send(JSON.stringify({
            status: 'ACTIVE_TURN',
            grid: this.grid
        }))
        */
        const clients = [
            ...this.wsServer.clients
        ]
        await Promise.all(clients.map(client => 
                client.send(JSON.stringify({
                    type: 'ACTIVE_TURN',
                    state: 'ACTIVE_TURN',
                    clientId: this.players[this.activePlayer].clientId,
                    grid: this.grid
                })
            )))
        console.log('notifyPlayerStatus')
    }

    async play(clientId, move){
        if (!this.canPlayerPlay(clientId)) return false
        if (!!this.grid[move]) return false

        this.grid[move] = {
            clientId
        }
        this.activePlayer = (this.activePlayer + 1) % 2
        if (this.hasPlayerwon(clientId)){
            this.state = 'FINISHED'
        }
        await this.notifyPlayersStatus()
        this.state != 'FINISHED' && this.notifyActivePlayer()
    }

    hasPlayerwon(clientId: string): boolean{
        const grid = this.grid.map(e => e && e.clientId == clientId)
        return (
            [grid[0], grid[1], grid[2]].every(e => e) ||
            [grid[3], grid[4], grid[5]].every(e => e) ||
            [grid[6], grid[7], grid[8]].every(e => e) ||
            [grid[0], grid[3], grid[6]].every(e => e) ||
            [grid[1], grid[4], grid[7]].every(e => e) ||
            [grid[2], grid[5], grid[8]].every(e => e) ||
            [grid[0], grid[4], grid[8]].every(e => e) ||
            [grid[2], grid[4], grid[6]].every(e => e)
        )
    }
}