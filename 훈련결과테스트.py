import random
import numpy as np
import cv2
import glob
from tensorflow.keras.models import load_model
import matplotlib.pyplot as plt

test_dir = '..\\imagesForTrain\\VND\\test'

label_dict =  {'100k': 0, '10k': 1, '1k': 2, '200k': 3, '20k': 4, '2k': 5, '500k': 6, '50k': 7, '5k': 8}
test_image_list = glob.glob(test_dir+'/*/*.jpg')
random.shuffle(test_image_list)
print(test_image_list)

test_num = 16
test_image_files = test_image_list[:test_num]

label_list = []

for i in range(len(test_image_files)):
    label = test_image_files[i].split('\\')[-2].split('.')[0].strip()
    #labeL = f'USA_{label}_dollar'
    label_list.append(label_dict[label])
    
src_img_list = []

for i in range(len(test_image_files)):
    src_img = cv2.imread(test_image_files[i], cv2.IMREAD_COLOR)
    src_img = cv2.resize(src_img, dsize=(224,224))
    src_img = cv2.cvtColor(src_img, cv2.COLOR_BGR2RGB)
    src_img = src_img / 255.0
    
    src_img_list.append(src_img)

# 4차원 텐서 변환
src_img_array = np.array(src_img_list)
label_array = np.array(label_list)

# 모델 불러오기
model = load_model('result/VND/model/19-1.00000.h5')

pred = model.predict(src_img_array)
print(pred.shape)

class_names = ['100k', '10k', '1k', '200k', '20k', '2k', '500k', '50k', '5k']
plt.figure(figsize=(12,12))

for pos in range(len(pred)):
    plt.subplot(4,4,pos+1)
    plt.axis('off')
    
    label_str = class_names[label_array[pos]]
    pred_str = class_names[np.argmax(pred[pos])]
    
    plt.title('label:' + label_str + '\npred:' + pred_str)
    plt.imshow(src_img_array[pos])
    
plt.tight_layout()
plt.show