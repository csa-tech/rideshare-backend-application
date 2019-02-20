const mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'mydatabase.c9ukuxyqda4n.us-west-1.rds.amazonaws.com',
  user     : 'CSAUser',
  password : 'Csa666!!',
  port     : '3306',
  database : 'myDataBase'
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
      connection.query(`SELECT * FROM myDataBase.pending_ride;`, function(err, rows, fields) {
        if (err) {throw err;}
        res.status(200).send(rows);
      });
    }
    else{
      connection.query(`SELECT * FROM myDataBase.pending_ride WHERE user_ID = '${input.user_ID}';`, function(err, rows, fields) {
        if (err) {throw err;}
        res.status(200).send(rows);
      });
    }
  } catch(err) {
    res.status(500).send('Server Error:' + err);
    connection.end();
  }
}

function accept_ride (req, res, next) {
  try{
    var input = req.query;
    var string = input.user_ID;
    connection.query(`SELECT status FROM myDataBase.pending_ride WHERE user_ID = '${string}';`, function(err, rows, fields) {
      if (err) {throw err;}
      ride_status = rows[0].status;
      console.log("Original status: " + ride_status);
      ride_status = "accepted";
      console.log("Updated status: " + ride_status);
      connection.query(`UPDATE myDataBase.pending_ride SET status = '` + ride_status + `' WHERE user_ID = '${string}';`, function(err, rows, fields) {
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
    var string = input.user_ID;
    connection.query(`SELECT status FROM myDataBase.pending_ride WHERE user_ID = '${string}';`, function(err, rows, fields) {
      if (err) {throw err;}
      ride_status = rows[0].status;
      console.log("Original status: " + ride_status);
      ride_status = "denied";
      console.log("Updated status: " + ride_status);
      connection.query(`UPDATE myDataBase.pending_ride SET status = '` + ride_status + `' WHERE user_ID = '${string}';`, function(err, rows, fields) {
        if(err){throw err;}
        res.status(200).send('Success. New Status: ' + ride_status);
    });
  });
} catch(err) {
    res.status(500).send('Server Error:' + err);
    connection.end();
  }
}

module.exports = {view_ride, accept_ride, deny_ride}
