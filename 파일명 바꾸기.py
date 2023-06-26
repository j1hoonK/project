# -*- coding: utf-8 -*-
"""
Created on Mon Jun 19 15:32:42 2023

@author: KIBWA_19
"""

import os


folder_path = '../imagesForTrain/euro/train/Europe_500_euro'

# 초기 숫자
number = 0

# 폴더 내의 파일들을 반복문을 통해 하나씩 확인합니다.
for filename in os.listdir(folder_path):
    if filename.endswith('.png'):  # 확장자가 jpg인 이미지 파일인지 확인합니다.
        file_path = os.path.join(folder_path, filename)
        
        # 파일이 속한 폴더명과 숫자를 언더스코어 (_)로 조합하여 새로운 파일명을 생성합니다.
        folder_name = os.path.basename(os.path.dirname(file_path))
        new_filename = f'{folder_name}_{number}.png'
        
        # 숫자를 증가시킵니다.
        number += 1
        
        # 새로운 파일명으로 파일을 이동 또는 변경합니다.
        new_file_path = os.path.join(folder_path, new_filename)
        os.rename(file_path, new_file_path)
