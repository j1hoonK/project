document.addEventListener('DOMContentLoaded', function () {
    // API 요청을 보내는 함수
    function sendAPIRequest() {
        var url = 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=wrsqbojOCDnORrzFczv3UCnzm9OqChTO&searchdate=20230615&data=AP01';
        var request = new XMLHttpRequest();

        request.open('GET', url, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    var response = JSON.parse(request.responseText);
                    // 응답 데이터 처리
                    console.log(response); // 콘솔에 응답 데이터 출력
                    displayExchangeInfo(response); // 응답 데이터를 사용하여 환율 정보 표시
                } else {
                    // 에러 처리
                    console.log('API 요청 실패:', request.statusText);
                }
            }
        };

        request.send();
    }
    // 페이지 로드 시, 자동 호출
sendAPIRequest();

    // 환율 정보 표시 함수
    function displayExchangeInfo(data) {
        var currency = prompt('환전할 화폐 단위를 입력하세요 (예: USD)');
        var amount = parseFloat(prompt('환전할 금액을 입력하세요'));

        // 환전 계산
        var exchangeRate = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i].cur_unit === currency) {
                exchangeRate = data[i].deal_bas_r;
                if(currency == "KRW"){
                    exchangeRate = 1;
                }else{
                    var splExchangeRate = exchangeRate.split(',');
                    var newExchangeRate = splExchangeRate[0]+splExchangeRate[1];
                    exchangeRate = newExchangeRate;
                    console.log(newExchangeRate);
                    console.log(splExchangeRate[0]);
                    console.log(splExchangeRate[1]);
                }
                console.log("i: " + i);
                console.log("환율: " + exchangeRate);
                break;
            }
        }

        if (exchangeRate === 0) {
            console.log('해당 화폐 단위의 환율 정보를 찾을 수 없습니다.');
        } else {
            var exchangedAmount = amount * exchangeRate;
            console.log(amount + ' ' + currency + '은(는) 약 ' + exchangedAmount.toFixed(2) + ' KRW입니다.');
        }
    }
});
