export type Dispatcher<Args extends unknown[] = []> = ReturnType<
  typeof createDispatcher<Args>
>;
export function createDispatcher<Args extends unknown[] = []>() {
  type Handler = (...args: Args) => void;
  const handlers: Handler[] = [];

  function unsubscribe(handler: Handler) {
    const index = handlers.indexOf(handler);
    if (index !== -1) handlers.splice(index, 1);
  }

  return {
    subscribe(handler: Handler) {
      handlers.push(handler);
      return () => unsubscribe(handler);
    },
    unsubscribe,
    dispatch(...args: Args) {
      handlers.forEach((handler) => handler(...args));
    },
  };
}
