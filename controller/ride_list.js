const mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'mydatabase.c9ukuxyqda4n.us-west-1.rds.amazonaws.com',
  user     : 'CSAUser',
  password : 'Csa666!!',
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
      var obj = input.input;
      res.status(200).send(obj);

  } catch(err) {
    res.status(500).send('Server Error:' + err);
    connection.end();
  }
}


function view_pending (req, res, next) {
  try{
    var input = req.query;
    connection.query("SELECT * FROM application WHERE status='PENDING' AND application.passenger_id = ?;",
    [
      input.user_id
    ],
    function(err, rows, fields) {
      if (err) {throw err;}
      connection.query("SELECT * FROM ride WHERE status='OPEN' AND ride.driver_id = ?;",
      [
        input.user_id
      ],
      function(err, rows2, fields) {
        if (err) {throw err;}
        rows = rows.concat(rows2);
        var obj = {
          "result":{}
        };
        obj.result = rows;
        console.log(JSON.parse(JSON.stringify(obj)));
        res.status(200).send(obj);
      });
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
    connection.query("UPDATE application SET status='ACCEPTED' WHERE application.application_id = ? AND application.passenger_id =?;",
    [
      input.application_id,
      input.user_id
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
    connection.query("UPDATE application SET status='DENIED' WHERE application.application_id = ? AND application.passenger_id =?;",
    [
      input.application_id,
      input.user_id
    ],
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

        connection.query("INSERT INTO ride SET ride_id = ?, people_num = ?, wechat_id = ?, note = ?, status = ?, departure = ?, destination = ?, num_passenger = ?, date = ?, time = ?, price =?;",
        [
          number,
          input.people_num,
          input.wechat_id,
          input.note,
          input.status,
          input.departure,
          input.destination,
          input.approved_people,
          input.data,
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
