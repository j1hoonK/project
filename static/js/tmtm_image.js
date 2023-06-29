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

const modelImgURL1 = './my_model/EUR/model.json';
const metadataImgURL1 = './my_model/EUR/metadata.json';

const modelImgURL2 = './my_model/VND/model.json';
const metadataImgURL2 = './my_model/VND/metadata.json';

const modelImgURL3 = './my_model/USD/model.json';
const metadataImgURL3 = './my_model/USD/metadata.json';

const modelImgURL4 = './my_model/CNY/model.json';
const metadataImgURL4 = './my_model/CNY/metadata.json';

const modelImgURL5 = './my_model/JPY/model.json';
const metadataImgURL5 = './my_model/JPY/metadata.json';

// [x] model / metadata 경로 리스트
imgModelList = [modelImgURL1, modelImgURL2, modelImgURL3, modelImgURL4, modelImgURL5];
imgMetadataList = [metadataImgURL1, metadataImgURL2, metadataImgURL3, metadataImgURL4, metadataImgURL5];


let model, labelCont, maxPredicts;
let imgMaxlist = {};
let cuntryListDic = {"AED":"아랍에미리트", "AUD":"호주", "BHD":"바레인", "BND":"브루나이", "CAD":"캐나다",
"CHF":"스위스", "CNH":"중국", "DKK":"덴마크", "EUR":"유럽", "GBP":"영국", "HKD":"홍콩", "IDR":"인도네시아",
"JPY(100)":"일본", "KRW":"한국", "KWD":"쿠웨이트", "MYR":"말레이시아", "NOK":"노르웨이", "NZD":"뉴지랜드",
"SAR":"사우디", "SEK":"스웨덴", "SGD":"싱가폴", "THB":"태국", "USD":"미국"}

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

    imgCountry = cuntryListDic[imgLabelSplit[0]];
    // 가장 높은 확률 값을 가진 클래스 레이블을 표시
    const labelElement = document.createElement('div');
    labelElement.textContent = imgCountry + ': ' + imgLabelSplit[1] + ' ' + imgLabelSplit[2] + '입니다.';                 // 실제 사용될 항목
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
    var currency = imgLabelSplit[0];
    var amount = imgLabelSplit[1];
    var unit = imgLabelSplit[2];
    // 환전 계산
    var exchangeRate = 0;
    for (var i = 0; i < data.length; i++) {
        if (data[i].cur_unit === currency) {
            exchangeRate = data[i].deal_bas_r;
            if (currency == "KRW") {
                exchangeRate = 1;
            } else {
                if(exchangeRate.indexOf(",") != "-1"){
                    var splExchangeRate = exchangeRate.split(',');
                    var newExchangeRate = splExchangeRate[0] + splExchangeRate[1];
                    exchangeRate = newExchangeRate;
                }
            }
            break;
        }
    }

    if (exchangeRate === 0) {
        console.log('==================== [환율정보 검색 실패] ====================');
    } else {
        var exchangedAmount = amount * exchangeRate;
        var labelContainer = document.getElementById("eChangeRstImg");
        // 기존내용 삭제
        while (labelContainer.firstChild) {
            labelContainer.firstChild.remove();
        }
        if (currency !== "KRW") {
            // 환율정보 바탕으로 환전된 금액 출력
            var exchgLabel = document.createElement('div');
            exchgLabel.textContent = 'Image: ' + amount + ' ' + unit + '은(는) 약\n' + exchangedAmount.toFixed(2) + '원 입니다.';
            labelContainer.appendChild(exchgLabel);
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
