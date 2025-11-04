import { Box, useTheme } from "@mui/material";
import "highlight.js/styles/github-dark.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export function MarkdownRenderer({ content }: { content: string }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        color: theme.palette.text.primary,
        fontSize: "14px",
        "& a": {
          color: theme.palette.secondary.main,
          "&:hover": {
            textDecoration: "underline",
            textUnderlineOffset: "2px",
          },
        },
        "& :not(pre) > code": {
          backgroundColor: theme.palette.background.default,
          borderRadius: "4px",
        },
        "& pre": {
          padding: "6px 8px",
          backgroundColor: theme.palette.background.default,
          borderRadius: "8px",
        },
        "& pre code": {
          color: "inherit",
          backgroundColor: "transparent !important",
          padding: "0px !important",
        },
        "& table": {
          borderCollapse: "collapse",
        },
        "& th, & td": {
          padding: "6px 8px",
          border: `1px solid ${theme.palette.text.primary}`,
        },
        "& blockquote": {
          margin: "0px",
          padding: "6px 8px",
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.default,
          borderLeft: `4px solid ${theme.palette.text.primary}`,
          borderRadius: "8px",
        },
        "& img": {
          maxWidth: "100%",
        },
        "& input[type='checkbox']": {
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          width: "16px",
          height: "16px",
          border: `2px solid ${theme.palette.text.primary}`,
          borderRadius: "4px",
          verticalAlign: "middle",
          "&:checked": {
            backgroundColor: theme.palette.secondary.main,
            borderColor: theme.palette.secondary.main,
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path fill='white' d='M6.173 12.073L2.4 8.3l1.4-1.4 2.373 2.373 5.426-5.426 1.4 1.4z'/></svg>\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "16px 16px",
          },
        },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}
