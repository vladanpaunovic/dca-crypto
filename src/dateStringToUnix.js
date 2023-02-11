export default function convertDateStringToUnix(dateString) {
  return Math.round(new Date(dateString).getTime() / 1000);
}
