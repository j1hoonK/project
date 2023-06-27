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
//console.log(':'+isUploaded);

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

// [x] model / metadata 경로 지정

const modelImgURL1 = './result/EUR/model.json';
const metadataImgURL1 = './result/EUR/metadata.json';

const modelImgURL2 = './my_model/KRW/model.json';
const metadataImgURL2 = './my_model/KRW/metadata.json';

const modelImgURL3 = './my_model/USD/model.json';
const metadataImgURL3 = './my_model/USD/metadata.json';

// [x] model / metadata 경로 리스트
imgModelList = [modelImgURL1, modelImgURL2, modelImgURL3];
imgMetadataList = [metadataImgURL1, metadataImgURL2, metadataImgURL3];


let model, labelCont, maxPredicts;
let imgMaxlist = {};

async function detectImg() {
    var isUploaded = isImageUploaded();
    if (isUploaded) {
        for (let i = 0; i < imgModelList.length; i++) {
            modelImgURL = imgModelList[i];
            metadataImgURL = imgMetadataList[i];

            model = await tmImage.load(modelImgURL, metadataImgURL);
            maxPredicts = model.getTotalClasses();

            // 가장 높은 확률 값을 가진 클래스 레이블 찾기
            var image = document.getElementById('money-image');
            const prediction = await model.predict(image, false);
            let highestProbability = 0;
            let highestLabel = '';
            for (let i = 0; i < maxPredicts; i++) {
                if (prediction[i].probability > highestProbability) {
                    highestProbability = prediction[i].probability;
                    highestLabel = prediction[i].className;
                }
            }
            imgMaxlist[highestProbability] = highestLabel;
        }

        labelCont = document.getElementById('imageLabel-container');
        for (let i = 0; i < maxPredicts; i++) {
            // and class labels
            labelCont.appendChild(document.createElement('div'));
        }
        Predict();
    } else {
        alert("먼저 이미지를 업로드해주세요");
    }
}

// run the webcam image through the image model
async function Predict() {
    imgMaxValue = Math.max(...Object.keys(imgMaxlist));
    imgTopLabel = imgMaxlist[imgMaxValue];
    imgLabelSplit = imgTopLabel.split("_");
    console.log("imgTopLabel: ", imgTopLabel);

    imgCountry = imgLabelSplit[0];
    imgAmount = imgLabelSplit[1];
    imgUnit = imgLabelSplit[2];
    // 가장 높은 확률 값을 가진 클래스 레이블을 표시
    const labelElement = document.createElement('div');
    labelElement.textContent = imgCountry + ': ' + imgAmount + ' ' + imgUnit + '입니다.';                 // 실제 사용될 항목
    //labelElement.textContent = highestLabel + ' 입니다.';                 // 실제 사용될 항목
    // labelElement.textContent = highestLabel + ': ' + highestProbability.toFixed(4) * 100 + '% 입니다.';                 // 테스트용 표기 항목
    // 기존의 모든 요소 제거
    while (labelCont.firstChild) {
        labelCont.firstChild.remove();
    }

    // 가장 높은 확률 값을 가진 클래스 레이블을 추가
    labelCont.appendChild(labelElement);
    sendAPIRequest_img()                    // 환율 API 호출
}
// 국가 코드 정보
var imgCountryDict = { "EUR": "Europe" };

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
                console.log('==================== [환율정보:] ====================\n', response); // 콘솔에 응답 데이터 출력
                displayExchangeInfo_img(response); // 응답 데이터를 사용하여 환율 정보 표시
            } else {
                // 에러 처리
                console.log('====================[ API 요청 실패:', request.statusText, "] ====================");
            }
        }
    };

    request.send();
}

// 환율 정보 표시 함수
function displayExchangeInfo_img(data) {
    imgCountry = imgLabelSplit[0];
    imgAmount = imgLabelSplit[1];
    imgUnit = imgLabelSplit[2];

    var currency = imgLabelSplit[0];
    console.log("currency: " + currency);
    var amount = imgAmount;
    console.log("imgAmount: " + imgAmount);

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
        var exchangedAmount = imgAmount * exchangeRate;
        var labelContainer = document.getElementById("eChangeRstImg");
        // 기존내용 삭제
        while (labelContainer.firstChild) {
            labelContainer.firstChild.remove();
        }
        if (currency !== "KRW") {
            // 환율정보 바탕으로 환전된 금액 출력
            var exchgLabel = document.createElement('div');
            exchgLabel.textContent = 'Image: ' + amount + ' ' + currency + '은(는) 약\n' + exchangedAmount.toFixed(2) + '원 입니다.';
            labelContainer.appendChild(exchgLabel);
            console.log(amount + ' ' + currency + '은(는) 약 ' + exchangedAmount.toFixed(2) + ' KRW입니다.');
        }else{
            var exchgLabel = document.createElement('div');
            exchgLabel.textContent = 'Exchange Rate From Image';
            labelContainer.appendChild(exchgLabel);
        }
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
