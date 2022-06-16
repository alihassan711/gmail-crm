const  express = require('express')
const gmail = require( '../functions/gmail-api')
const  {Email}  = require( '../models')

const router = express.Router()

/**
 * Route for getting gmail messages
 */
router.get('/getMessages', async (req, res) => {
	try{
        const params = req.query
        const messages = await gmail.getMessages(params)

        return res.send({messages})
    }catch(e){
        console.error(e)
        return res.send({error: e})
	}
})

/**
 * Route for getting a specific gmail message
 */
router.get('/getMessage', async (req, res) => {
	try{
        const messageId = req.query.messageId

        const message = await gmail.getMessage({messageId})

        return res.send({message})
    }catch(e){
        return res.send({error: e})
	}
})

/**
 * Route for getting a specific attachemnt from a message
 */
router.get('/getAttachment', async (req, res) => {
	try{
        const attachmentId = req.query.attachmentId
        const messageId = req.query.messageId

        const attachment = await gmail.getAttachment({attachmentId, messageId})

        return res.send({attachment})
    }catch(e){
        return res.send({error: e})
	}
})

/**
 * Route for getting gmail messages from a thread
 */
router.get('/getThread', async (req, res) => {
	try{
        const messageId = req.query.messageId

        const messages = await gmail.getThread({messageId})

        return res.send({messages})
    }catch(e){
        return res.send({error: e})
	}
})

/**
 * Route for send a mail message
 */
router.post('/sendMessage', async (req, res) => {
	try{
        const {to, subject, text, html, attachments} = req.body
        if(!to){
            throw 'Recipient email(s) is required'
        } 
        const mailId = await gmail.sendMessage({to, subject, text, html, attachments})
        const data = await Email.create({email_id: mailId, case_id: req.body.case_id});

        return res.send({message: 'Message sent!'})
    }catch(e){
        return res.send({error: e})
	}
})


router.post('/sendThreadMesssage', async (req, res) => {
	try{
        const {to, subject, text, html, attachments, threadId} = req.body
        console.log("req bodyz", req.body)
        // if(!to){
        //     throw 'Recipient email(s) is required'
        // }
        
        const mailId = await gmail.sendThreadMessage({to, subject, text, html, attachments, threadId})
        console.log("mailId", mailId)
        // const data = await Email.create({email_id: mailId, case_id: req.body.case_id});

        return res.send({message: 'Message sent!'})
    }catch(e){
        return res.send({error: e})
	}
})
// node ./dist/index.js

module.exports = router;
