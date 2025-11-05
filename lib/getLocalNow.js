export function getLocalNow() {
  const now = new Date();
  const utc = now.getTime();
  const thTime = new Date(utc + 7 * 60 * 60 * 1000);
  thTime.setMilliseconds(0);
  return thTime;
}
