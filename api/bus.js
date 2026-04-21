export default async function handler(req, res) {
  // 사용자가 요청한 stationId를 받습니다
  const { stationId } = req.query;
  const API_KEY = '본인의_API_KEY'; // 여기에 본인의 키를 넣으세요!
  
  const targetUrl = `https://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalListv2?serviceKey=${API_KEY}&stationId=${stationId}&resultType=json`;
  
  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    
    // CORS 문제를 해결하기 위해 헤더 추가
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
