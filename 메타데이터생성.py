import os
import json

train_dir = '../imagesForTrain/euro/train'
metadata_file = 'result/EUR/metadata.json'
class_names = sorted(os.listdir(train_dir))
image_size = (224, 224)

# 메타데이터 생성
metadata = {
    'class_names': class_names,
    'image_size': image_size
}

# 메타데이터 저장
with open(metadata_file, 'w') as f:
    json.dump(metadata, f)