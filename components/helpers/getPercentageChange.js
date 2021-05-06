function getPercentageChange(oldNumber, newNumber) {
  var decreaseValue = newNumber - oldNumber;

  const output = (decreaseValue / oldNumber) * 100;
  return output.toFixed(2);
}

export default getPercentageChange;
