import { Box, Typography, Avatar } from "@mui/material";

export default function MessageBubble({ message }) {
  const { role, content } = message;
  return (
    <>
      <Box
        sx={{
          //   backgroundColor: "green",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          padding: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar
            sx={{
              width: 30,
              height: 30,
            }}
          />
          <Typography variant="paragraph">{role}</Typography>
        </Box>
        <Typography variant="paragraph">{content}</Typography>
      </Box>
    </>
  );
}
