import fetch from "node-fetch";

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
  <defs>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="white" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="white" stop-opacity="0.05"/>
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="100%" height="100%" rx="20" ry="20" fill="url(#glass)" filter="url(#shadow)"/>
  <image href="https://store.supercell.com/_next/static/media/logo.38da3d7b.png"
         x="16" y="16" width="50" height="50" preserveAspectRatio="xMidYMid meet"/>
  <text x="80" y="50" font-size="24" fill="#00ffff" font-family="sans-serif">${playerName}</text>
  <text x="80" y="90" font-size="20" fill="#ffffff" font-family="sans-serif">${topBrawler.name}</text>
  <text x="80" y="120" font-size="16" fill="#ffffff" font-family="sans-serif">
    현재 트로피: ${topBrawler.trophies} / 최대: ${topBrawler.highestTrophies}
  </text>
  <image href="${imageUrl}" x="450" y="20" width="120" height="120" preserveAspectRatio="xMidYMid meet"/>
</svg>
`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.status(200).send(svg);

  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
}
