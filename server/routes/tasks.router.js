const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

router.get('/', rejectUnauthenticated, (req, res) => {
    console.log('/tasks GET route');

    let queryText = `SELECT * FROM "tasks"
    LEFT OUTER JOIN "assistance"
    ON "assistance"."id" = "tasks"."assistance_id";
    `;
    pool.query(queryText).then((result) => {
        res.send(result.rows);
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});






module.exports = router;