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
module.exports = router;
