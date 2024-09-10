const router = require('express').Router();
const thoughtRoutes = require('./thought-routes');
const userNameRoutes = require('./username-routes');

router.use('/username', userNameRoutes);
router.use('/thought', thoughtRoutes);

module.exports = router;