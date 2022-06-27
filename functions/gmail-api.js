const { google } = require('googleapis')
const parseMessage  = require('gmail-api-parse-message')
const MailComposer = require('nodemailer/lib/mail-composer')
const gmail = google.gmail('v1')

/**
 * Get messages from gmail api
 * @return {array} the array of messages
 */
 const getMessages = async (params) => {
    const response = await gmail.users.messages.list({userId: 'me', ...params})
    const messages = await Promise.all(response.data.messages.map(async message => {
        const messageResponse = await getMessage({messageId: message.id})
        return parseMessage(messageResponse)
    }))

    return messages
}

/**
 * Get specific message data for a given message id
 * @param  {string} messageId The message id to retrieve for
 * @return {object} the object message
 */
    const getMessage = async ({messageId}) => {
    const response = await gmail.users.messages.get({id: messageId, userId: 'me'})
    const message = parseMessage(response.data)
    return message
}

/**
 * Given the attachment id, get specific attachment data
 * @param  {string} attachmentId The attachment id to retrieve for
 * @param  {string} messageId The message id where the attachment is
 * @return {object} the object attachment data
 */
 const getAttachment = async ({attachmentId, messageId}) => {
    const response = await gmail.users.messages.attachments.get({
        id: attachmentId, messageId, userId: 'me'
    })
    const attachment = response.data
    return attachment
}

/**
 * Get all messages thread for a given message id
 * @param  {string} messageId The message id to retrieve its thread
 * @return {array} the array of messages
 */
 const getThread = async ({messageId}) => {
    const response = await gmail.users.threads.get({id: messageId, userId: 'me'})
    const messages = await Promise.all(response.data.messages.map(async (message) => {
        const messageResponse = await gmail.users.messages.get({id: message.id, userId: 'me'})
        return parseMessage(messageResponse.data)
    }))
    return messages
}

/**
 * Send a mail message with given arguments
 * @param  {string} to The receiver email
 * @param  {string} subject The subject of the mail
 * @param  {string} text The text content of the message
 * @param  {Array}  attachments An array of attachments
 */
 const sendMessage = async ({to, subject = '', html= '',text = '', attachments = []}) => {
    // build and encode the mail
    try {
        const buildMessage = () => new Promise((resolve, reject) => {
        const message  = new MailComposer({
            to,
            subject,
            text,
            attachments,
            html,
            textEncoding: 'base64',
            
        })

        message.compile().build((err, msg) => {
            if (err){
                reject(err)
            } 
        
            const encodedMessage = Buffer.from(msg)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '')

            resolve(encodedMessage)
        })
    })

    const encodedMessage = await buildMessage()

   const mailId =  await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage,
        }
    })
    return mailId?.data?.id
    } catch (error) {
        return error
    }
    
}

 const sendThreadMessage = async ({to, subject = '', html= '',text = '', attachments = [], threadId}) => {
    // build and encode the mail
    try {
        const buildMessage = () => new Promise((resolve, reject) => {
        const message  = new MailComposer({
            to,
            subject,
            text,
            attachments,
            html,
            textEncoding: 'base64',
            
        })

        message.compile().build((err, msg) => {
            if (err){
                reject(err)
            } 
        
            const encodedMessage = Buffer.from(msg)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '')

            resolve(encodedMessage)
        })
    })

    const encodedMessage = await buildMessage()

   const mailId =  await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage,
            threadId : threadId
        }
    })
    return mailId?.data?.id
    } catch (error) {
        return error
    }
    
}


const startWatch = async () => {
     try {
    //   const authGmail = await authenticate();
    //   const resp = await authGmail.users.stop({
    //     userId: 'me',
    //   });
    // console.log("authGmail", authGmail)
      resp = await gmail.users.watch({
        userId: 'me',
        topicName:"projects/custom-zone-352815/topics/gmail-crm",
        labelIds: ["UNREAD"],
        labelFilterAction:  "include"
      });
    //   console.log("resp", resp)
      return ("Successfully Started Watching - " ,resp.data);
    }
    catch(ex) {
      return("Error occured: " + ex);
    //   throw new Error("Error occured while starting gmail watch: " + ex);
    }
}

module.exports = { getMessages, getAttachment, getThread, sendMessage, getMessage, sendThreadMessage, startWatch};
