export default async function handler(req, res) {
    const serviceKey = 'qhtl6dpNTIH/nfkU5JTrAP1X1lRL9RHmUTLJCaFb4Se92mQzuvUAfkkqKWOD4pNSskX0vv7jQVFd4P7MrxbvdA=='; // 디코딩된 키
    const base_url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';
    
    // 한국 시간 기준 시간 계산
    const now = new Date();
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const base_date = koreaTime.toISOString().slice(0, 10).replace(/-/g, "");
    const base_time = koreaTime.getHours().toString().padStart(2, '0') + "00";
    
    // URL 생성 시 serviceKey를 별도로 인코딩
    const url = `${base_url}?serviceKey=${encodeURIComponent(serviceKey)}&pageNo=1&numOfRows=10&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=63&ny=127`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(500).json({ error: `기상청 서버 응답 에러: ${response.status}` });
        }
        
        const data = await response.json();
        
        // 기상청 API는 성공 시에도 response.header.resultCode가 00인지 확인해야 함
        if (data.response.header.resultCode !== "00") {
            return res.status(500).json({ error: `API 호출 실패: ${data.response.header.resultMsg}` });
        }

        const items = data.response.body.items.item;
        const tempItem = items.find(i => i.category === 'T1H');
        
        res.status(200).json({ temp: parseFloat(tempItem.obsrValue), feels: parseFloat(tempItem.obsrValue) });
    } catch (error) {
        res.status(500).json({ error: '데이터 처리 중 오류: ' + error.message });
    }
}
