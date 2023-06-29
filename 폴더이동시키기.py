import csv
import os
import shutil

import pandas as pd

# CSV 파일 경로 설정
csv_file = "../imagesForTrain/IDR/train/_annotations.csv"  # CSV 파일 경로
file_location = '../imagesForTrain/IDR/train'
# CSV 파일을 데이터프레임으로 읽어오기
df = pd.read_csv(csv_file)

# 중복된 행 제거하기
df.drop_duplicates(subset=['filename'], inplace=True)

# 수정된 데이터프레임을 CSV 파일로 저장하기
df.to_csv(csv_file, index=False)

print("1번")
# 클래스명과 폴더 경로 매핑 정보 설정
class_folder_mapping = {
    'IND_1000_rupiah': '../imagesForTrain/IDR/train/IND_1000_rupiah',
    'IND_10000_rupiah': '../imagesForTrain/IDR/train/IND_10000_rupiah',
    'IND_100000_rupiah': '../imagesForTrain/IDR/train/IND_100000_rupiah',
    'IND_2000_rupiah': '../imagesForTrain/IDR/train/IND_2000_rupiah',
    'IND_20000_rupiah': '../imagesForTrain/IDR/train/IND_20000_rupiah',
    'IND_5000_rupiah': '../imagesForTrain/IDR/train/IND_5000_rupiah',
    'IND_50000_rupiah': '../imagesForTrain/IDR/train/IND_50000_rupiah',
    
    # 추가 클래스와 폴더 경로 매핑
}
# 중복 파일 이름 확인을 위한 집합(set) 초기화
file_names_set = set()
print('2번')
# 폴더 생성 및 파일 이동
with open(csv_file, 'r') as file:
    csv_reader = csv.reader(file)
    next(csv_reader)  # 첫 번째 행은 헤더이므로 건너뜁니다.

    for row in csv_reader:
        file_name = row[0]  # A열의 파일 이름
        class_name = row[3]  # D열의 클래스 이름
        
        # 파일 이름이 중복되거나 존재하지 않으면 건너뜁니다.
        if file_name in file_names_set or not os.path.exists(os.path.join(file_location, file_name)):
            print('3번')
            continue
        
        # 파일 이름이 중복되면 건너뜁니다.
        if file_name in file_names_set:
            continue

        file_names_set.add(file_name)

        # 클래스명에 해당하는 폴더 경로 가져오기
        folder_path = class_folder_mapping.get(class_name)

        if folder_path:
            # 폴더가 존재하지 않으면 생성
            if not os.path.exists(folder_path):
                os.makedirs(folder_path)

            # 파일을 폴더로 이동
            src_path = os.path.join(file_location, file_name)  # 파일의 현재 경로
            dest_path = os.path.join(folder_path, file_name)  # 이동할 목적지 경로
            shutil.move(src_path, dest_path)
        else:
            print(f"No folder mapping found for class: {class_name}")
