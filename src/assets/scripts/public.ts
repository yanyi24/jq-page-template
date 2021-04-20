import '../styles/public.scss';


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => {
        console.log('sw注册成功~');
      })
      .catch(() => {
        console.error('sw注册失败~');
      })
  })
}
