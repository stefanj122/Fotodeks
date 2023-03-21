function micko(string = 'milos') {
  if (string.length < 2) {
    return 'its palindrome';
  } else {
    if (string.at(0) === string.at(-1)) {
      const string1 = string.slice(1, string.length - 1);
      return micko(string1);
    } else {
      return 'Not palindrome';
    }
  }
}
console.log(micko());

function reverse(str) {
  if (!str) return str;
  return str.at(-1) + reverse(str.slice(0, -1));
}
console.log(reverse('micko'));
