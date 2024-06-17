const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

// router.get('/', rejectUnauthenticated, (req, res) => {
//     console.log('/transaction GET route');
//     console.log('is authenticated?', req.isAuthenticated());
//     console.log('user', req.user);
//     let queryText = `SELECT * FROM "transactions_log"`;
//     pool.query(queryText).then((result) => {
//         res.send(result.rows);
//     }).catch((error) => {
//         console.log(error);
//         res.sendStatus(500);
//     });
// });

router.put('/:id', rejectUnauthenticated, async (req, res) => {
    console.log('/resident PUT route');
    console.log('req params id log', req.params.id);
    console.log('is authenticated?', req.isAuthenticated);
    console.log('user', req.user);

    try{
        const result = await pool.query(
            `
            UPDATE "housing"
SET "room_number" = $1, "assigned_date" = $2
FROM "residents"
WHERE "housing"."resident_id" = "residents"."id" AND "residents"."id" = $3;`,
            [req.body.room_number, req.body.assigned_date, req.params.id]
        );
        res.send(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

module.exports = router;