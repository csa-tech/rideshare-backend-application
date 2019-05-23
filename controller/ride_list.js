const mysql = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.HOST,
  user     : process.env.USER,
  password : process.env.PASSWORD,
  port     : '3306',
  database : 'rideshare'
});
connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

function view_ride (req, res, next) {
  try{
    var input = req.query;
    if (req.query.user_ID === "all"){
      connection.query(`SELECT * FROM application INNER JOIN ride ON application.ride_id=ride.ride_id;`, function(err, rows, fields) {
        if (err) {throw err;}
        res.status(200).send(rows);
      });
    }
    else{
    //   connection.query("SELECT * FROM bank_accounts WHERE dob = ? AND bank_account = ?",
    // [
    //  req.body.dob,
    //  req.body.account_number
    // ],
    // function(error, results) { 
    
    // }
// );
      connection.query("SELECT * FROM application INNER JOIN ride ON application.ride_id=ride.ride_id WHERE application.ride_id = ?;", 
        [
          input.user_ID
        ],
        function(err, rows, fields) {
          if (err) {throw err;}
          res.status(200).send(rows);
        });
    }
  } catch(err) {
    res.status(500).send('Server Error:' + err);
    connection.end();
  }
}


function view_pending (req, res, next) {
  try{
    var input = req.query;
    connection.query("SELECT * FROM application INNER JOIN ride ON application.ride_id=ride.ride_id WHERE application.applicant_id = ?;",
      [
        input.user_ID
      ],
      function(err, rows, fields) {
      if (err) {throw err;}
      res.status(200).send(rows);
    });
  } catch(err) {
    res.status(500).send('Server Error:' + err);
    connection.end();
  }
}


function accept_ride (req, res, next) {
  try{
    var input = req.query;
    var string = input.application_id;
    connection.query("UPDATE application SET status='accepted' WHERE application.application_id = '${string}';",
      [
        input.user_ID
      ],
      function(err, rows, fields) {
      if(err){throw err;}
      res.status(200).send('Success. New Status: accepted');
    });
} catch(err) {
    res.status(500).send('Server Error:' + err);
    connection.end();
  }
}

function deny_ride (req, res, next) {
  try{
    var input = req.query;
    var string = input.application_id;
    connection.query("UPDATE application SET status='denied' WHERE application.application_id = ?;",
      [
        string
      ] ,
      function(err, rows, fields) {
        if(err){throw err;}
        res.status(200).send('Success. New Status: denied');
      });
  } catch(err) {
    res.status(500).send('Server Error:' + err);
    connection.end();
  }
}

// INSERT INTO myDataBase.pending_application SET user_ID = 11;
function push_info (req, res, next) {
  try{
    let number = 0;
    var input = req.query;
      connection.query(`SELECT COUNT(*) AS num FROM rideshare.ride;`, function(err, rows, fields) {
        if (err) {throw err;}
        number = rows[0].num;
        number += 1;

        connection.query("INSERT INTO ride SET ride_id = ?, people_num = ?, wechat_id = ?, note = ?, status = ?, departure = ?, destination = ?, num_passenger = ?, date = ?, time = ?, price = ?;", 
          [
            number,
            input.people_num,
            input.wechat_id,
            input.note,
            input.status,
            input.departure,
            input.destination,
            input.approved_people,
            input.date,
            input.time,
            input.price

          ],
          function(err, rows, fields) {
            if (err) {console.log(err);}

          });
      });
    // console.log(`INSERT INTO application SET ride_id = ` + input.ride_id + `;`)

      // if (err) {throw err;}
      console.log("insertion successed");
      res.status(200).send('application submitted');
  //   connection.query(`UPDATE myDataBase.pending_application SET status = 'pending', numPeople = '` + req.query.numPeople + `' WHERE user_ID = '` + input.user_ID + `';`, function(err, rows, fields) {
  //     if (err) {throw err;}
  //       res.status(200).send('Insert successed');
  // });
}
catch(err) {
    res.status(500).send('Server Error: ' + err);
//     connection.end();
  }
}
module.exports = {view_ride, accept_ride, deny_ride, push_info, view_pending}
