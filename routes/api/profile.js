var express = require('express')
var router = express.Router()

router.get('/test', (req, res) => {
    res.json({msg : 'Profile Successfull'})
})

module.exports = router;