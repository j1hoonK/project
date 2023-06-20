import os

flist = os.scandir('C:\\prj_Workspace\\project_tmtm\\euro\\valid')
with open('C:\\prj_Workspace\\project_tmtm\\euro\\valid\\data.csv','w') as f: # 저장할 파일 data1.txt
    for fname in flist:
        with open(fname, 'r',encoding='cp949' ) as read_file: # 읽을 파일 - 개별 파일
            f.write(read_file.readlines()+'\n') # readline()-한줄, readlines()-여러줄, read()-한페이지