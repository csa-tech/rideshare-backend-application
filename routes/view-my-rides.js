var express = require('express');
var ride_list = require('../controller/ride_list'); // import the controller
var router = express.Router();

// 这里的path设为'/'，因为app.js里已经设置了app.use('pageview...)，所以只要设置path的剩余部分
// 这个处理GET方法的“查看”
// router.get('/', function(req, res, next) {
//   ride_list.view(req, res, next);
// });
//
// // 这个处理POST方法的“修改”
// router.post('/', function(req, res, next) {
//   ride_list.add(req, res, next);
// });

router.get('/', function(req, res, next) {
  ride_list.view_ride(req, res, next);
});

module.exports = router;
