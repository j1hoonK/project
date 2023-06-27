import os
from numba import cuda
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Input, Flatten, Conv2D, MaxPooling2D
from tensorflow.keras.applications import MobileNet
from tensorflow.keras.callbacks import EarlyStopping
import matplotlib.pyplot as plt

# GPU 메모리 리셋
device = cuda.get_current_device()
device.reset()
print('GPU Memory reset 완료')

# GPU ON
os.environ["CUDA_VISIBLE_DEVICES"] = "0"
print(os.environ["CUDA_VISIBLE_DEVICES"])

# 경로
train_dir = '../imagesForTrain/euro/train'
val_dir = '../imagesForTrain/euro/train'
test_dir = '../imagesForTrain/euro/test'

# split
train_datagen = ImageDataGenerator(rescale=1./255, validation_split=0.15)
val_datagen = ImageDataGenerator(rescale=1./255, validation_split=0.15)

# ImageDataGenerator 정의
train_generator = train_datagen.flow_from_directory(train_dir, target_size=(224,224), color_mode='rgb', class_mode='sparse', batch_size=16, shuffle=True, subset='training')
val_generator = val_datagen.flow_from_directory(val_dir, target_size=(224,224), color_mode='rgb', class_mode='sparse', batch_size=16, shuffle=True, subset='validation')

print('클래스 확인:\n',train_generator.class_indices)

base_model = MobileNet(weights='imagenet', include_top=False, input_shape=(224,224,3))

model = Sequential()
model.add(base_model)
model.add(Flatten())
model.add(Dense(32, activation='relu'))
model.add(Dropout(0.25))
model.add(Dense(7, activation='softmax'))

model.compile(optimizer=tf.keras.optimizers.Adam(2e-5), loss='sparse_categorical_crossentropy', metrics=['accuracy'])

modelpath = "result/EUR/model/{epoch:02d}-{val_accuracy:.5f}.h5"
checkpointer = tf.keras.callbacks.ModelCheckpoint(filepath=modelpath, monitor='val_accuracy', verbose=1, save_best_only=True)
earlystopping = EarlyStopping(monitor='val_loss', patience=5)
hist = model.fit(train_generator, validation_data=val_generator,epochs=50, callbacks=[earlystopping, checkpointer])

# 그래프
plt.plot(hist.history['loss'], label='train')
plt.plot(hist.history['val_loss'], label='validaition')
plt.title('Loss Trend')
plt.ylabel('loss')
plt.xlabel('epoch')
plt.legend(loc='best')
plt.grid()
plt.show()

plt.plot(hist.history['accuracy'], label='train')
plt.plot(hist.history['val_accuracy'], label='validaition')
plt.title('Accuracy Trend')
plt.ylabel('accuracy')
plt.xlabel('epoch')
plt.legend(loc='best')
plt.grid()
plt.show()







