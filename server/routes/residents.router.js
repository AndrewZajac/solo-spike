const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

router.get('/', rejectUnauthenticated, (req, res) => {
    console.log('/resident GET route');
    console.log('is authenticated?', req.isAuthenticated());
    console.log('user', req.user);
    let queryText = `SELECT "image", "first_name", "last_name", "birthday", "term", "status", "discharge_date", "admitted_date", "hall", "floor", "housing"."room_number" 
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

router.post('/', rejectUnauthenticated, (req, res) => {
    console.log(req.body);
    console.log('/residents POST route');
    console.log('is authenticated', req.isAuthenticated());
    // RETURNING "id" will give us back the id of the created movie
    const insertUserQuery = `
      INSERT INTO "users" DEFAULT VALUES
    RETURNING "id";
    `;
    const insertUserValues = [
      req.body.users_id
    ]
    // FIRST QUERY MAKES MOVIE
    pool.query(insertUserQuery, insertUserValues)
      .then(result => {
        // ID IS HERE!
        console.log('New User Id:', result.rows[0].id);
        const createdResidentId = result.rows[0].id
  
        // Now handle the genre reference:
        const insertResidentQuery = `
          INSERT INTO "residents" 
            ("users_id", "image", "first_name", "last_name", "birthday", "term", "status", "admitted_date")
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8);
        `;
        const insertResidentValues = [
          createdResidentId,
          req.body.image,
          req.body.first_name,
          req.body.last_name,
          req.body.birthday,
          req.body.term,
          req.body.status,
          req.body.admitted_date
        ]
        // SECOND QUERY ADDS GENRE FOR THAT NEW MOVIE
        pool.query(insertResidentQuery, insertResidentValues)
          .then(result => {
            //Now that both are done, send back success!
            res.sendStatus(201);
          }).catch(err => {
            // catch for second query
            console.log(err);
            res.sendStatus(500)
        })
      }).catch(err => { // 👈 Catch for first query
        console.log(err);
        res.sendStatus(500)
      })
  })

module.exports = router;