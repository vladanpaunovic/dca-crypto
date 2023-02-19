import dayjs from "dayjs";

/**
 * @returns {string} the SEO friendly year
 */
const generateSEOYear = () => {
  return dayjs().add("50", "day").format("YYYY");
};

export default generateSEOYear;
