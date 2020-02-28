import Flowrigami from '@app/Flowrigami';
import '@app/normalize.css';
import '@app/flowrigami.css';


declare global {
  interface Window {
    Flowrigami: object;
  }
}

(function(window: Window) {
  window.Flowrigami = Flowrigami;
})(window);
