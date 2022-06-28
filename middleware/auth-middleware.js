const auth = require( '../functions/gmail-auth');

const authMiddleware = async (req, res, next) => {
    try{
        const authenticated = await auth.authorize()
        console.log("authenticated::", authenticated)
        if(!authenticated){
            throw 'No Authenticated'
        }
        next()
    }catch(e){
        res.status(401)
        res.send({error: e})
    }
}

module.exports = { authMiddleware };