import json
import os
import tensorflow as tf
import tensorflowjs as tfjs
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import time

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
    batch_size=30,
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
model.fit(data_generator, epochs=60)

# 모델 저장
model.save('result/euro.h5')

# 메타데이터 생성
metadata = {
    'class_names': class_names,
    'image_size': image_size
}

# 메타데이터 저장
with open(metadata_file, 'w') as f:
    json.dump(metadata, f)

# 모델 로드
model = tf.keras.models.load_model('result/aaa.h5')

# 모델 변환
tfjs.converters.save_keras_model(model, 'result/model')

end = time.time()
print("걸린시간: ", end - start, ("s"))