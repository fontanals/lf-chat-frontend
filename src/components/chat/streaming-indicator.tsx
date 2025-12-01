import { Box } from "@mui/material";
import { keyframes } from "@mui/system";

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

export default function StreamingIndicator() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
      }}
      data-testid="streaming-indicator"
    >
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "text.primary",
            animation: `${bounce} 1.4s infinite ease-in-out both`,
            animationDelay: `${index * 0.2}s`,
          }}
        />
      ))}
    </Box>
  );
}
