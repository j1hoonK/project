# -*- coding: utf-8 -*-
"""
Created on Fri Jun 23 14:02:04 2023

@author: KIBWA_19
"""

from tensorflow.keras.models import load_model
import numpy as np
import os
from tensorflow.keras.preprocessing import image
import json

# 저장된 모델과 메타데이터 파일 경로 설정
model_file = 'result/EUR/euro.h5'
metadata_file = 'result/EUR/metadata.json'

# 모델 로드
model = load_model(model_file)

# 메타데이터 로드
with open(metadata_file, 'r') as f:
    metadata = json.load(f)

class_names = ["EUR_100_euro", "EUR_100_euro_b", "EUR_10_euro", "EUR_200_euro", "EUR_200_euro_b", "EUR_20_euro", "EUR_20_euro_b", "EUR_500_euro", "EUR_500_euro_b", "EUR_50_euro", "EUR_50_euro_b", "EUR_5_euro", "EUR_5_euro_b"]
image_size = [224, 224]

# 테스트 이미지 폴더 경로 설정
test_data_dir = '../imagesForTrain/euro/test'

# 테스트 이미지 파일 목록
test_image_files = os.listdir(test_data_dir)

# 각 이미지에 대한 예측 수행
for image_file in test_image_files:
    # 이미지 경로
    image_path = os.path.join(test_data_dir, image_file)
    
    # 이미지 로드 및 전처리
    img = image.load_img(image_path, target_size=image_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0
    
    # 예측
    predictions = model.predict(img_array)
    predicted_class_index = np.argmax(predictions[0])
    predicted_class = class_names[predicted_class_index]
    
    print(f'이미지: {image_file}, 예측 클래스: {predicted_class}')
