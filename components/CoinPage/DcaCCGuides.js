import { Card } from "@tremor/react";
import ReactMarkdown from "react-markdown";

const DcaCCGuides = ({ content }) => {
  return (
    <Card>
      <div className="mt-4 prose prose-sm max-w-none">
        <ReactMarkdown>{content.body}</ReactMarkdown>
      </div>
    </Card>
  );
};

export default DcaCCGuides;
