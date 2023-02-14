#ISS Project
#VUT FIT
#Pavel Sestak - xsesta07

import numpy as np #math lib
from matplotlib import pyplot as plt #plots
from matplotlib import patches as patches
import wave #for open audio file
import sys
from scipy import signal as sg
from scipy import fftpack
#import simpleaudio as sa
    

names = ['maskOff','maskOn']

MASKOFF = 0 #index of maskoff signal
MASKON  = 1 #index of maskon signal
SIGNAL_COUNT = 2 #number of input signals
Fs = 16000 #sample rate
SHOW_FRAME = 0
ALL = 0 # ALL = 1 all task will be completed. 
TASK = 8 #Else specific task

################### TASK 1-2 #############################

tones = []
tones.append(wave.open("../audio/maskoff_tone.wav", "r"))
tones.append(wave.open("../audio/maskon_tone.wav", "r"))

# Extract Raw Audio from Wav File
signals_raw = []
for i in range(0,len(tones)):
    signals_raw.append(tones[i].readframes(-1))
    signals_raw[i] = np.frombuffer(signals_raw[i], "int16")
    signals_raw[i] = signals_raw[i].astype('float32')

################### TASK 3 #############################

for signal in signals_raw:
    #center signals
    signal -= np.mean(signal)
    #normalize signals
    signal /= np.abs(signal).max()

#plot signals

if TASK == 3 or ALL == 1:
    fig, axs = plt.subplots(SIGNAL_COUNT)
    fig.suptitle('Centered and normalized signals')
    for i in range(SIGNAL_COUNT):
        axs[i].title.set_text('Signal '+names[i]+' 1s')
        axs[i].plot(signals_raw[i])
        axs[i].set_xlabel('samples[n]')
        axs[i].set_ylabel('y')
    fig.show()

#Make frames from signal
#f = 16KHz => 1ms == 16 samples
#1 frame == 20ms == 320 samples
#1 step == 1/2 frame == 160 samples
#frames count = signal length[s]/(frame/2) == 1000/10 = 100

SAMPLES_IN_FRAME = 320
FRAMES_COUNT = 99
# Creates a list contining FRAMES_COUNT lists, each of samples in frame items, all set to 0
frames = np.zeros((SIGNAL_COUNT,FRAMES_COUNT,SAMPLES_IN_FRAME))

for i in range(SIGNAL_COUNT):
    counter = 0
    for j in range(FRAMES_COUNT):
        for k in range(SAMPLES_IN_FRAME):
            frames[i, j, k] = signals_raw[i][counter]
            counter += 1
        counter -= int(SAMPLES_IN_FRAME/2 + 1) # we have to go half a frame back in signal and decrement last + 1

if TASK == 3 or ALL == 1:
    fig, axs = plt.subplots(SIGNAL_COUNT)
    fig.suptitle('18th frames of signals')
    time = np.arange(0,0.2,1/SAMPLES_IN_FRAME/5).tolist() #change X axe from samples to time
    for i in range(SIGNAL_COUNT):
        axs[i].title.set_text('18th frame of Signal '+names[i])
        axs[i].plot(time,frames[i][SHOW_FRAME])
        axs[i].set_xlabel('time')
        axs[i].set_ylabel('y')
    fig.show()


################### TASK 4 #############################

if TASK == 4  or ALL == 1:
    freq0 = np.zeros((SIGNAL_COUNT,FRAMES_COUNT))

    frames_clipped = np.zeros((SIGNAL_COUNT, FRAMES_COUNT, SAMPLES_IN_FRAME))

    frames_autocorrelation = np.zeros((SIGNAL_COUNT,FRAMES_COUNT,SAMPLES_IN_FRAME))

    abs_frames_autocorrelation = np.zeros((SIGNAL_COUNT,FRAMES_COUNT,SAMPLES_IN_FRAME))

    threshold = np.zeros((SIGNAL_COUNT))

    lag_val = np.zeros((SIGNAL_COUNT,FRAMES_COUNT))

    lag_index = np.zeros((SIGNAL_COUNT,FRAMES_COUNT))

    fig, axs = plt.subplots(SIGNAL_COUNT)
    fig.suptitle('Autocorrelation coefficients of 18th frame')

    for signal_id in range(SIGNAL_COUNT):

        for frame_id in range(FRAMES_COUNT):
            #central clipping in every frame
            abs_var = np.abs(frames[signal_id, frame_id])
            max_var = np.max(abs_var) * 0.7 #70% of max
            
            for k in range(SAMPLES_IN_FRAME):
                sample = frames[signal_id, frame_id, k]

                if sample > max_var:
                    frames_clipped[signal_id, frame_id, k] = 1
                elif sample < (-1*max_var):
                    frames_clipped[signal_id, frame_id, k] = -1
                else:
                    frames_clipped[signal_id, frame_id, k] = 0

            #autocorrelation    
            for k in range(SAMPLES_IN_FRAME):
                for n in range(SAMPLES_IN_FRAME-k-1):
                    frames_autocorrelation[signal_id, frame_id, k] += frames_clipped[signal_id, frame_id, n]*frames_clipped[signal_id, frame_id, n+k]

            #calculate threshold
            threshold[signal_id] = np.argwhere(frames_autocorrelation[signal_id][frame_id] == 0)[0] + 1

            frame_autocorrelation_lag = frames_autocorrelation[signal_id][frame_id].copy()
            #get max from thrashold
            for i in range(0,len(frames_autocorrelation[signal_id][frame_id])):
                if i <= threshold[signal_id]:
                    frame_autocorrelation_lag[i] = 0
                else:
                    frame_autocorrelation_lag[i] = abs(frame_autocorrelation_lag[i])
            
            lag_index[signal_id][frame_id] = np.argmax(frame_autocorrelation_lag)
       
            if frame_id == SHOW_FRAME:
                axs[signal_id].title.set_text('Signal '+names[signal_id])
                axs[signal_id].axvline(x=threshold[signal_id], color='k') #plot vertical line
                axs[signal_id].stem([lag_index[signal_id][frame_id]],[np.max(frame_autocorrelation_lag)],'r') #plot stem on lag
                axs[signal_id].plot(frames_autocorrelation[signal_id][frame_id])
                axs[signal_id].set_xlabel('samples')
                axs[signal_id].set_ylabel('y')
                threshold_patch = patches.Patch(color='black',label='Threshold')
                lag_patch  = patches.Patch(color='red',label='Lag')
                axs[signal_id].legend(handles=[threshold_patch, lag_patch])

            freq0[signal_id][frame_id] = Fs/(lag_index[signal_id][frame_id])

    fig.show()

    fig, axs = plt.subplots(SIGNAL_COUNT)
    fig.suptitle('Frame clipped to 70% coefficients of 18th frame')
    for i in range(SIGNAL_COUNT):
        axs[i].title.set_text('Signal '+names[i])
        axs[i].plot(frames_clipped[i][SHOW_FRAME])
        axs[i].set_xlabel('samples')
        axs[i].set_ylabel('y')
    fig.show()

    plt.figure('freq0')
    plt.title("Basic frame frequency")
    plt.plot(freq0[0])
    plt.plot(freq0[1])
    plt.xlabel('Frames')
    plt.ylabel('f0')
    maskOff = patches.Patch(color='blue',label='Without mask')
    maskOn  = patches.Patch(color='orange',label='With mask')
    plt.legend(handles=[maskOff, maskOn])

    print("Mean value of basic frame frequency for signal without mask ", np.mean(freq0[0]))
    print("Mean value of basic frame frequency for signal with mask ", np.mean(freq0[1]))
    print("Variance value of basic frame frequency for signal without mask ",np.std(freq0[0]))
    print("Variance value of basic frame frequency for signal with mask ",np.std(freq0[0]))

################### TASK 5 #############################

if TASK == 5 or TASK == 6 or TASK == 7 or TASK == 8 or ALL == 1:
    #implement DFT

    N = 1024
    X = np.zeros((SIGNAL_COUNT,FRAMES_COUNT, N),dtype=complex)
    X_freqs = np.zeros((SIGNAL_COUNT,N))
    P = np.zeros((SIGNAL_COUNT,FRAMES_COUNT,int(N/2+1)))
    
    '''
    #My own DFT implementation

    for i in range(SIGNAL_COUNT):
        for frame_id in range(FRAMES_COUNT):
            print("Frame ",frame_id)#checking status (very long operation)
            for k in range(N):
                for n in range(SAMPLES_IN_FRAME):
                    X[i][frame_id][k] += frames[i][frame_id][n]*(np.exp(-1j*2*np.pi*(k/N)*n))
    '''         
    #SAME BUT MUCH FASTER
    for i in range(SIGNAL_COUNT):
        X[i] = np.fft.fft(frames[i],N)
        X_freqs[i] = np.fft.fftfreq(len(X[i][20])) * Fs
        
        if TASK == 5 or ALL == 1:
            plt.figure()
            plt.plot(X_freqs[i],np.abs(X[i][20]))
            plt.xlim(0, Fs/2)
            plt.ylim(-5,40)
            plt.title('Signal '+names[i])
            plt.xlabel('Frequency [Hz]')
            plt.ylabel('Frequency spectrum magnitude')
            plt.plot()

    for i in range(SIGNAL_COUNT):
        for j in range(FRAMES_COUNT):
            for k in range(int(N/2 + 1)):
                P[i][j][k] = 20*np.log10(abs(X[i][j][k]))
    
    if TASK == 5 or ALL == 1:
        fig, axs = plt.subplots(SIGNAL_COUNT)
        fig.suptitle('Spectrograms')

        for i in range(SIGNAL_COUNT):
            axs[i].title.set_text('Signal '+names[i])
            im = axs[i].imshow(P[i].T,origin='lower', extent=[0,1,0,8000])
            axs[i].axes.set_aspect('auto')   
            axs[i].set_xlabel('time')
            axs[i].set_ylabel('frequency')
            fig.colorbar(im, ax=axs[i])
        fig.show()

################### TASK 6 #############################

if TASK == 6 or TASK == 7 or TASK == 8 or ALL == 1:
    Df = Fs/N #Frequency resolution

    indexes = np.arange(0,int(N/2 + 1),step=1,dtype=float).tolist()
    indexes = [i * Df for i in indexes] #X axe label numbers for frequency plot

    Hjw = np.zeros((FRAMES_COUNT, N),dtype=complex)
    HjwAvg = np.zeros((N),dtype=complex)
    P = np.zeros((N))

    for i in range(FRAMES_COUNT):
        h, Hjw[i] = sg.freqz(frames[MASKON][i],frames[MASKOFF][i],N,fs=Fs)
        Hjw[i] = np.abs(Hjw[i])

    #make average        
    for i in range(N):
        for j in range(FRAMES_COUNT):
            HjwAvg[i] += Hjw[j][i]
        HjwAvg[i] /= FRAMES_COUNT
        P[i] = 20*np.log10(HjwAvg[i].real)
    
    plt.figure('Frequence_response')
    plt.plot(h,P)
    plt.xlabel('f[Hz]')
    plt.title('Frequence response')
    plt.xlim(0,Fs/2 +1)
    plt.ylim(-10,20)
    plt.show()

################### TASK 7 #############################
if TASK == 7 or TASK == 8 or ALL == 1:
    h = np.zeros((N),dtype=complex)
    '''
    #My own IDFT implementation
    for n in range(N): 
        for k in range(N): 
            h[n] += HjwAvg[k]*(np.exp(1j*2*np.pi*(k/N)*n))
        h[n] /= N
    '''

    #faster ifft
    h = np.fft.ifft(HjwAvg)

    plt.figure('Impulse response')
    plt.title('Impulse response')
    plt.plot(h[:512])
    plt.ylabel('y')
    plt.show()


################### TASK 8 #############################

if TASK == 8 or ALL == 1:
    sentenses = []
    sentenses.append(wave.open("../audio/maskoff_sentence.wav", "r"))
    sentenses.append(wave.open("../audio/maskon_sentence.wav", "r"))
    
    sentenses_raw = []
    
    for i in range(0,len(sentenses)):
        sentenses_raw.append(sentenses[i].readframes(-1))
        sentenses_raw[i] = np.frombuffer(sentenses_raw[i], "int16")

    h = h[:512]

    sim_tone     = sg.lfilter(h.real,1.0,signals_raw[MASKOFF])
    sim_sentence = sg.lfilter(h.real, 1.0, sentenses_raw[MASKOFF])
    
    sim_tone     = sim_tone.astype(np.int16)
    sim_sentence = sim_sentence.astype(np.int16)
    
    #print('Start play simulated mask')
    #play_obj = sa.play_buffer(sim_sentence,1,2,Fs)
    #play_obj.wait_done()
    
    sim_file = wave.open("../audio/sim_maskon_sentence.wav","w")
    sim_file.setnchannels(1)
    sim_file.setsampwidth(2)
    sim_file.setframerate(Fs)
    sim_file.writeframesraw(sim_sentence)
    sim_file.close()

    sim_file = wave.open("../audio/sim_maskon_tone.wav","w")
    sim_file.setnchannels(1)
    sim_file.setsampwidth(2)
    sim_file.setframerate(Fs)
    sim_file.writeframesraw(sim_tone)
    sim_file.close()

    plt.figure('Maskoff sentence')
    plt.title('Maskoff sentence')
    plt.plot(sentenses_raw[MASKOFF])
    #plt.ylabel('y')
    plt.show()

    plt.figure('Maskon sentence')
    plt.title('Maskon sentence')
    plt.plot(sentenses_raw[MASKON])
    #plt.ylabel('y')
    plt.show()

    plt.figure('Sim sentence')
    plt.title('Sim sentence')
    plt.plot(sim_sentence)
    #plt.ylabel('y')
    plt.show()

################ END OF FILE ###########################
plt.show()
