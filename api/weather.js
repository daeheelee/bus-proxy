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
        if (!response.ok) {
            throw new Error(`API 응답 실패: ${response.status}`);
        }
        const data = await response.json();
        
        // 데이터 구조가 예상과 다를 때를 위한 방어 코드
        if (!data.response || !data.response.body || !data.response.body.items) {
            return res.status(500).json({ error: '데이터 구조 에러', raw: data });
        }

        const items = data.response.body.items.item;
        const tempItem = items.find(i => i.category === 'T1H');
        
        if (!tempItem) {
            return res.status(500).json({ error: 'T1H 데이터 없음' });
        }

        res.status(200).json({ temp: parseFloat(tempItem.obsrValue), feels: parseFloat(tempItem.obsrValue) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
