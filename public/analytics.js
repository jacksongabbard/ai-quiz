const script = document.createElement('script');
script.setAttribute(
  'src',
  'https://www.googletagmanager.com/gtag/js?id=G-35034KK4D9',
);
script.setAttribute('async', true);
script.addEventListener('load', () => {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'G-35034KK4D9');
});
document.body.appendChild(script);
