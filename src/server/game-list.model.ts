import { TicTacToeServer } from "./TicTacToeServer.model.js"

export class GameList extends Array {

    private wsServer
    constructor(){
        super(0)
    }

    create(clientId): TicTacToeServer{
        const game = new TicTacToeServer(this.wsServer)
        this.push(game)
        game.addPlayer(clientId)
        return game
    }

    setWebServer(wsServer){
        this.wsServer = wsServer
        this.forEach(g => g.wsServer = wsServer)
    }
}