import {useEffect, useState} from 'react';
import {PlayAlarm} from "../wailsjs/go/main/App";


function App() {
    const defaultTime = 1500; // NOTE: 60sec * 25
    const [time, setTime] = useState(defaultTime);
    const getMinutesToDisplay = (time: number) => {
        const minutes = Math.trunc(time / 60)
        return ("0" + minutes).slice(-2)
    }
    const getSecondsToDisplay = (time: number) => {
        const seconds = time % 60;
        return ("0" + seconds).slice(-2)
    }

    const [isRunning, setIsRunning] = useState(false);

    let timer: number;
    useEffect(() => {
      if (isRunning) {
        timer = setInterval(() => {
          setTime((prevTime) => prevTime - 1);
        }, 1000);
      } else {
        clearInterval(timer);
      }
      return () => clearInterval(timer);
    }, [isRunning]);

    useEffect(() => {
        if (time === 0) {
            setIsRunning(false);
            PlayAlarm();
        }
    }, [time]);

    const handleStart = () => {
      setIsRunning(true);
    };

    const handleStop = () => {
      setIsRunning(false);
    };

    const handleReset = () => {
      setIsRunning(false);
      setTime(defaultTime);
    };

    return (
        <div id="App" className="mt-4">
            <div className="flex items-center justify-center text-2xl">
                {getMinutesToDisplay(time)}:{getSecondsToDisplay(time)}
            </div>
            <div className="flex items-center justify-evenly">
              <button  onClick={handleStart}>START</button>
              <button onClick={handleStop}>STOP</button>
              <button onClick={handleReset}>RESET</button>
            </div>
        </div>
    )
}

export default App
