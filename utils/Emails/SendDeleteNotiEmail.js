const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendDeleteNotiEmail = async (name, email, event) => {
    const dateAndTime = event.dateAndTime.toLocaleString()
    let [date, time] = dateAndTime.split(',')
    time = time.trim()
    const body = `Hi ${name},<p>I am here to inform you that the "${event.title}" event that you joined a while ago has been cancelled by its creator.
    Below is more details about cancelled event:<br><br>Title: ${event.title}<br>Description: ${event.description}<br>type: ${event.type}<br>date to meet up: ${date}<br>time to meet up: ${time}<br>place to meet up: ${event.placeToMeetUp}
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