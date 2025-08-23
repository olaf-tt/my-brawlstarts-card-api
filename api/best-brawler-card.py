import os
import requests
from flask import Flask, Response, request

API_TOKEN = os.environ.get("API_KEY")
BASE_URL = "https://api.brawlstars.com/v1"
HEADERS = {"Authorization": f"Bearer {API_TOKEN}"}

# Vercel에서는 Flask 앱 전체가 아니라, 단일 함수 export 필요
def handler(request):
    tag = request.args.get("tag", "")
    if not tag:
        return Response("Player tag missing", status=400)

    tag = tag.replace("#", "%23")
    url = f"{BASE_URL}/players/{tag}"
    res = requests.get(url, headers=HEADERS)
    if res.status_code != 200:
        return Response(f"API error: {res.status_code}", status=500)

    data = res.json()
    brawlers = data.get("brawlers", [])
    if not brawlers:
        return Response("No brawlers", status=404)

    top_brawler = max(brawlers, key=lambda b: b["trophies"])
    brawler_id = top_brawler["id"]
    image_url = f"https://raw.githubusercontent.com/Brawlify/CDN/refs/heads/master/brawlers/model/{brawler_id}.png"
    player_name = data.get("name", "Unknown")

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
  <rect width="100%" height="100%" rx="20" ry="20" fill="url(#glass)" filter="url(#shadow)"/>
  <image href="https://store.supercell.com/_next/static/media/logo.38da3d7b.png"
         x="16" y="16" width="50" height="50" preserveAspectRatio="xMidYMid meet" />
  <text x="80" y="50" font-size="24" fill="#00ffff" font-family="sans-serif">{player_name}</text>
  <text x="80" y="90" font-size="20" fill="#ffffff" font-family="sans-serif">{top_brawler["name"]}</text>
  <text x="80" y="120" font-size="16" fill="#ffffff" font-family="sans-serif">
    현재 트로피: {top_brawler["trophies"]} / 최대: {top_brawler["highestTrophies"]}
  </text>
  <image href="{image_url}" x="450" y="20" width="120" height="120" preserveAspectRatio="xMidYMid meet"/>
</svg>
"""
    return Response(svg, mimetype="image/svg+xml")
