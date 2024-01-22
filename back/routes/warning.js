var express = require('express');
var router = express.Router();
var database = require('../database');
// 경고 데이터 저장 API
router.post('/:type', function(req, res) {
    // 요청으로부터 사용자 ID 추출 및 URL 경로 변수에서 경고 타입 추출
    const user_id = req.body.user_id;
    const warning_type = req.params.type;
  
    // 현재 시간을 경고 시간으로 설정
    const warning_time = new Date();
  
    // 데이터베이스에 경고 데이터 추가
    const query = 'INSERT INTO Warnings (user_id, warning_time, warning_type) VALUES (?, ?, ?)';
    database.query(query, [user_id, warning_time, warning_type], (error, results, fields) => {
      if (error) {
        res.status(500).send('Error in saving warning data');
      } else {
        res.status(200).send('Warning data saved successfully');
      }
    });
  });

  router.get('/today', function(req, res) {
    const date = req.query.date;
    const user_id = req.query.user_id;
  
    const query = 'SELECT warning_type, COUNT(*) AS warning_count FROM Warnings WHERE DATE(warning_time) = ? AND user_id = ? GROUP BY warning_type';
    
    database.query(query, [date, user_id], (error, results, fields) => {
      if (error) {
        res.status(500).send('Error in fetching warning statistics: ' + error.message);
      } else {
        if (results.length === 0) {
          res.status(404).send('No warnings found for this user on the specified date');
        } else {
          res.status(200).json(results);
        }
      }
    });
  });
  
  module.exports = router;
  