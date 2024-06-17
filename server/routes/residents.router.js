const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

router.get('/', rejectUnauthenticated, (req, res) => {
    console.log('/resident GET route');
    console.log('is authenticated?', req.isAuthenticated());
    console.log('user', req.user);
    let queryText = `SELECT "image", "first_name", "last_name", "birthday", "term", "status", "status_date", "admitted_date", "hall", "floor", "housing"."room_number" 
    FROM "residents"
    LEFT OUTER JOIN "housing"
    ON "housing"."resident_id" = "residents"."id";
    `;
    pool.query(queryText).then((result) => {
        res.send(result.rows);
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});

module.exports = router;