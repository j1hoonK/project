import json
import os
import tensorflow as tf
# import tensorflowjs as tfjs
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import time
import os
from numba import cuda
#from tensorflow.keras.callbacks import ModelCheckPoint, EarlyStopping
from sklearn.model_selection import train_test_split
import numpy as np

device = cuda.get_current_device()
device.reset()
print('GPU Memory reset 완료')

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
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu', input_shape=(224, 224, 3)),
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D(pool_size=(2, 2)),
    tf.keras.layers.Dropout(0.25),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(len(class_names), activation='softmax')
])
model.summary()


X_train, x_val, y_train, y_val = train_test_split(data_generator[0], data_generator[1], test_size=0.2, random_state=123)

# X_train = np.array(X_train, dtype=np.float32) / 255.0
# x_val = np.array(x_val, dtype=np.float32) / 255.0
# y_train=tf.keras.utils.to_categorical(y_train,13)                               # one-hot, 13개 클래스
# y_val=tf.keras.utils.to_categorical(y_val,13)


MODEL_DIR ='result/EUR/mode/'

modelpath = "result/EUR/model/{epoch:02d}-{val_acc:.5f}.h5"
checkpointer = tf.keras.callbacks.ModelCheckpoint(filepath=modelpath, monitor='val_acc', verbose=1, save_best_only=True)
early_stopping_callback = tf.keras.callbacks.EarlyStopping(monitor='val_acc',patience=5)    


model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])


history = model.fit(X_train, y_train, batch_size=12, epochs=60, verbose=1, callbacks=[early_stopping_callback, checkpointer])


print('\n Test Accuarcy:%.4f' %(model.evaluate(x_val, y_val)))

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