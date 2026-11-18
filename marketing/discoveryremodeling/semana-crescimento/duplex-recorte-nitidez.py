import onnxruntime as ort,cv2,numpy as np,subprocess,sys
SEG=[(0.0,5.2),(10.9,12.7),(18.2,19.95),(20.0,23.6),(27.8,31.5),(33.2,37.7),(45.7,49.4),(231.7,236.6)]
ids=[int(x) for x in sys.argv[1:]]
so=ort.SessionOptions();so.intra_op_num_threads=2
s=ort.InferenceSession('sr/realesr-general-x4v3.onnx',so,providers=['CPUExecutionProvider'])
n=s.get_inputs()[0].name
W,H=480,608;OW,OH=1080,1368
for i in ids:
    a,b=SEG[i]
    r=subprocess.Popen(['ffmpeg','-v','error','-ss',str(a),'-t',str(b-a),'-i','orig.mp4','-vf',f'fps=30,crop={W}:{H}:0:0','-f','rawvideo','-pix_fmt','bgr24','-'],stdout=subprocess.PIPE)
    w=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s',f'{OW}x{OH}','-r','30','-i','-','-c:v','libx264','-crf','10','-preset','fast','-pix_fmt','yuv420p',f'v{i}.mp4'],stdin=subprocess.PIPE)
    k=0
    while True:
        buf=r.stdout.read(W*H*3)
        if len(buf)<W*H*3:break
        im=np.frombuffer(buf,np.uint8).reshape(H,W,3)
        x=(im[:,:,::-1].astype(np.float32)/255).transpose(2,0,1)[None]
        y=s.run(None,{n:x})[0][0].transpose(1,2,0)[:,:,::-1].clip(0,1)*255
        y=cv2.resize(y,(OW,OH),interpolation=cv2.INTER_AREA)
        base=cv2.resize(im,(OW,OH),interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
        o=0.65*y+0.35*base
        g=np.random.normal(0,2.2,(OH,OW,1)).astype(np.float32)
        o=np.clip(o+g,0,255).astype(np.uint8)
        w.stdin.write(o.tobytes());k+=1
    w.stdin.close();w.wait();print('seg',i,k,flush=True)
