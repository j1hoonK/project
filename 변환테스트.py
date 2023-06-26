import tensorflow as tf
import tensorflowjs as tfjs

# 모델 로드
model = tf.keras.models.load_model('result/euro.h5')

# 모델 변환
tfjs.converters.save_keras_model(model, 'result/EUR/model')
