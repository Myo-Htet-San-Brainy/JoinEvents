const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendDeleteNotiEmail = async (name, email, event) => {
    const ISOString = event.dateAndTime.toISOString()
    const trimedString = ISOString.trim()
    const [datePart, timePart] = trimedString.split('T')
    const [timePartWithoutTheRest, theRest] = timePart.split('.')
    const body = `Hi ${name},<p>I am here to inform you that the "${event.title}" event that you joined a while ago has been cancelled by its creator.
    Below is more details about cancelled event:<br><br>Title: ${event.title}<br>Description: ${event.description}<br>type: ${event.type}<br>date to meet up: ${datePart}<br>time to meet up: ${timePartWithoutTheRest}<br>place to meet up: ${event.placeToMeetUp}
    </p>`
    const msg = {
        to: email, // Change to your recipient
        from: 'myohtetsandrinksmilk@gmail.com', // Change to your verified sender
        subject: 'Event Cancellation Notification',
        html: body,
        }
        await sgMail.send(msg)
    }

module.exports = sendDeleteNotiEmail