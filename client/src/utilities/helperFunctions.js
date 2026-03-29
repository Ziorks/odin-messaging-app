export function isOnline(lastActive) {
  return new Date(lastActive) > Date.now() - 1000 * 60 * 2;
}
