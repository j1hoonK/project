import random
import numpy as np
import cv2
import glob
from tensorflow.keras.models import load_model
import matplotlib.pyplot as plt

test_dir = '..\\imagesForTrain\\euro\\test'

label_dict =  {'Europe_100_euro': 0, 'Europe_10_euro': 1, 'Europe_200_euro': 2, 'Europe_20_euro': 3, 'Europe_500_euro': 4, 'Europe_50_euro': 5, 'Europe_5_euro': 6}
test_image_list = glob.glob(test_dir+'/*.jpg')
random.shuffle(test_image_list)

test_num = 16
test_image_files = test_image_list[:test_num]

label_list = []

for i in range(len(test_image_files)):
    label = test_image_files[i].split('\\')[-1].split('_')[0].split('Euro')[0].strip()
    labeL = f'Europe_{label}_euro'
    label_list.append(label_dict[labeL])
    
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
model = load_model('result/EUR/model/230627_01/20-0.99640.h5')

pred = model.predict(src_img_array)
print(pred.shape)

class_names = ['Europe_100_euro', 'Europe_10_euro', 'Europe_200_euro', 'Europe_20_euro', 'Europe_500_euro', 'Europe_50_euro', 'Europe_5_euro']
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