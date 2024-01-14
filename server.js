import express from 'express';
import  * as fs  from 'fs'
import * as path from 'path'
import * as ws from "ws";
import { setUpWebSocketServer } from './src/server/web-socket.js';

const app = express()
const port = 3000

/*
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/index.html')
})
*/

app.use(express.static(path.join(process.cwd(), 'public')))
app.use(express.static(path.join(process.cwd(),'src/client')))

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

setUpWebSocketServer(server)