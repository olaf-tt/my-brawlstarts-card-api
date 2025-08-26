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
6. 그래서 Nginx, Let's encrypt 설치하고 도메인은 Duck DNS(무료 도메인)로 갖고왔음
7. 근데 결국 "Cannot proxy the given URL" 에러 뜸
