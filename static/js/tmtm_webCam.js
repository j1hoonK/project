// 이미지 모델 불러오기
const camURL = './my_model/';
const modelCamURL = camURL + 'model.json';
const metadataCamURL = camURL + 'metadata.json';

// WebCam Play / Stop 버튼
const changDelay = document.getElementById("onOff");
changDelay.addEventListener("click", function () {
    const is_checked = changDelay.checked;
    if (is_checked) {
        webcam.stop();
    } else {
        initCam();
    }
})

// 페이지 진입 시, WebCam 자동실행
initCam();

let camModel, webcam, labelContainer, maxPredictions;
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
    // 3초 대기
    await delay(3000);
    // 3초(3000ms) 대기 함수
    function delay(ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    }
    camPredict();

}


