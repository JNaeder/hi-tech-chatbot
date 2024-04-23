import { Box, Typography, TextField, Button } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import ollama from "ollama/browser";
import Logo from "./imgs/Hi_Tech_Screen_White.png";

export default function HomePage() {
  const boxRef = useRef(null);
  const [message, setMessage] = useState("");
  const [chatReponse, setChatResponse] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isReplying, setIsReplying] = useState(false);

  const submit = async () => {
    const new_message = {
      role: "user",
      content: message,
    };
    setConversation((prevData) => [...prevData, new_message]);
    setIsReplying(true);
    setMessage("");
  };

  useEffect(() => {
    // Scroll to the bottom when content changes
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [conversation, chatReponse]);

  useEffect(() => {
    const getResponse = async () => {
      let reply = "";
      const response = await ollama.chat({
        model: "llama3",
        stream: true,
        messages: conversation,
      });
      for await (const part of response) {
        reply += part.message.content;
        setChatResponse((prevData) => prevData + part.message.content);
      }
      const new_assistant_message = {
        role: "assistant",
        content: reply,
      };
      setConversation((prevData) => [...prevData, new_assistant_message]);
      setChatResponse("");
    };
    if (isReplying) {
      getResponse();
      setIsReplying(false);
    }
  }, [conversation]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        gap: 2,
        backgroundColor: "#00ABD2",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
          backgroundColor: "#00ABD2",
        }}
      >
        <img src={Logo} alt="Logo" width={50} />

        <Typography variant="h4" color="white">
          Hi! Tech Chat
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: 10,
          width: "50%",
        }}
      >
        <Box
          ref={boxRef}
          sx={{
            overflowY: "scroll",
            backgroundColor: "white",
            borderRadius: 2,
            height: "68vh",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#888",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#555",
            },
          }}
        >
          {conversation.map((message, index) => {
            return <MessageBubble key={index} message={message} />;
          })}
          {chatReponse !== "" && (
            <MessageBubble
              message={{
                role: "assistant",
                content: chatReponse,
              }}
            />
          )}
        </Box>
        <TextField
          multiline
          maxRows={4}
          value={message}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              backgroundColor: "white",
            },
          }}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <Button variant="contained" onClick={submit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
}
