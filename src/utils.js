export const convertDateStringToUnix = (dateString) =>
  new Date(dateString).getTime() / 1000;
