const URL = './my_model/';

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function initCam() {
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // 좌우반전
    webcam = new tmImage.Webcam(490, 230, flip); // width, height, 좌우반전
    await webcam.setup();   // 웹캠 사용권한 요청
    await webcam.play();    // 웹캠 재생
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById('webcam-container').appendChild(webcam.canvas);
    labelContainer = document.getElementById('camLabel-container');
    for (let i = 0; i < maxPredictions; i++) {
        // and class labels
        labelContainer.appendChild(document.createElement('div'));
        return
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await camPredict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function camPredict() {
    const prediction = await model.predict(webcam.canvas);
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
    labelElement.textContent = highestLabel + ': ' + highestProbability.toFixed(4) * 100 + '%';
    // 기존의 모든 요소 제거
    while (labelContainer.firstChild) {
        labelContainer.firstChild.remove();
    }

    // 가장 높은 확률 값을 가진 클래스 레이블을 추가
    labelContainer.appendChild(labelElement);

    //3초(3000ms) 대기
    await delay(3000);
    // 3초(3000ms) 대기 함수
    function delay(ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    }

    //예측 함수 실행
    camPredict();
}