import { WebSocketServer,WebSocket } from 'ws'
import { TicTacToeServer } from './TicTacToeServer.model.js';

function setUpWebSocketServer(server){
    const wsServer = new WebSocketServer({ noServer: true })
    const games = []
    wsServer.on('connection', (ws) => {
      console.log('new connection')
      
      ws.on('message', (message) => {
        console.log(`ws: ${message}`)
        const playerAction = JSON.parse(message)

        if (playerAction.type == 'CREATE'){
          const game = new TicTacToeServer(playerAction.gameId, wsServer)
          games.push(game)
          game.addPlayer(playerAction.clientId)
          ws.send(JSON.stringify({
            type:'CREATE',
            response: true
          }))
        }

        if (playerAction.type == 'JOIN'){
          const game = games.find(e => e.id = playerAction.gameId)
          if (!game.canPlayerJoin()) return ws.send(JSON.stringify({
            type: 'JOIN',
            response: false
          }))
          game.addPlayer(playerAction.clientId)
          game.notifyPlayerJoined(playerAction.clientId)
          ws.send(JSON.stringify({
            type: 'JOIN',
            response: true
          }))
          return
        }

        if (playerAction.type == 'ACTION'){
          const game = games.find(e => e.id = playerAction.gameId)
          if (!game.canPlayerPlay(playerAction.clientId)) return ws.send(JSON.stringify({
            type: 'ACTION',
            response: false
          }))

          game.play(playerAction.clientId, playerAction.move)
          ws.send(JSON.stringify({
            type: 'ACTION',
            response: true,
            grid: game.grid.map(e => !!e)
          }))
          console.log(JSON.stringify(game.grid))
        }


        /*
        wsServer.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        })
        */
      });
    });
    
    server.on('upgrade', (req, socket, head) => {
      wsServer.handleUpgrade(req, socket, head, (ws) => {
        wsServer.emit('connection', ws, req)
      })
    })
}

export { setUpWebSocketServer }
