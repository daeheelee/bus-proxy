export default async function handler(req, res) {
  try {
    // 날씨 API 호출 (met.no 예시)
    const response = await fetch('https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=37.60&lon=127.14', {
      headers: { 'User-Agent': 'BMS-Proxy/1.0' }
    });
    const data = await response.json();
    const d = data.properties.timeseries[0].data.instant.details;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ temp: d.air_temperature, feels: d.air_temperature - 2 });
  } catch (error) {
    res.status(500).json({ error: 'Weather fetch failed' });
  }
}
