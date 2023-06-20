from tensorflow.keras.preprocessing.image import ImageDataGenerator

total = 200;

augmentation = ImageDataGenerator(zoom_range = 0.2,                             # image 확대/축소(random)
                                  width_shift_range = 0.2,                      # 좌-우 shift
                                  height_shift_range = 0.2,                     # 상-하 shift
                                  horizontal_flip=True,                         # 좌우 반전
                                  #vertical_flip=True,                           # 상하 반전(별 도움안됨;)
                                  rotation_range=30                             # 랜덤 회전
                                  )
i = 0
for batch in augmentation.flow_from_directory('C:\\prj_Workspace\\imagesForTrain\\euro\\train\\Europe_50_euro',          # 원본 이미지
                                              batch_size=1,
                                              save_to_dir='C:\\prj_Workspace\\imagesForTrain\\euro\\train\\Europe_50_euro_after',          # 변환 이미지
                                              save_prefix='Europe_50_euro',                 # 이미지명 앞 이름
                                              save_format='jpg'):               # 이미지 포멧
    i += 1
    if i > total:
        break;

augmentation1 = ImageDataGenerator(zoom_range = 0.2,                             # image 확대/축소(random)
                                  width_shift_range = 0.3,                      # 좌-우 shift
                                  height_shift_range = 0.4,                     # 상-하 shift
                                  horizontal_flip=False,                         # 좌우 반전
                                  #vertical_flip=True,                           # 상하 반전(별 도움안됨;)
                                  rotation_range=30                             # 랜덤 회전
                                  )
i = 0
for batch in augmentation1.flow_from_directory('C:\\prj_Workspace\\imagesForTrain\\euro\\train\\Europe_50_euro',          # 원본 이미지
                                              batch_size=1,
                                              save_to_dir='C:\\prj_Workspace\\imagesForTrain\\euro\\train\\Europe_50_euro_after',          # 변환 이미지
                                              save_prefix='Europe_50_euro',                 # 이미지명 앞 이름
                                              save_format='jpg'):               # 이미지 포멧
    i += 1
    if i > total:
        break;

augmentation2 = ImageDataGenerator(zoom_range = 0.4,                             # image 확대/축소(random)
                                  width_shift_range = 0.2,                      # 좌-우 shift
                                  height_shift_range = 0.2,                     # 상-하 shift
                                  horizontal_flip=True,                         # 좌우 반전
                                  #vertical_flip=True,                           # 상하 반전(별 도움안됨;)
                                  rotation_range=68                             # 랜덤 회전
                                  )
i = 0
for batch in augmentation2.flow_from_directory('C:\\prj_Workspace\\imagesForTrain\\euro\\train\\Europe_50_euro',          # 원본 이미지
                                              batch_size=1,
                                              save_to_dir='C:\\prj_Workspace\\imagesForTrain\\euro\\train\\Europe_50_euro_after',          # 변환 이미지
                                              save_prefix='Europe_50_euro',                 # 이미지명 앞 이름
                                              save_format='jpg'):               # 이미지 포멧
    i += 1
    if i >total:
        break;

augmentation = ImageDataGenerator(zoom_range = 0.3,                             # image 확대/축소(random)
                                  width_shift_range = 0.1,                      # 좌-우 shift
                                  height_shift_range = 0.4,                     # 상-하 shift
                                  horizontal_flip=False,                         # 좌우 반전
                                  #vertical_flip=True,                           # 상하 반전(별 도움안됨;)
                                  rotation_range=49                             # 랜덤 회전
                                  )
i = 0
for batch in augmentation.flow_from_directory('C:\\prj_Workspace\\imagesForTrain\\euro\\train\\Europe_50_euro',          # 원본 이미지
                                              batch_size=1,
                                              save_to_dir='C:\\prj_Workspace\\imagesForTrain\\euro\\train\\Europe_50_euro_after',          # 변환 이미지
                                              save_prefix='Europe_50_euro',                 # 이미지명 앞 이름
                                              save_format='jpg'):               # 이미지 포멧
    i += 1
    if i > total:
        break;