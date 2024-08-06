const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;  // 서버 포트 설정

app.use(cors({
    origin: 'http://i11c104.p.ssafy.io'  // 특정 도메인 허용
}));
// API 라우터 설정
app.get('/api/v1/pothole/detail/:id', (req, res) => {
    // 예제 응답
    res.json({ id: req.params.id, detail: "Pothole details here" });
});
// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});