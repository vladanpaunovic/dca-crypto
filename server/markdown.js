import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

export const getParsedFileContentBySlug = (slug, postsPath) => {
  const postFilePath = join(
    process.cwd(),
    postsPath,
    `${slug}.md`
  );
  const fileContents = fs.readFileSync(postFilePath);

  const { data, content } = matter(fileContents);

  return {
    frontMatter: data,
    content,
  };
};
