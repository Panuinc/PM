export function getLocalNow() {
  const offsetMs = 7 * 60 * 60 * 1000;
  const now = new Date();
  const local = new Date(now.getTime() + offsetMs);
  local.setMilliseconds(0);
  return local;
}
