const CustomError = require('../errors')
const Event = require('../models/event')

const checkPermissions = async (requestUser, resourceId) => {
    const resource = await Event.findById(resourceId).select("createdBy")
    if (requestUser.id === resource.createdBy.toString()) {
        return
    }
    throw new CustomError.UnauthorizedError('Unauthorized Error')
}

module.exports = checkPermissions