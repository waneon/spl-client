import React, { useState, useEffect, useRef } from 'react';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Home() {
  const [update, setUpdate] = useState(0);

  // date
  const today = new Date();
  const dateString = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  const hour = today.getHours();
  const miniute = today.getMinutes();

  // tick
  useInterval(() => {
    setUpdate((value) => value + 1);
  }, 1000);

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ fontSize: '30pt' }}>{dateString}</div>
      <div style={{ fontSize: '160pt' }}>{hour + ':' + miniute}</div>
    </div>
  );
}

export default Home;
