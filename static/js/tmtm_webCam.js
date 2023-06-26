// tmtm_webCam.js

let camModel, webcam, labelContainer, maxPredictions;
let camMaxlist = {};
let isPaused = false; // 일시 정지 상태를 나타내는 변수

// [x] model / metadata 경로 지정
const camURL1 = './my_model/EUR/';
const modelCamURL1 = camURL1 + 'model.json';
const metadataCamURL1 = camURL1 + 'metadata.json';

const modelCamURL2 = './my_model/KRW/model.json';
const metadataCamURL2 = './my_model/KRW/metadata.json';

const modelCamURL3 = './my_model/USD/model.json';
const metadataCamURL3 = './my_model/USD/metadata.json';

// [x] model / metadata 경로 리스트
modelList = [modelCamURL2, modelCamURL3];
metadataList = [metadataCamURL2, metadataCamURL3];

// 페이지 진입 시, WebCam 자동실행

initCam();

// WebCam Play / Stop 버튼
const webcamBtn = document.getElementById("onOff");
webcamBtn.addEventListener("click", function () {
    const is_checked = webcamBtn.checked;
    if (is_checked) {
        webcam.stop();
        console.log('==================== [Pause] ====================');
        isPaused = true;
    } else {
        isPaused = false;
        initCam();
    }
})

// WebCam 설정
async function initCam() {
    console.log('==================== [initCam] ====================');
    if (document.getElementById('webcam-container').hasChildNodes()) {          // WebCam canvas 존재 확인
        const camArea = document.getElementById("webcam-container");
        camArea.replaceChildren();                                              // canvas 삭제

        // WebCam 세팅
        const flip = false;                                                      // 좌우반전
        webcam = new tmImage.Webcam(450, 230, flip);                            // width, height, 좌우반전
        await webcam.setup();                                                   // 웹캠 사용권한 요청
        await webcam.play();                                                    // 웹캠 재생

        camPredict();                                                           // camPredict() 호출

        // 화면 Display 설정
        document.getElementById('webcam-container').appendChild(webcam.canvas); // Display될 위치 지정
        labelContainer = document.getElementById('camLabel-container');         // 클래스 레이블 표시용
        for (let i = 0; i < maxPredictions; i++) {                              // 전체 클래스 정보를 labelContainer 에 저장
            // and class labels
            labelContainer.appendChild(document.createElement('div'));          // 클래스 레이블 표시위치
            return
        }

    } else {
        // WebCam 세팅
        const flip = false;                                                      // 좌우반전
        webcam = new tmImage.Webcam(450, 230, flip);                            // width, height, 좌우반전
        await webcam.setup();                                                   // 웹캠 사용권한 요청
        await webcam.play();                                                    // 웹캠 재생

        const is_checked = webcamBtn.checked;
        if (is_checked) {
            return;
        }
        camPredict();                                                           // camPredict() 호출

        // 화면 Display 설정
        document.getElementById('webcam-container').appendChild(webcam.canvas); // Display될 위치 지정
        labelContainer = document.getElementById('camLabel-container');         // 클래스 레이블 표시용
        for (let i = 0; i < maxPredictions; i++) {                              // 전체 클래스 정보를 labelContainer 에 저장
            // and class labels
            labelContainer.appendChild(document.createElement('div'));          // 클래스 레이블 표시위치
            return
        }
    }
}

// run the webcam image through the image camModel
async function camPredict() {
    if (!isPaused) {
        webcam.update();                                // 웹캠 화면 업데이트
        for (let i = 0; i < modelList.length; i++) {
            modelCamURL = modelList[i];
            metadataCamURL = metadataList[i];

            camModel = await tmImage.load(modelCamURL, metadataCamURL);             // camModel, metadata 로딩
            maxPredictions = camModel.getTotalClasses();                            // 클래스의 총 개수 확인

            // 가장 높은 확률 값을 가진 클래스 레이블 찾기
            const prediction = await camModel.predict(webcam.canvas);

            let highestProbability = 0;
            let highestLabel = '';
            for (let i = 0; i < maxPredictions; i++) {
                if (prediction[i].probability > highestProbability) {
                    highestProbability = prediction[i].probability;
                    highestLabel = prediction[i].className;
                }
            }
            camMaxlist[highestProbability] = highestLabel;
        }
        maxValue = Math.max(...Object.keys(camMaxlist));
        topLabel = camMaxlist[maxValue];

        labelsplit = topLabel.split("_");
        camResult = labelsplit[0] + ': ' + labelsplit[1] + labelsplit[2] + '입니다.';
        // 가장 높은 확률 값을 가진 클래스 레이블을 표시
        const labelElement = document.createElement('div');
        labelElement.textContent = camResult;                      // 실제 사용될 항목
        //labelElement.textContent = highestLabel + ': ' + highestProbability.toFixed(4) * 100 + '% 입니다.';           // 테스트용 표기 항목
        // 기존의 모든 요소 제거
        while (labelContainer.firstChild) {
            labelContainer.firstChild.remove();
        }
        // 가장 높은 확률 값을 가진 클래스 레이블을 추가
        labelContainer.appendChild(labelElement);

        // on/off
        const isUseTTS = document.getElementById("ttsUse").checked;
        console.log("==================== [TTS 사용여부:", isUseTTS, "] ====================");
        ttsFile = labelsplit[0] + "_" + labelsplit[1] + "_" + labelsplit[2] + ".mp3";
        // TTS 사용여부 확인
        if (isUseTTS) {
            //가장 높은 확률 값을 가진 클래스가 90% 이상일 때 음성 출력
            if (maxValue.toFixed(4) > 0.90) {
                console.log("==================== [기준확률 충족:", maxValue, "] ====================");
                var audio = new Audio('./static/audio/' + ttsFile);
                audio.play();
            }
            else {
                console.log("==================== [기준확률 미달:", maxValue, "] ====================");
                var audio = new Audio('miss.mp3');
                audio.play();
            }
        }
        updateWebcam();                 // delay에 영향 없이 WebCam 구동
        await delay(4000);              // n 초 대기
        camMaxlist = {};                   // list 초기화
        if (!isPaused) {
            sendAPIRequest_cam();       // Stop버튼 활성화 시, API 호출 안함
        }
    }
}
// Delay 함수
function delay(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
// webCam 갱신
function updateWebcam() {
    webcam.update();
    setTimeout(updateWebcam, 0);
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
                console.log('==================== [환율정보:] ====================\n', response); // 콘솔에 응답 데이터 출력
                displayExchangeInfo_cam(response); // 응답 데이터를 사용하여 환율 정보 표시
            } else {
                // 에러 처리
                console.log('====================[ API 요청 실패:', request.statusText, "] ====================");
                camPredict();
            }
        }
    };
    request.send();
}

// 환율 정보 표시 함수
function displayExchangeInfo_cam(data) {
    var currency = labelsplit[0];
    var amount = labelsplit[1];

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
            }
            break;
        }
    }

    if (exchangeRate === 0) {
        console.log('==================== [환율정보 검색 실패] ====================');
    } else {
        var exchangedAmount = amount * exchangeRate;
        var labelContainer = document.getElementById("eChangeRstCam");
        // 기존내용 삭제
        while (labelContainer.firstChild) {
            labelContainer.firstChild.remove();
        }
        if (currency !== "KRW") {
            // 환율정보 바탕으로 환전된 금액 출력
            var exchgLabel = document.createElement('div');
            exchgLabel.textContent = 'WebCam: ' + amount + ' ' + currency + "은(는) 약 " + exchangedAmount.toFixed(2) + '원 입니다.';
            labelContainer.appendChild(exchgLabel);
        } else {
            var exchgLabel = document.createElement('div');
            exchgLabel.textContent = 'Exchange Rate From WebCam';
            labelContainer.appendChild(exchgLabel);
        }
    }
    camPredict();
}