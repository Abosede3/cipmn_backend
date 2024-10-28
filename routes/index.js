const express = require('express');
const router = express.Router();


const authRoutes = require('./auth');
// const userRoutes = require('./users');
// const votingYearRoutes = require('./votingYears');
// const positionRoutes = require('./positions');
// const candidateRoutes = require('./candidates');
// const voteRoutes = require('./votes');



router.use('/api/auth', authRoutes);
// router.use('/api/users', userRoutes);
// router.use('/api/voting-years', votingYearRoutes);
// router.use('/api/positions', positionRoutes);
// router.use('/api/candidates', candidateRoutes);
// router.use('/api/votes', voteRoutes);



router.get('/', (req, res) => {
    res.render('index'); 
});

module.exports = router;
