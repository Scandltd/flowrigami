const K = 1000; // Thousand
const M = 1000000; // Million
const B = 1000000000; // Billion
const T = 1000000000000; // Trillion
const Qa = 1000000000000000; // Quadrillion
const Qi = 1000000000000000000; // Quintillion

export function shortenNumber(num: number) {
  let result;
  let suffix = '';
  if (num < K) {
    result = num;
  } else if (num < M) {
    result = shorten(num, K);
    suffix = 'K';
  } else if (num < B) {
    result = shorten(num, M);
    suffix = 'M';
  } else if (num < T) {
    result = shorten(num, B);
    suffix = 'B';
  } else if (num < Qa) {
    result = shorten(num, T);
    suffix = 'T';
  } else if (num < Qi) {
    result = shorten(num, Qa);
    suffix = 'Qa';
  } else {
    result = shorten(num, Qi);
    suffix = 'Qi';
  }
  return result + suffix;
}

// always display 3 digits, e.g. 150, 1.50k, 15.0k, 150k and etc.
function shorten(num: number, divider: number) {
  const digits = Math.floor(num).toString().length; // length of integer part of the num
  return (num / divider).toFixed(digits % 3 ? (3 - digits % 3) : 0);
}
