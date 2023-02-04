import generateSEOYear from "../common/generateSEOYear/generateSEOYear";

export default function Head() {
  const title = `DCA Crypto | ${generateSEOYear()} %s`;
  return (
    <>
      <title>{title}</title>
      <meta
        name="description"
        content="Calculate your returns with dollar cost averaging or lump sum investing, the perfect tool for cryptocurrency investors."
      />
    </>
  );
}
