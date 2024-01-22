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

// 지정된 날짜의 사용자별 시간대별 사용 시간 조회
router.get("/today", function (req, res) {
  const { date, user_id } = req.query;

  // 모든 시간대에 대한 기본 데이터 생성
  let hourlyUsage = Array.from({ length: 24 }, (_, hour) => ({ hour, usage_time: 0 }));

  const query = `
    SELECT 
      HOUR(start_time) AS hour,
      SUM(TIMESTAMPDIFF(MINUTE, start_time, end_time)) AS usage_time
    FROM ProgramUsage
    WHERE user_id = ? AND DATE(start_time) = ? AND DATE(end_time) = ?
    GROUP BY HOUR(start_time)`;

  database.query(query, [user_id, date, date], (error, results, fields) => {
    if (error) {
      res.status(500).send("Error in fetching program usage data: " + error.message);
    } else {
      // 데이터베이스 결과를 기본 데이터에 매핑
      results.forEach(result => {
        hourlyUsage[result.hour].usage_time = result.usage_time;
      });

      res.status(200).json(hourlyUsage);
    }
  });
});
module.exports = router;
