export default async function handler(req, res) {
  const { stationId } = req.query;
  // 이제 코드는 직접 키를 적지 않고 Vercel 설정에서 불러옵니다!
  const API_KEY = process.env.API_KEY; 

  const targetUrl = `https://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalListv2?serviceKey=${API_KEY}&stationId=${stationId}&resultType=json`;
  
  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
