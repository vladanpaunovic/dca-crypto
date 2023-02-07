import ReactMarkdown from "react-markdown";

const DcaCCGuides = ({ content }) => {
  return (
    <div>
      <div className="mt-4 prose prose-sm max-w-none">
        <ReactMarkdown>{content.body}</ReactMarkdown>
      </div>
    </div>
  );
};

export default DcaCCGuides;
