window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('https://raw.githubusercontent.com/pravinga513/PG513/main/sw.js');
  }
}
