export default async function handler(req, res) {
    // 1. CORS 헤더 설정: 모든 출처에서의 호출을 허용
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 2. Pre-flight 요청(OPTIONS) 처리
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const serviceKey = 'qhtl6dpNTIH/nfkU5JTrAP1X1lRL9RHmUTLJCaFb4Se92mQzuvUAfkkqKWOD4pNSskX0vv7jQVFd4P7MrxbvdA==';
    const base_url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';
    
    // 한국 시간 기준 시간 계산 (서버 환경에 상관없이 한국 시간 고정)
    const now = new Date();
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    
    // 기상청 데이터 생성 주기(매시 40분)를 고려해 1시간 전 데이터 호출 (안전성 확보)
    koreaTime.setHours(koreaTime.getHours() - 1);
    
    const base_date = koreaTime.toISOString().slice(0, 10).replace(/-/g, "");
    const base_time = koreaTime.getHours().toString().padStart(2, '0') + "00";
    
    const url = `${base_url}?serviceKey=${encodeURIComponent(serviceKey)}&pageNo=1&numOfRows=10&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=63&ny=127`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(500).json({ error: `기상청 서버 응답 에러: ${response.status}` });
        }
        
        const data = await response.json();
        
        // 결과 코드 확인 (00은 정상)
        if (data.response.header.resultCode !== "00") {
            return res.status(500).json({ error: `API 호출 실패: ${data.response.header.resultMsg}` });
        }

        const items = data.response.body.items.item;
        const tempItem = items.find(i => i.category === 'T1H');
        
        if (!tempItem) {
            return res.status(500).json({ error: '데이터 항목 없음' });
        }

        res.status(200).json({ temp: parseFloat(tempItem.obsrValue), feels: parseFloat(tempItem.obsrValue) });
    } catch (error) {
        res.status(500).json({ error: '데이터 처리 오류: ' + error.message });
    }
}
