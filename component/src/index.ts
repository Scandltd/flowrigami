import Flowrigami from '@app/Flowrigami';


declare global {
  interface Window {
    Flowrigami: object;
  }
}

(function(window: Window) {
  window.Flowrigami = Flowrigami;
})(window);
