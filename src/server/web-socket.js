import { WebSocketServer,WebSocket } from 'ws'
import { TicTacToeServer } from './TicTacToeServer.model.js';

function setUpWebSocketServer(server, gameList){
    const wsServer = new WebSocketServer({ noServer: true })
    console.log(JSON.stringify(gameList))
    gameList.setWebServer(wsServer)

    wsServer.on('connection', (ws) => {
      console.log('new connection')
      
      ws.on('message', (message) => {
        console.log(`ws: ${message}`)
        const playerAction = JSON.parse(message)

        if (playerAction.type == 'REGISTER'){
          const game = gameList.find(e => e.gameId == playerAction.gameId)
          const player = game.players.find(p => p.cliendId == playerAction.cliendId)
          player.socket = ws
        }
      });
    });
    
    server.on('upgrade', (req, socket, head) => {
      wsServer.handleUpgrade(req, socket, head, (ws) => {
        wsServer.emit('connection', ws, req)
      })
    })
}

export { setUpWebSocketServer }
