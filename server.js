// 1. 환경변수 불러오기
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import handler from "./api/brawler_card.js"; // 핸들러 경로

const app = express();

// 2. 라우트 설정
app.get("/api/player", handler);

// 3. 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
