export function GenerateValidateGameIdMiddleware(gameList){
    return function validateGameId(req, res, next){
        const gameId = req.params.gameId
        const game = gameList.find(game => game.gameId == gameId)
        if (!game) 
            return res.status(404).send(
                { 
                    success: false,
                    message: 'game not found'
                })
        req.game = game
        next()
    }
}
