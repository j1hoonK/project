function readimgURL(input) {
    if (input.files && input.files[0]) {

        var reader = new FileReader();

        reader.onload = function (e) {
            $('.image-upload-wrap').hide();

            $('.file-upload-image').attr('src', e.target.result);
            $('.file-upload-content').show();
            //$('.image-title').html(input.files[0].name);

            
        };

        reader.readAsDataURL(input.files[0]);

    } else {
        removeUpload();
    }
}

var isUploaded = isImageUploaded();
console.log(':'+isUploaded);

function removeUpload() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
    $('.file-upload-image').attr('src', '');

}
$('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
});


// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const imgURL = './my_model/';

let model, labelCont, maxPredicts;
// Load the image model and setup the webcam
async function detectImg() {
    var isUploaded = isImageUploaded();
    console.log('버튼누르고:'+isUploaded);
    if (isUploaded){
        console.log('이거는true:'+isUploaded);
        const modelimgURL = imgURL + 'model.json';
        const metadataimgURL = imgURL + 'metadata.json';
        
        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelimgURL, metadataimgURL);
        maxPredicts = model.getTotalClasses();
        
        labelCont = document.getElementById('imageLabel-container');
        for (let i = 0; i < maxPredicts; i++) {
            // and class labels
            labelCont.appendChild(document.createElement('div'));
        }
        Predict();
    }else{
        console.log('이거는false:'+isUploaded);
        alert("이미지를 먼저 업로드해주세요");
}}

// run the webcam image through the image model
async function Predict() {
    var image = document.getElementById('money-image');
    const prediction = await model.predict(image, false);
    // 가장 높은 확률 값을 가진 클래스 레이블 찾기
    let highestProbability = 0;
    let highestLabel = '';
    for (let i = 0; i < maxPredicts; i++) {
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
    while (labelCont.firstChild) {
        labelCont.firstChild.remove();
    }

    // 가장 높은 확률 값을 가진 클래스 레이블을 추가
    labelCont.appendChild(labelElement);
    sendAPIRequest_img()
}
// API 요청을 보내는 함수
function sendAPIRequest_img() {
    var url = 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=wrsqbojOCDnORrzFczv3UCnzm9OqChTO&searchdate=20230615&data=AP01';
    var request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                var response = JSON.parse(request.responseText);
                // 응답 데이터 처리
                console.log(response); // 콘솔에 응답 데이터 출력
                displayExchangeInfo_img(response); // 응답 데이터를 사용하여 환율 정보 표시
            } else {
                // 에러 처리
                console.log('API 요청 실패:', request.statusText);
            }
        }
    };

    request.send();
}
// 페이지 로드 시, 자동 호출
// sendAPIRequest();

// 환율 정보 표시 함수
function displayExchangeInfo_img(data) {
    var currency = prompt('환전할 화폐 단위를 입력하세요 (예: USD)');
    var amount = parseFloat(prompt('환전할 금액을 입력하세요'));

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

function isImageUploaded() {
    var imageElement = $('.file-upload-image');
    var src = imageElement.attr('src');

    if (src && src !== "#") {
        return true; // 이미지가 업로드되었음
    } else {
        return false; // 이미지가 업로드되지 않았음
    }
}
