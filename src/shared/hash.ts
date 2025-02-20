export function hash() {
  let count = 0;

  return {
    create() {
      return ++count;
    },
  };
}
