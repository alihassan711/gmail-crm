const  express = require('express')
const auth = require( '../functions/gmail-auth')

const router = express.Router()

/**
 * Route for authtenticate user, otherwise request a new token 
 * prompting for user authorization
 */
router.get('/gmailAuth', async (req, res) => {
	try{

        const authorizeUrl = await auth.getNewToken()
        return res.send(`<script>window.open("${authorizeUrl}", "_blank");</script>`)

    }catch(e){
        return res.send({error: e})
	}
})

/**
 * Callback route after authorizing the app
 * Receives the code for claiming new token
 */
router.get('/oauth2Callback', async (req, res) => {
    try{
        // get authorization code from request
        const code =  req.query.code
        const oAuth2Client = auth.getOAuth2Client();
        const result = await oAuth2Client.getToken(code)
        const tokens = result.tokens
        if(tokens){
            return res.json({access_token: tokens.access_token})
        }

		
    }catch(e){ 
        console.log("error", e)
        return res.send({error: e.message})
    }
})

module.exports = router;