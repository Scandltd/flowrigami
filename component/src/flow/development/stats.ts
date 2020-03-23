// @stats()
// public draw()
export function stats() {
  if (process.env.NODE_ENV !== 'development') return () => {};

  let beforeCall = () => {};
  let afterCall = () => {};

  import('stats.js').then(({ default: Stats }) => {
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    beforeCall = stats.begin;
    afterCall = stats.end;
  });

  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function() {
      beforeCall();
      originalMethod.apply(this, arguments);
      afterCall();
    };
  };
}
