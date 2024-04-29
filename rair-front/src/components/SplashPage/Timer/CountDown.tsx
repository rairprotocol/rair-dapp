//@ts-nocheck
import React, { memo, useCallback, useEffect, useState } from 'react';
import moment from 'moment-timezone';

import { ICountdown, TCowntdownObject } from '../splashPage.types';

import './Countdown.css';

const CountdownComponent: React.FC<ICountdown> = ({ setTimerLeft, time }) => {
  const dec = moment(new Date(time)); //.tz("America/New_York");
  const [countdownDate /*setCountdownDate*/] = useState(dec);

  const [state, setState] = useState<TCowntdownObject>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const setNewTime = useCallback(() => {
    const currentTime = new Date().getTime();
    const distanceToDate = countdownDate - currentTime;

    if (countdownDate) {
      const days = Math.floor(distanceToDate / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor(
        (distanceToDate % (1000 * 60 * 60)) / (1000 * 60)
      );
      let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);
      const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      // days = `${days}`;
      if (numbersToAddZeroTo.includes(hours)) {
        hours = +`0${hours}`;
      } else if (numbersToAddZeroTo.includes(minutes)) {
        minutes = +`0${minutes}`;
      } else if (numbersToAddZeroTo.includes(seconds)) {
        seconds = +`0${seconds}`;
      }
      setState({ days: days, hours: hours, minutes, seconds });
    }
    if (distanceToDate <= 0 && setTimerLeft) {
      setTimerLeft(0);
    }
  }, [countdownDate, setTimerLeft]);
  useEffect(() => {
    const interval = setInterval(() => setNewTime(), 1000);
    return () => {
      clearInterval(interval);
    };
  }, [setNewTime]);
  return (
    <div className={'root-time'}>
      {/* <header className={cl.header}>
                <h1 className={cl.title}>Time left until release</h1>
            </header> */}
      <h3 className={'subtitle'}>Time left until release</h3>
      <div className={'countdownWrapper'}>
        <div className={'timeSection'}>
          <div className={'time'}>{state.days || '0'}</div>
          <small className={'timeText'}>Days</small>
        </div>
        <div className={'timeSection'}>
          <div className={'time'}>:</div>
        </div>
        <div className={'timeSection'}>
          <div className={'time'}>{state.hours || '00'}</div>
          <small className={'timeText'}>Hours</small>
        </div>
        <div className={'timeSection'}>
          <div className={'time'}>:</div>
        </div>
        <div className={'timeSection'}>
          <div className={'time'}>{state.minutes || '00'}</div>
          <small className={'timeText'}>Minutes</small>
        </div>
        <div className={'timeSection'}>
          <div className={'time'}>:</div>
        </div>
        <div className={'timeSection'}>
          <div className={'time'}>{state.seconds || '00'}</div>
          <small className={'timeText'}>Seconds</small>
        </div>
      </div>
    </div>
  );
};
export const Countdown = memo(CountdownComponent);
