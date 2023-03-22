const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendUpdateNotiEmail = async (name, email, event) => {
    const body = `Hi ${name},<p>I am here to inform you that the "${event.title}" event that you joined a while ago has been updated by its creator.Please check out the updated event info in "Events I Joined tab" in menu and contact event creator for details or help.</p>`
    const msg = {
        to: email, // Change to your recipient
        from: 'myohtetsandrinksmilk@gmail.com', // Change to your verified sender
        subject: 'Event Update Notification',
        html: body,
        }
        await sgMail.send(msg)
    }

module.exports = sendUpdateNotiEmail