const  express = require( 'express')
const { Email }  = require( '../models')
const gmail = require( '../functions/gmail-api')

const router = express.Router()

router.get('/getEmails', async (req, res) => {
    try {

      const emailData = await Email.findAll({where: {...req.query}});
      if(emailData.length){
        const emails = emailData.map(async email => {
         return await gmail.getMessage({messageId: email.email_id});
        })
        await Promise.all(emails).then(email => {
          return res.json({
            status:  "success",
            message: "Emails found",
            data: email
          })
        })

      }else{
        throw new Error("No data found");
      }        
    } catch (error) {
        return res.json({
          status: "error",
          message: error.message,
        })
        
    }
})


module.exports = router;
