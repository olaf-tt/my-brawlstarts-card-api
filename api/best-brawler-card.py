import os
import requests
from flask import Flask, Response, request

app = Flask(__name__)

API_TOKEN = os.environ.get("API_KEY")  # Vercel 환경변수 사용
BASE_URL = "https://api.brawlstars.com/v1"
HEADERS = {"Authorization": f"Bearer {API_TOKEN}"}

@app.route("/api/brawler-card")
def brawler_card():
    # URL 파라미터로 플레이어 태그 전달 (# 제외 가능)
    tag = request.args.get("tag", "")
    if not tag:
        return "Player tag missing", 400

    tag = tag.replace("#", "%23")
    url = f"{BASE_URL}/players/{tag}"
    res = requests.get(url, headers=HEADERS)

    if res.status_code != 200:
        return f"API error: {res.status_code}", 500

    data = res.json()
    brawlers = data.get("brawlers", [])
    if not brawlers:
        return "No brawlers", 404

    # 트로피 가장 높은 브롤러
    top_brawler = max(brawlers, key=lambda b: b["trophies"])
    brawler_id = top_brawler["id"]
    image_url = f"https://raw.githubusercontent.com/Brawlify/CDN/refs/heads/master/brawlers/model/{brawler_id}.png"
    player_name = data.get("name", "Unknown")

    # SVG 카드 생성 (Liquid Glass 느낌 간략화)
    svg = f"""
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

  <!-- 배경 -->
  <rect width="100%" height="100%" rx="20" ry="20" fill="url(#glass)" filter="url(#shadow)"/>

  <!-- 브롤스타즈 로고 -->
  <image href="https://store.supercell.com/_next/static/media/logo.38da3d7b.png"
         x="16" y="16" width="50" height="50" preserveAspectRatio="xMidYMid meet" />

  <!-- 플레이어 이름 -->
  <text x="80" y="50" font-size="24" fill="#00ffff" font-family="sans-serif">{player_name}</text>

  <!-- 브롤러 이름 -->
  <text x="80" y="90" font-size="20" fill="#ffffff" font-family="sans-serif">{top_brawler["name"]}</text>

  <!-- 트로피 정보 -->
  <text x="80" y="120" font-size="16" fill="#ffffff" font-family="sans-serif">
    현재 트로피: {top_brawler["trophies"]} / 최대: {top_brawler["highestTrophies"]}
  </text>

  <!-- 브롤러 이미지 -->
  <image href="{image_url}" x="450" y="20" width="120" height="120" preserveAspectRatio="xMidYMid meet"/>
</svg>
"""
    return Response(svg, mimetype="image/svg+xml")

# Vercel에서 Flask 앱을 실행할 때는 WSGI entry point 사용
# Vercel에서 Flask는 `vercel`이 자동으로 실행해 줌
