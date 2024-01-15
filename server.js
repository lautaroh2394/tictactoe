import express from 'express';
import  * as fs  from 'fs'
import * as path from 'path'
import * as ws from "ws";
import { setUpWebSocketServer } from './src/server/web-socket.js';
import { GameList } from './src/server/game-list.model.js';
import { GenerateValidateGameIdMiddleware } from './src/server/game-validator.middleware.js';

const app = express()
const port = 3000

/*
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/index.html')
})
*/

const gameList = new GameList()
app.use(express.static(path.join(process.cwd(), 'public')))
app.use(express.static(path.join(process.cwd(),'src/client')))
app.use(express.json())

const validateGameId = GenerateValidateGameIdMiddleware(gameList)

app.post('/create-game', (req, res)=>{
  const { clientId } = req.body
  const game = gameList.create(clientId)
  console.log(`created game ${game.gameId}`)
  res.send({gameId: game.gameId})
})

app.post('/join/:gameId', 
  validateGameId,
  (req, res) => {
    const { clientId } = req.body
    const { game } = req
    const success = game.addPlayer(clientId)
    if (!success) res.status(400)
    const msg = success ? 'joined' : 'unable to join'
    console.log(`${msg} game ${game.gameId} by ${clientId}`)
    res.send({
      success
    })
})

app.post('/game/:gameId/action', 
  validateGameId,
  (req, res)=>{
    const {clientId, move} = req.body
    const { game } = req
    const success = game.play(clientId, move)
    

})

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const wsServer = setUpWebSocketServer(server, gameList)