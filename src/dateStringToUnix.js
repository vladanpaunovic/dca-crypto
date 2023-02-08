export default function convertDateStringToUnix(dateString) {
  return new Date(dateString).getTime() / 1000;
}
