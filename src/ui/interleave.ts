const interleave = <T>(arr: Array<T>, intermediateValue: T): Array<T> =>
  ([] as Array<T>)
    .concat(...arr.map((n) => [n, intermediateValue]))
    .slice(0, -1);

export default interleave;
