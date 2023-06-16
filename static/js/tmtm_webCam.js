let camModel, webcam, labelContainer, maxPredictions;

// 이미지 모델 경로
const camURL = './my_model/';
const modelCamURL = camURL + 'model.json';
const metadataCamURL = camURL + 'metadata.json';

// 페이지 진입 시, WebCam 자동실행
initCam();

// WebCam Play / Stop 버튼
const webcamBtn = document.getElementById("onOff");
webcamBtn.addEventListener("click", function () {
    const is_checked = webcamBtn.checked;
    if (is_checked) {
        webcam.stop();
    } else {
        initCam();
    }
})




// WebCam 설정
async function initCam() {
        if (document.getElementById('webcam-container').hasChildNodes()) {          // WebCam canvas 존재 확인
            const camArea = document.getElementById("webcam-container");
            camArea.replaceChildren();                                              // canvas 삭제

            camModel = await tmImage.load(modelCamURL, metadataCamURL);  // camModel, metadata 로딩
            maxPredictions = camModel.getTotalClasses();           // 클래스의 총 개수 확인

            // WebCam 세팅
            const flip = true;                                  // 좌우반전
            webcam = new tmImage.Webcam(490, 230, flip);        // width, height, 좌우반전
            await webcam.setup();                                     // 웹캠 사용권한 요청
            await webcam.play();                                // 웹캠 재생
            window.requestAnimationFrame(loop);

            // 화면 Display 설정
            document.getElementById('webcam-container').appendChild(webcam.canvas);     // Display될 위치 지정
            labelContainer = document.getElementById('camLabel-container');             // 클래스 레이블 표시용
            for (let i = 0; i < maxPredictions; i++) {                                  // 전체 클래스 정보를 labelContainer 에 저장
                // and class labels
                labelContainer.appendChild(document.createElement('div'));              // 클래스 레이블 표시위치
                return
            }

        } else {
            camModel = await tmImage.load(modelCamURL, metadataCamURL);  // camModel, metadata 로딩
            maxPredictions = camModel.getTotalClasses();           // 클래스의 총 개수 확인

            // WebCam 세팅
            const flip = true;                                  // 좌우반전
            webcam = new tmImage.Webcam(490, 230, flip);        // width, height, 좌우반전
            await webcam.setup();                               // 웹캠 사용권한 요청
            await webcam.play();                                // 웹캠 재생
            window.requestAnimationFrame(loop);

            // 화면 Display 설정
            document.getElementById('webcam-container').appendChild(webcam.canvas);     // Display될 위치 지정
            labelContainer = document.getElementById('camLabel-container');             // 클래스 레이블 표시용
            for (let i = 0; i < maxPredictions; i++) {                                  // 전체 클래스 정보를 labelContainer 에 저장
                // and class labels
                labelContainer.appendChild(document.createElement('div'));              // 클래스 레이블 표시위치
                return
            }
        }
    }



async function loop() {
    webcam.update();                                // 웹캠 화면 업데이트
    await camPredict();                             // 예측 진행
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image camModel
async function camPredict() {
    const prediction = await camModel.predict(webcam.canvas);
    // 가장 높은 확률 값을 가진 클래스 레이블 찾기
    let highestProbability = 0;
    let highestLabel = '';
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > highestProbability) {
            highestProbability = prediction[i].probability;
            highestLabel = prediction[i].className;
        }
    }
    // 가장 높은 확률 값을 가진 클래스 레이블을 표시
    const labelElement = document.createElement('div');
    labelElement.textContent = highestLabel + ' 입니다.';                 // 실제 사용될 항목
    // labelElement.textContent = highestLabel + ': ' + highestProbability.toFixed(4) * 100 + '% 입니다.';                 // 테스트용 표기 항목
    // 기존의 모든 요소 제거
    while (labelContainer.firstChild) {
        labelContainer.firstChild.remove();
    }
    // 가장 높은 확률 값을 가진 클래스 레이블을 추가
    labelContainer.appendChild(labelElement);
    updateWebcam();         // delay에 영향 없이 캠 구동
    // 3초 대기
    await delay(3000);
    sendAPIRequest_cam();
}
// 3초(3000ms) 대기 함수
function delay(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
// webCam 갱신
function updateWebcam(){
    webcam.update();
    setTimeout(updateWebcam,0);
}
// API 요청을 보내는 함수
function sendAPIRequest_cam() {
    var url = 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=wrsqbojOCDnORrzFczv3UCnzm9OqChTO&searchdate=20230615&data=AP01';
    var request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                var response = JSON.parse(request.responseText);
                // 응답 데이터 처리
                console.log('response:',response); // 콘솔에 응답 데이터 출력
                displayExchangeInfo_cam(response); // 응답 데이터를 사용하여 환율 정보 표시
            } else {
                // 에러 처리
                console.log('API 요청 실패:', request.statusText);
            }
        }
    };

    request.send();
}

// 환율 정보 표시 함수
function displayExchangeInfo_cam(data) {
    var splwCamRst = document.getElementById("camLabel-container").firstChild.innerText.split('_');
    var currency = "USD"; //prompt('환전할 화폐 단위를 입력하세요 (예: USD)');
    //var currency = splwCamRst[0]; //prompt('환전할 화폐 단위를 입력하세요 (예: USD)');
    var amount = splwCamRst[1];   //parseFloat(prompt('환전할 금액을 입력하세요'));

    // 환전 계산
    var exchangeRate = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].cur_unit === currency) {
            exchangeRate = data[i].deal_bas_r;
            if (currency == "KRW") {
                exchangeRate = 1;
            } else {
                var splExchangeRate = exchangeRate.split(',');
                var newExchangeRate = splExchangeRate[0] + splExchangeRate[1];
                exchangeRate = newExchangeRate;
                // console.log(newExchangeRate);
                // console.log(splExchangeRate[0]);
                // console.log(splExchangeRate[1]);
            }
            // console.log("i: " + i);
            // console.log("환율: " + exchangeRate);
            break;
        }
    }

    if (exchangeRate === 0) {
        console.log('해당 화폐 단위의 환율 정보를 찾을 수 없습니다.');
    } else {
        var exchangedAmount = amount * exchangeRate;
        var labelContainer = document.getElementById("eChangeRstCam");
        // 기존내용 삭제
        while (labelContainer.firstChild) {
            labelContainer.firstChild.remove();
        }
        // 환율정보 바탕으로 환전된 금액 출력
        var exchgLabel = document.createElement('div');
        exchgLabel.textContent = 'WebCam: ' + amount + ' ' + currency + '은(는) 약 ' + exchangedAmount.toFixed(2) + '원 입니다.';
        labelContainer.appendChild(exchgLabel);
        //console.log(amount + ' ' + currency + '은(는) 약 ' + exchangedAmount.toFixed(2) + ' KRW입니다.');
    }
}
