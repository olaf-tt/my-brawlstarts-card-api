import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export default async function handler(req, res) {
  try {
    let tag = req.query.tag;
    if (!tag) {
      return res.status(400).send("Player tag missing");
    }

    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      return res.status(500).send("API_KEY environment variable missing");
    }

    // 서버에서 자동으로 # 붙이고 URL 인코딩
    tag = "#" + tag;
    const encodedTag = encodeURIComponent(tag);

    const url = `https://api.brawlstars.com/v1/players/${encodedTag}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    if (!response.ok) {
      return res.status(500).send(`Brawl Stars API error: ${response.status}`);
    }

    const data = await response.json();
    const brawlers = data.brawlers || [];
    if (!brawlers.length) {
      return res.status(404).send("No brawlers");
    }

    const topBrawler = brawlers.reduce((prev, curr) =>
      curr.trophies > prev.trophies ? curr : prev
    );

    const brawlerId = topBrawler.id;
    const imageUrl = `https://raw.githubusercontent.com/Brawlify/CDN/refs/heads/master/brawlers/model/${brawlerId}.png`;
    const playerName = data.name || "Unknown";

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="180">
  <!-- 배경 -->
  <rect width="100%" height="100%" rx="20" ry="20" fill="#1f2937"/>

  <!-- 로고 -->
  <image href="https://store.supercell.com/_next/static/media/logo.38da3d7b.png"
         x="16" y="16" width="50" height="50" preserveAspectRatio="xMidYMid meet"/>

  <!-- 플레이어 이름 -->
  <text x="80" y="50" font-size="28" fill="#00ffff" font-family="Verdana, sans-serif" font-weight="bold">
    ${playerName}
  </text>

  <!-- 상위 브롤러 이름 -->
  <text x="80" y="95" font-size="22" fill="#ffffff" font-family="Verdana, sans-serif" font-weight="bold">
    ${topBrawler.name}
  </text>

  <!-- 트로피 정보 -->
  <text x="80" y="130" font-size="16" fill="#d1d5db" font-family="Verdana, sans-serif">
    현재 트로피: ${topBrawler.trophies} / 최대: ${topBrawler.highestTrophies}
  </text>

  <!-- 브롤러 이미지 -->
  <image href="${imageUrl}" x="450" y="30" width="120" height="120" preserveAspectRatio="xMidYMid meet"/>

  <!-- 하단 강조선 -->
  <rect x="0" y="170" width="600" height="4" fill="#00ffff" rx="2"/>
</svg>
`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.status(200).send(svg);

  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
}
