import ReactMarkdown from "react-markdown";

const markdownConfig = {
  h1: ({ node, ...props }) => (
    <h2
      className="leading-10 dark:text-gray-100 font-bold text-2xl my-4"
      {...props}
    />
  ),
  h2: ({ node, ...props }) => (
    <h2
      className="leading-10 dark:text-gray-100 font-bold text-xl text-gray-800 mt-8"
      {...props}
    />
  ),
  p: ({ node, ...props }) => (
    <p
      className="my-2 text-gray-600 dark:text-gray-300 font-medium"
      {...props}
    />
  ),
  ul: ({ node, ...props }) => (
    <ul className="my-2 font-medium list-disc pl-4" {...props} />
  ),
  li: ({ node, ...props }) => (
    <li className="text-gray-300 dark:text-gray-600" {...props}>
      <div className="text-gray-600 dark:text-gray-300" {...props} />
    </li>
  ),
};

const Content = ({ content }) => {
  return (
    <div>
      <ReactMarkdown components={markdownConfig}>{content.post}</ReactMarkdown>
    </div>
  );
};

export default Content;
