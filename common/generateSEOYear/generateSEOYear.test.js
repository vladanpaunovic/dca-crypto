import generateSEOYear from "./generateSEOYear";
import MockDate from "mockdate";

const cases = [
  ["2022-01-01", "2022"],
  ["2023-01-01", "2023"],
  ["2022-11-15", "2023"],
  ["2022-12-01", "2023"],
  ["2021-11-01", "2021"],
  ["2021-11-12", "2022"],
];

test.each(cases)("when date is %s return year %s", (currentDate, expected) => {
  MockDate.set(currentDate);

  expect(generateSEOYear()).toBe(expected);

  MockDate.reset();
});
