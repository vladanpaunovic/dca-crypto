import fs from "fs";
import matter from "gray-matter";
import path from "path";

const postsDirectory = path.join(process.cwd(), "content", "blog");

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const contents = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...contents.data,
    };
  });

  // Sort posts by date
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export function getPostById(postId) {
  const fullPath = path.join(postsDirectory, "../", `${postId}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const contents = matter(fileContents);

  return {
    id: postId,
    ...contents.data,
    content: contents.content,
  };
}
