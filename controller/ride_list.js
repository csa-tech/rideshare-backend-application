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
    if (req.query.user_ID === "all"){
      connection.query(`SELECT * FROM user_info;`, function(err, rows, fields) {
        if (err) {throw err;}
        res.status(200).send(rows);
      });
    }
    else{
      connection.query(`SELECT * FROM user_info WHERE user_id = '${input.user_ID}';`, function(err, rows, fields) {
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
    connection.query(`SELECT * FROM ride_info WHERE wechat_id = '${input.wechat_id}';`, function(err, rows, fields) {
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
    var string = input.ride_id;
    connection.query(`SELECT status FROM ride_info WHERE ride_id = '${string}';`, function(err, rows, fields) {
      if (err) {throw err;}
      ride_status = rows[0].status;
      console.log("Original status: " + ride_status);
      ride_status = "accepted";
      console.log("Updated status: " + ride_status);
      connection.query(`UPDATE ride_info SET status = '` + ride_status + `' WHERE ride_id = '${string}';`, function(err, rows, fields) {
        if(err){throw err;}
        res.status(200).send('Success. New Status: ' + ride_status);
    });
  });
} catch(err) {
    res.status(500).send('Server Error:' + err);
    connection.end();
  }
}

function deny_ride (req, res, next) {
  try{
    var input = req.query;
    var string = input.ride_id;
    connection.query(`SELECT status FROM ride_info WHERE ride_id = '${string}';`, function(err, rows, fields) {
      if (err) {throw err;}
      ride_status = rows[0].status;
      // console.log("Original status: " + ride_status);
      ride_status = "denied";
      // console.log("Updated status: " + ride_status);
      connection.query(`UPDATE ride_info SET status = '` + ride_status + `' WHERE ride_id = '${string}';`, function(err, rows, fields) {
        if(err){throw err;}
        res.status(200).send('Success. New Status: ' + ride_status);
    });
  });
} catch(err) {
    res.status(500).send('Server Error:' + err);
    connection.end();
  }
}

// INSERT INTO myDataBase.pending_ride SET user_ID = 11;
function push_info (req, res, next) {
  try{
    var input = req.query;
    // console.log(`INSERT INTO ride_info SET ride_id = ` + input.ride_id + `;`)
    connection.query(`INSERT INTO ride_info SET ride_id = ` + input.ride_id + `, people_num = ` + input.people_num +`, wechat_id = ` + input.wechat_id + `, note = '` + input.note + `', status = '` + input.status + `', departure = '` + input.departure + `', destination = '` + input.destination + `', num_passenger = ` + input.approved_people + `, date = '` + input.date + `', time = '` + input.time + `', price = ` + input.price + `;`, function(err, rows, fields) {
      if (err) {console.log(err);}

  });
      // if (err) {throw err;}
      console.log("insertion successed");
      res.status(200).send('ride submitted');
  //   connection.query(`UPDATE myDataBase.pending_ride SET status = 'pending', numPeople = '` + req.query.numPeople + `' WHERE user_ID = '` + input.user_ID + `';`, function(err, rows, fields) {
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
