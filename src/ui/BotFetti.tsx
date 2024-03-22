import { useEffect } from 'react';

export function BotFetti({ score }: { score: number }) {
  useEffect(() => {
    const fetti = document.createElement('div');
    fetti.style.top = '0';
    fetti.style.right = '0';
    fetti.style.bottom = '0';
    fetti.style.left = '0';
    fetti.style.overflow = 'hidden';
    fetti.style.position = 'fixed';
    fetti.style.pointerEvents = 'none';
    document.body.appendChild(fetti);

    const fettiInner = document.createElement('div');
    fettiInner.style.position = 'absolute';
    fettiInner.style.top = '0';
    fettiInner.style.left = '0';
    fettiInner.style.right = '0';
    fetti.appendChild(fettiInner);

    for (let i = 0; i < 100; i++) {
      const emoji = document.createElement('span');
      if (i < score) {
        emoji.innerText = ['🤖', '👤', '✅'][Math.floor(Math.random() * 3)];
      } else {
        emoji.innerText = '❌';
      }
      emoji.style.top = -Math.round(Math.random() * 1000) + 'px';
      emoji.style.left = Math.random() * 100 + '%';
      emoji.style.position = 'absolute';
      emoji.style.opacity = (Math.random() * 0.5 + 0.5).toString();

      fettiInner.appendChild(emoji);
    }
    let dist = 0;
    const gravity = 0.1;
    let velo = 0.2;
    const interval = setInterval(() => {
      velo += gravity;
      dist += velo;
      fettiInner.style.top = dist + 'px';
      if (dist > window.innerHeight + 2000) {
        document.body.removeChild(fetti);
        clearInterval(interval);
      }
    }, 18);
  }, [score]);
  return <></>;
}
