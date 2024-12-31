import {useEffect, useState} from 'react';
import {PlayAlarm} from '../wailsjs/go/main/App';


function App() {
    const defaultWorkingTime = 1500; // NOTE: 60sec * 25
    const defaultRestTime = 300; // NOTE: 60sec * 5
    const defaultCount = 4;
    const [workingTime, setWorkingTime] = useState(defaultWorkingTime);
    const [restTime, setRestTime] = useState(defaultRestTime)
    const [count, setCount] = useState(defaultCount);

    type FocusedTimer = 'LEFT' | 'RIGHT'
    const [focusedTimer, setFocusedTimer] = useState<FocusedTimer>('LEFT');

    type TimerState = 'STOP' | 'WORK' | 'REST' | 'PAUSE'
    const [timerState, setTimerState] = useState<TimerState>('STOP');
    const [timerStateBeforePause, setTimerStateBeforePause] = useState<Exclude<TimerState, 'PAUSE' | 'STOP'>>();

    const getMinutesToDisplay = (time: number) => {
        const minutes = Math.trunc(time / 60)
        return ('0' + minutes).slice(-2)
    }
    const getSecondsToDisplay = (time: number) => {
        const seconds = time % 60;
        return ('0' + seconds).slice(-2)
    }
    const reset = () => {
      setTimerState('STOP');
      setCount(defaultCount);
      setWorkingTime(defaultWorkingTime);
      setRestTime(defaultRestTime);
      setFocusedTimer('LEFT');
    }
    const setTimer = (time: number) => {
      if(focusedTimer === 'LEFT'){
        setWorkingTime((prev) => prev + time);
      }else if(focusedTimer === 'RIGHT'){
        setRestTime((prev) => prev + time);
      }
    }

    let timer: number;

    useEffect(() => {
      if(timerState === 'WORK') {
        timer = setInterval(() => {
          setWorkingTime((prev) => prev - 1);
        }, 1000)
      } else if(timerState === 'REST') {
        timer = setInterval(() => {
          setRestTime((prev) => prev - 1)
        }, 1000)
      } else {
        clearInterval(timer);
      }
      return () => clearInterval(timer);
    }, [timerState])

    useEffect(() => {
      if(timerState === 'WORK' && workingTime === 0){
        setTimerState('REST');
        PlayAlarm();
        setWorkingTime(defaultWorkingTime);
        setFocusedTimer('RIGHT')
      } else if (timerState === 'REST' && restTime === 0){
        setTimerState('WORK')
        PlayAlarm();
        setRestTime(defaultRestTime);
        setFocusedTimer('LEFT')
        setCount((prev) => prev - 1)
      }
    }, [workingTime, restTime])

    useEffect(() => {
      if(count === 0){
        reset();
      }
    }, [count])

    const handleStart = () => {
      if(timerStateBeforePause === 'WORK'){
        setTimerState('WORK')
      } else if(timerStateBeforePause === 'REST'){
        setTimerState('REST')
      } else {
        setTimerState('WORK')
      }
    };

    const handlePause = () => {
      if(timerState === 'WORK'){
        setTimerStateBeforePause('WORK');
      } else if(timerState === 'REST'){
        setTimerStateBeforePause('REST')
      }
      setTimerState('PAUSE')
    };

    const handleStop = () => {
      reset();
    };

    return (
        <div id='App' className='mt-4'>
            <div className='flex items-center justify-center text-2xl'>
              <div className={`border ${focusedTimer == 'LEFT' ? "border-red-500": ""}`}>
                {getMinutesToDisplay(workingTime)}:{getSecondsToDisplay(workingTime)}
              </div>
              <div className={`border ${focusedTimer == 'RIGHT' ? "border-red-500": ""}`}>
                {getMinutesToDisplay(restTime)}:{getSecondsToDisplay(restTime)}
              </div>
            </div>
            <div className='flex items-center justify-evenly'>
              <button onClick={() => setFocusedTimer('LEFT')}>◀️</button>
              <button onClick={() => setFocusedTimer('RIGHT')}>▶️</button>
            </div>
            <div className='flex flex-col items-center justify-evenly'>
              <div>
                <button onClick={() => setTimer(600)}>+ 10m</button>
                <button onClick={() => setTimer(-600)}>- 10m</button>
              </div>
              <div>
                <button onClick={() => setTimer(60)}>+ 1m</button>
                <button onClick={() => setTimer(-60)}>- 1m</button>
              </div>
              <div>
                <button onClick={() => setTimer(10)}>+ 10s</button>
                <button onClick={() => setTimer(-10)}>- 10s</button>
              </div>
              <div>
                <button onClick={() => setTimer(1)}>+ 1s</button>
                <button onClick={() => setTimer(-1)}>- 1s</button>
              </div>
            </div>
            <div className='flex items-center justify-evenly'>
              <button  onClick={handleStart}>START</button>
              <button onClick={handlePause}>PAUSE</button>
              <button onClick={handleStop}>STOP</button>
            </div>
            <div className='flex justify-evenly'>
              COUNT: <input disabled={timerState !== 'STOP'} type='number' value={count} min={1} max={20} onChange={(e) => setCount(Number(e.target.value))}/>
            </div>
        </div>
    )
}

export default App
