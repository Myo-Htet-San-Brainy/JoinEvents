const express = require('express')
const router = express.Router()
const { getMyProfile, updateMyProfile, deleteMyProfile, uploadMyImage, getSingleUserProfile } = require('../controllers/userController')
const auth = require('../middleware/authentication')

router.route('/getMyProfile').get(auth, getMyProfile)
router.route('/updateMyProfile').patch(auth, updateMyProfile)
router.route('/deleteMyProfile').delete(auth, deleteMyProfile)
router.route('/uploadMyImage').post(auth, uploadMyImage)
router.route('/:id').get(getSingleUserProfile)

module.exports = router

