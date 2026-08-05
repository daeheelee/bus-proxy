// api/bus.js
export default async function handler(req, res) {
  const { stationId } = req.query;
  const API_KEY = process.env.API_KEY;

  // 공공데이터 API 호출 (타임스탬프 제거!)
  const targetUrl = `https://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalListv2?serviceKey=${API_KEY}&stationId=${stationId}&resultType=json`;

  try {
    const response = await fetch(targetUrl);
    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // s-maxage=12 : Vercel 서버가 12초 동안 결과를 저장해두고 응답함
    // stale-while-revalidate=5 : 12초가 지나면 일단 이전 데이터를 보여주면서 뒤에서 새 데이터를 가져옴
    res.setHeader('Cache-Control', 'public, s-maxage=12, stale-while-revalidate=5');

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
}
