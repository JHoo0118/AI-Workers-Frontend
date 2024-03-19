"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
interface CodeProps {
  node?: any;
  inline?: any;
  className?: any;
  children?: any;
}
const markdownStyle = `max-w-full dark:prose-invert prose prose-ul:relative prose-stone prose-pre:my-0 prose-ul:leading-6 prose-p:leading-6 prose-ol:leading-4 prose-ul:my-0 prose-ol:my-0 prose-li:my-2 prose-h1:my-1 prose-h2:my-1 prose-h3:my-1 prose-p:my-1`;

const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <div className={markdownStyle}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                style={oneDark}
                language={match[1]}
                PreTag="div"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
