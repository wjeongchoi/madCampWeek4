var express = require("express");
var router = express.Router();
var database = require("../database");

// 사용자 설정을 리셋 또는 추가하는 API
router.post("/reset", function (req, res) {
  const { user_id } = req.body;

  // 사용자 설정을 추가하거나 이미 존재하는 경우 업데이트하는 SQL 쿼리
  const query = `
    INSERT INTO UserSettings (user_id, turtle, close, tilted, screen, alert)
    VALUES (?, true, true, true, 1, 1)
    ON DUPLICATE KEY UPDATE
    turtle = VALUES(turtle), close = VALUES(close), tilted = VALUES(tilted), screen = VALUES(screen), alert = VALUES(alert)`;

  database.query(query, [user_id], (error, results, fields) => {
    if (error) {
      res.status(500).send("Error resetting or adding user settings: " + error.message);
    } else {
      res.status(200).send("User settings reset or added successfully");
    }
  });
});

module.exports = router;
