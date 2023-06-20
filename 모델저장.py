# -*- coding: utf-8 -*-
"""
Created on Wed Jun  7 11:58:14 2023

@author: BIT
"""
'''
fashionMNIST 데이타 처리
'''
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

from tensorflow.keras import utils

from tensorflow.keras.datasets import fashion_mnist


(X_train, y_train),(x_test, y_test) = fashion_mnist.load_data()

#학습용 속성 데이터
x_train_encoded=X_train.reshape(60000,784).astype('float32')/255

x_test_encoded=x_test.reshape(10000,784).astype('float32')/255


#정답클래스-one-hot encoding
y_train_encoded=utils.to_categorical(y_train,num_classes=10)#0~9,
y_test_encoded=utils.to_categorical(y_test,num_classes=10)#0~9

#딥러닝 모델 구조 - 입력(784), 은닉층 하나(노드수-512), 출력(노드수,10)
model=Sequential()
model.add(Dense(512, activation='relu', input_shape=(784,)))#활성화 함수=relu
model.add(Dense(10, activation='softmax'))#활성화 함수 softmax

# 학습 설정
model.compile(optimizer='sgd', loss="mean_squared_error", metrics=['acc'])#최소제곱함수
#학습
model.fit(x_train_encoded, y_train_encoded, epochs=40, batch_size=100 )#40번 학습,
#성능 측정
print("\n Test Accuracy:%.4f"%(model.evaluate(x_test_encoded, y_test_encoded)[1]))# 테스트데이터로 서능평가

#딥러닝 모델저장(weight저장)
model.save('my_model.h5') #학습된 모델저장 h5 타입



