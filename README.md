# 개요
브롤스타즈 API를 활용해서 트로피가 가장 많은 브롤러를 보여주는 SVG 카드를 만들어서 Github를 꾸며보겠다는 프로젝트  
결론: 실패  
사유: Github에서 동적 외부 SVG를 프록시할 수 없음  

# 작업 과정
1. 처음 계획은 간단하게 vercel에서 구축하려고 했음  
2. 그런데 Brawlstars API는 정적 IP만 사용할 수 있어서 vercel 환경에서 구축할 수 없게됨 (enterprise 요금제는 정적 IP되긴 하는데 돈 쓰고 싶지 않음)  
3. 그래서 AWS free tier 계정을 만듬 -> AWS 환경에서 node.js로 API 서버를 구축함 (node-fetch, express)
4. 잘 동작함. IP 주소 입력하고 브라우저에서 보면 잘 보임  
5. 문제는 Github에서 URL로 뭔가 갖고올려면 HTTPS로 통신해야 한다고 함  
6. 그래서 Nginx, Let's encrypt 설치하고 도메인은 [Duck DNS(무료 도메인)](https://www.duckdns.org/domains)로 갖고왔음
7. 근데 결국 "Cannot proxy the given URL" 에러 뜸

# 결과물
아쉽게도 github의 md 파일에 추가하지 못했지만 결과는 이렇게 나온다.  
<img width="610" height="227" alt="스크린샷 2025-08-26 오후 3 11 10" src="https://github.com/user-attachments/assets/ffa8b91f-f605-4e4f-8f52-e359580129ef" />

# 사용법
`https://olaf-duck.duckdns.org/api/player?tag=8JOOLVOY8`  
이 URL에서 tag=부분에 자신의 player tag를 넣어주면 된다.  
브롤스타즈에 접속 후 프로필을 들어가면 이름 밑에 작게 player tag가 떠있다.  
