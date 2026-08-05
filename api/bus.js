export default async function handler(req, res) {
  const { stationId } = req.query;
  const API_KEY = process.env.API_KEY; 

  // 공공데이터 API 자체 캐싱 방지를 위한 타임스탬프 추가
  const targetUrl = `https://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalListv2?serviceKey=${API_KEY}&stationId=${stationId}&resultType=json&_t=${Date.now()}`;
  
  try {
    const response = await fetch(targetUrl, { cache: 'no-store' });
    const data = await response.json();
    
    // CORS 허용
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Vercel Edge 및 브라우저 강력 캐시 방지 헤더 설정
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
