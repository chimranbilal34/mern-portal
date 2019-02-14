var express = require('express')
var router = express.Router()

router.get('/test', (req, res) => {
    res.json({msg : 'Post Successfull'})
})

module.exports = router;