import json
import os
import time

import tensorflow as tf
from numba import cuda
# import tensorflowjs as tfjs
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# GPU 메모리 리셋
device = cuda.get_current_device()
device.reset()
print('GPU Memory reset 완료')

# GPU ON
os.environ["CUDA_VISIBLE_DEVICES"] = ""
print(os.environ["CUDA_VISIBLE_DEVICES"])

gpus = tf.config.list_physical_devices('GPU')
if gpus:
    print("GPU를 사용 중입니다.")
else:
    print("GPU를 사용할 수 없습니다.")

# 데이터 폴더 경로 및 클래스명 설정
data_dir = '../imagesForTrain/euro/train'
metadata_file = 'result/EUR/metadata.json'
model_file = 'result/EUR/model.json'
class_names = os.listdir(data_dir)
start = time.time()

print(class_names)
print("class 총:", len(class_names), "개")

# 이미지 데이터 로딩 및 전처리
datagen = ImageDataGenerator(rescale=1./255)
image_size = (224, 224)  # 이미지 크기 조정

# 이미지 데이터 및 클래스 레이블 생성
data_generator = datagen.flow_from_directory(
    data_dir,
    target_size=image_size,
    batch_size=12,
    class_mode='categorical',
    shuffle=True
)

# CNN 모델 정의 및 학습
model = tf.keras.Sequential([
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu', input_shape=(image_size[0], image_size[1], 3)),
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D(2, 2),
    tf.keras.layers.Dropout(0.25),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(512, activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(len(class_names), activation='softmax')
])
model.summary()
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(data_generator, epochs=50)

# 모델 저장
model.save('result/EUR/euro.h5')

# 메타데이터 생성
metadata = {
    'class_names': class_names,
    'image_size': image_size
}

# 메타데이터 저장
with open(metadata_file, 'w') as f:
    json.dump(metadata, f)
    
end = time.time()
print("걸린시간: ", end - start, ("s"))