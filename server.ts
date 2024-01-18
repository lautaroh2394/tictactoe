import express from 'express'
import * as path from 'path'
import { setUpWebSocketServer } from './src/server/web-socket.js';
import { GameList } from './src/server/game-list.model.js';
import { GenerateValidateGameIdMiddleware } from './src/server/game-validator.middleware.js';

const app = express()
const port = 3000

const gameList = new GameList()

app.use(express.static(path.join(process.cwd(), 'public')))
app.use('/dist', express.static(path.join(process.cwd(),'dist')))
app.use('/src', express.static(path.join(process.cwd(),'src')))
app.use(express.json())

const validateGameId = GenerateValidateGameIdMiddleware(gameList)

app.post('/create-game', (req: any, res: any)=>{
  const { clientId } = req.body
  const game = gameList.create(clientId)
  console.log(`created game ${game.gameId}`)
  res.send({gameId: game.gameId})
})

app.post('/join/:gameId', 
  validateGameId,
  (req:any, res:any) => {
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
  (req:any, res:any)=>{
    const {clientId, move} = req.body
    const { game } = req
    const success = game.play(clientId, move)
    if (!success) res.status(400)
    res.send({
      success
    })
})

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

setUpWebSocketServer(server, gameList)