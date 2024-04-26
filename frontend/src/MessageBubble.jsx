import { Box, Typography, Avatar, CircularProgress } from "@mui/material";
import { MuiMarkdown } from "mui-markdown";
import Hi_Tech_Logo from "./imgs/Hi_Tech_Blue.png";

export default function MessageBubble({ message }) {
  const { role, content } = message;
  const name = role === "user" ? "You" : "Hi! Tech Helper";
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
          {content === "" ? (
            <CircularProgress size={30} />
          ) : (
            <Avatar
              src={role === "assistant" ? Hi_Tech_Logo : null}
              sx={{
                width: 30,
                height: 30,
              }}
            />
          )}
          <Typography variant="paragraph">
            <b>{name}</b>
          </Typography>
        </Box>
        <MuiMarkdown>{content}</MuiMarkdown>
      </Box>
    </>
  );
}
