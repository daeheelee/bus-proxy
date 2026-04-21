export default async function handler(req, res) {
    const serviceKey = 'qhtl6dpNTIH/nfkU5JTrAP1X1lRL9RHmUTLJCaFb4Se92mQzuvUAfkkqKWOD4pNSskX0vv7jQVFd4P7MrxbvdA==';
    const base_url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';
    
    // 현재 시간 계산 (기상청은 매시 40분 이후에 데이터가 갱신됨)
    const now = new Date();
    const base_date = now.toISOString().slice(0, 10).replace(/-/g, "");
    const base_time = now.getHours().toString().padStart(2, '0') + "00";
    
    // 구리시 좌표 (x: 63, y: 127)
    const url = `${base_url}?serviceKey=${serviceKey}&pageNo=1&numOfRows=10&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=63&ny=127`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // 데이터 파싱 (T1H: 기온, PTY: 강수형태 등)
        const items = data.response.body.items.item;
        const temp = items.find(i => i.category === 'T1H').obsrValue;
        
        res.status(200).json({ temp: parseFloat(temp), feels: parseFloat(temp) }); // 일단 기온만 반환
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
}
