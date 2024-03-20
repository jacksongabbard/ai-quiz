"use client";

import { useEffect, useState } from "react";

export function TickerText({
  text,
  showDot,
  delayBy,
}: {
  text: string;
  showDot?: boolean;
  delayBy?: number; // number of ticks to wait
}) {
  const [pos, setPos] = useState(0);

  useEffect(() => {
    let _delayBy = delayBy || 0;
    let _pos = 0;
    let timeoutID: NodeJS.Timeout;
    const tick = () => {
      if (_delayBy > 0 || _pos <= text.length) {
        if (_delayBy > 0) {
          _delayBy -= 3;
        } else {
          setPos((_pos += 3));
        }
        timeoutID = setTimeout(tick, 35);
      } else {
        clearTimeout(timeoutID);
      }
    };

    tick();

    return () => {
      clearTimeout(timeoutID);
    };
  }, [delayBy, text, setPos]);

  let dot = "";
  if (showDot && pos < text.length) {
    dot = "●";
  }
  return <>{text.substring(0, pos) + dot}</>;
}
