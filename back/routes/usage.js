var express = require("express");
var router = express.Router();
var database = require("../database");

// 사용 시간 데이터 저장 API
router.post("/time", function (req, res) {
  // 요청으로부터 사용자 ID, 시작 시간, 종료 시간을 추출
  const { user_id, start_time, end_time } = req.body;

  // 데이터베이스에 사용 시간 데이터 추가
  const query =
    "INSERT INTO ProgramUsage (user_id, start_time, end_time) VALUES (?, ?, ?)";
  database.query(
    query,
    [user_id, start_time, end_time],
    (error, results, fields) => {
      if (error) {
        res.status(500).send("Error in saving program usage data");
      } else {
        res.status(200).send("Program usage data saved successfully");
      }
    }
  );
});

router.get("/today", function (req, res) {
  const { date, user_id } = req.query;

  // 시간대별 사용 시간을 계산하는 쿼리
  const query = `
  SELECT hour, SUM(usage_time) as usage_time
  FROM (
    SELECT 
      h.hour,
      LEAST(TIMESTAMPDIFF(MINUTE, GREATEST(start_time, CONCAT(?, ' ', LPAD(h.hour, 2, '0'), ':00:00')), LEAST(end_time, CONCAT(?, ' ', LPAD(h.hour + 1, 2, '0'), ':00:00'))), 60) as usage_time
    FROM (
      SELECT 0 as hour UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
      UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
      UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14
      UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19
      UNION SELECT 20 UNION SELECT 21 UNION SELECT 22 UNION SELECT 23
    ) h
    JOIN ProgramUsage pu ON pu.user_id = ? AND DATE(pu.start_time) = ? AND DATE(pu.end_time) = ?
    WHERE pu.start_time < CONCAT(?, ' ', LPAD(h.hour + 1, 2, '0'), ':00:00')
      AND pu.end_time > CONCAT(?, ' ', LPAD(h.hour, 2, '0'), ':00:00')
  ) as \`usage\`
  GROUP BY hour`;


  database.query(query, [date, date, user_id, date, date, date, date], (error, results, fields) => {
    if (error) {
      res.status(500).send("Error in fetching program usage data: " + error.message);
    } else {
      if (results.length === 0) {
        res.status(404).send('No usage data found for this user on the specified date');
      } else {
        res.status(200).json(results);
      }
    }
  });
});

module.exports = router;
