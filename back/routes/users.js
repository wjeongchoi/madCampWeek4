var express = require("express");
var router = express.Router();
var database = require("../database");
var bcrypt = require("bcrypt");
const saltRounds = 10; // 비밀번호 해싱을 위한 salt 라운드

/* GET users listing. */
router.get("/", function (req, res, next) {
  // 데이터베이스에서 모든 사용자 정보 조회
  const query = "SELECT * FROM Users";
  database.query(query, (error, results, fields) => {
    if (error) {
      // 데이터베이스 오류 처리
      res.status(500).send("Error in fetching users");
    } else {
      // 조회된 사용자 정보 반환
      res.status(200).json(results);
    }
  });
});

// 회원가입 API
router.post("/register", async function (req, res) {
  try {
    const { id, username, password } = req.body;

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 데이터베이스에 사용자 추가
    const query = "INSERT INTO Users (id, username, password) VALUES (?, ?, ?)";
    database.query(
      query,
      [id, username, hashedPassword],
      (error, results, fields) => {
        if (error) {
          res.status(500).send("Error in saving user");
        } else {
          res.status(200).send("User registered successfully");
        }
      }
    );
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.get("/origin/:userId", function (req, res) {
  const userId = req.params.userId;

  // 데이터베이스에서 사용자의 특정 신체 부위 좌표 조회
  const query = "SELECT nose, leftEar, rightEar, leftShoulder, rightShoulder FROM Users WHERE id = ?";
  database.query(query, [userId], (error, results, fields) => {
    if (error) {
      res.status(500).send("Error in fetching user's body part coordinates");
    } else if (results.length === 0) {
      res.status(404).send("User not found");
    } else {
      // null 체크 및 좌표 변환
      const parseCoordinates = (coordinates) => {
        return coordinates ? coordinates.split(',').map(Number) : null;
      };

      const userCoordinates = {
        nose: parseCoordinates(results[0].nose),
        leftEar: parseCoordinates(results[0].leftEar),
        rightEar: parseCoordinates(results[0].rightEar),
        leftShoulder: parseCoordinates(results[0].leftShoulder),
        rightShoulder: parseCoordinates(results[0].rightShoulder)
      };

      res.status(200).json(userCoordinates);
    }
  });
});


// POST to update a user's origin
router.post("/origin", function (req, res) {
  const { userId, nose, leftEar, rightEar, leftShoulder, rightShoulder } = req.body;

  // 데이터베이스에서 사용자의 원점 좌표 업데이트
  const query = `
    UPDATE Users 
    SET 
      nose = ?,
      leftEar = ?,
      rightEar = ?,
      leftShoulder = ?,
      rightShoulder = ?
    WHERE id = ?`;
  database.query(
    query,
    [nose, leftEar, rightEar, leftShoulder, rightShoulder, userId],
    (error, results, fields) => {
      if (error) {
        // 데이터베이스 오류 처리
        res.status(500).send("Error updating user's origin");
      } else {
        if (results.affectedRows === 0) {
          // 사용자가 없는 경우
          res.status(404).send("User not found");
        } else {
          // 업데이트 성공
          res.status(200).send("User's origin updated successfully");
        }
      }
    }
  );
});


// 로그인 API
router.post("/login", function (req, res) {
  const { id, password } = req.body;

  // 데이터베이스에서 사용자 검색
  const query = "SELECT * FROM Users WHERE id = ?";
  database.query(query, [id], async (error, results, fields) => {
    if (error) {
      res.status(500).send("Error in fetching user");
    } else {
      if (results.length > 0) {
        // 저장된 해시된 비밀번호와 제출된 비밀번호 비교
        const match = await bcrypt.compare(password, results[0].password);
        if (match) {
          res.status(200).send("User logged in successfully");
        } else {
          res.status(401).send("Password does not match");
        }
      } else {
        res.status(400).send("User not found");
      }
    }
  });
});

// 사용자 정보 삭제 API
router.post('/delete', function(req, res) {
  const { id, password } = req.body;

  // 먼저 사용자의 현재 비밀번호 확인
  const userQuery = 'SELECT password FROM Users WHERE id = ?';
  database.query(userQuery, [id], async (error, results, fields) => {
    if (error) {
      return res.status(500).send('Error in fetching user');
    }

    if (results.length > 0) {
      // 비밀번호 비교
      const match = await bcrypt.compare(password, results[0].password);
      if (match) {
        // ProgramUsage 테이블에서 관련 데이터 삭제
        const deleteProgramUsageQuery = 'DELETE FROM ProgramUsage WHERE user_id = ?';
        database.query(deleteProgramUsageQuery, [id], (deleteError, deleteResults, deleteFields) => {
          if (deleteError) {
            return res.status(500).send('Error in deleting program usage data');
          }

          // Warnings 테이블에서 관련 데이터 삭제
          const deleteWarningsQuery = 'DELETE FROM Warnings WHERE user_id = ?';
          database.query(deleteWarningsQuery, [id], (warningError, warningResults, warningFields) => {
            if (warningError) {
              return res.status(500).send('Error in deleting warnings data');
            }

            // UserSettings 테이블에서 관련 데이터 삭제
            const deleteUserSettingsQuery = 'DELETE FROM UserSettings WHERE user_id = ?';
            database.query(deleteUserSettingsQuery, [id], (settingsError, settingsResults, settingsFields) => {
              if (settingsError) {
                return res.status(500).send('Error in deleting user settings data');
              }

              // 사용자 삭제
              const deleteUserQuery = 'DELETE FROM Users WHERE id = ?';
              database.query(deleteUserQuery, [id], (deleteUserError, deleteUserResults, deleteUserFields) => {
                if (deleteUserError) {
                  return res.status(500).send('Error in deleting user');
                }
                res.status(200).send('User deleted successfully');
              });
            });
          });
        });
      } else {
        res.status(401).send('Password does not match');
      }
    } else {
      res.status(404).send('User not found');
    }
  });
});

module.exports = router;
