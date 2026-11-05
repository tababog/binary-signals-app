import sys, numpy as np, librosa
for f in sys.argv[1:]:
    y,sr=librosa.load(f,sr=16000)
    f0,v,p=librosa.pyin(y,fmin=70,fmax=300,sr=sr,frame_length=1024)
    f0=f0[~np.isnan(f0)]
    st=12*np.log2(f0/np.median(f0))
    rms=librosa.feature.rms(y=y)[0]; voiced=(rms>0.02).mean()
    print(f"{f:22s} variação de tom (semitons dp) {st.std():.2f}  faixa {np.percentile(st,95)-np.percentile(st,5):.1f}  fala/tempo {voiced:.2f}")
