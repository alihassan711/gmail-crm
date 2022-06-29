const  express = require('express')
const gmail = require( '../functions/gmail-api')
const gmailAuth = require( '../functions/gmail-auth')
const cron = require("node-cron");
const  {Email}  = require( '../models')

const router = express.Router()

/**
 * Route for getting gmail messages startWatch
 */
router.get('/getMessages', async (req, res) => {
	try{
        const params = req.query;
        const messages = await gmail.getMessages(params)

        return res.send({messages})
    }catch(e){
        console.error(e)
        return res.send({error: e.message})
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
        const {to, subject, text, html, attachments, from} = req.body
        if(!to){
            throw 'Recipient email(s) is required'
        } 
        const mailId = await gmail.sendMessage({to, subject, text, html, attachments, })
        console.log(", mailId: mailId", mailId)
        if(mailId){
            const data = await Email.create({email_id: mailId, case_id: req.body.case_id, reciever_email: to, sender_email: from });
        }

        return res.send({message: 'Message sent!', mailId});
    }catch(e){
        return res.send({error: e.message});
	}
})


router.post('/sendThreadMesssage', async (req, res) => {
	try{
        const {to, subject, text, html, attachments, threadId} = req.body
        // if(!to){
        //     throw 'Recipient email(s) is required'
        // }
        
        const mailId = await gmail.sendThreadMessage({to, subject, text, html, attachments, threadId})

        return res.send({message: 'Message sent!'})
    }catch(e){
        return res.send({error: e})
	}
})

router.get('/startWatch', async (req, res) => {
    try {
        const watch = await gmail.startWatch();
        if(watch){
            return res.json({
                status: "success",
                data: watch
            })
        }else{
            throw new Error("No data found");
        }
    } catch (error) {
         return res.json({
            status: "error",
            message: error.message
        })
        
    }
})

router.post('/receiveNotification', async (req, res) => {
    try {

        // The message is a unicode string encoded in base64.
        const message = Buffer.from(req.body.message.data, 'base64').toString(
            'utf-8'
        );
        console.log("message", message)

        res.status(200).send();
    } catch (error) {
        return res.json({
            status: "error",
            messsga: error.message
        })
        
    }
})

router.get('/historyList', async (req, res) => {
    try {
        const params = req.query.historyId;
        const historyMsg = await gmail.historyList(params);
        if(historyMsg){
            return res.json({
                status: "success",
                data: historyMsg
            })
        }
    } catch (error) {
        return res.json({
            status: "error",
            message: error.message
        })
        
    }
})

cron.schedule('30 3 * * sun,tue', async () => {
    try {
        const watch = await gmail.startWatch();
        console.log("watch", watch)
        if(watch){
            return res.json({
                status: "success",
                data: watch
            })
        }else{
            throw new Error("No data found");
        }
    } catch (error) {
        return {
            status: "error",
            message: error.message
        }
        
    }
})

// node ./dist/index.js

module.exports = router;
