import { Box, TextField, Button } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import ollama from "ollama/browser";
import Logo from "./imgs/Hi_Tech_Screen_White.png";

export default function HomePage() {
  const boxRef = useRef(null);
  const [message, setMessage] = useState("");
  const [chatReponse, setChatResponse] = useState("");
  const [conversation, setConversation] = useState([
    {
      role: "system",
      content:
        "You are named Hi! Tech Helper. You want to assist the Hi! Tech team with IT support in a friendly way.",
    },
  ]);
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

  const keyboardCheck = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [conversation, chatReponse]);

  useEffect(() => {
    const getResponse = async () => {
      let reply = "";
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversation: conversation }),
      });
      const reader = response.body.getReader();

      const processStream = async (reader) => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          const newvalue = new TextDecoder("utf-8").decode(value);
          console.log(newvalue);
          // reply += new TextDecoder("utf-8").decode(value);
          // console.log(reply);
          // setChatResponse((prevData) => prevData + reply);
        }
      };

      processStream(reader);

      // const response = await ollama.chat({
      //   model: "llama3",
      //   stream: true,
      //   messages: conversation,
      // });
      // for await (const part of response) {
      //   reply += part.message.content;
      //   setChatResponse((prevData) => prevData + part.message.content);
      // }
      // const new_assistant_message = {
      //   role: "assistant",
      //   content: reply,
      // };
      // setConversation((prevData) => [...prevData, new_assistant_message]);
      // setChatResponse("");
      setIsReplying(false);
    };
    if (isReplying) {
      getResponse();
    }
  }, [conversation, isReplying]);

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
          justifyContent: "center",
          // gap: 2,
          marginTop: 2,
          height: "10vh",
          width: "80%",
          // backgroundColor: "green",
        }}
      >
        <img src={Logo} alt="Logo" width={50} />

        {/* <Typography variant="h4" color="white">
          Chat
        </Typography> */}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "80%",
          height: "100%",
          paddingBottom: 2,
        }}
      >
        <Box
          ref={boxRef}
          sx={{
            overflowY: "scroll",
            backgroundColor: "white",
            height: "70vh",
            borderRadius: "10px",
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
            if (message.role === "system") return null;
            return <MessageBubble key={index} message={message} />;
          })}
          {isReplying && (
            <MessageBubble
              message={{
                role: "assistant",
                content: chatReponse,
              }}
            />
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            // backgroundColor: "red",
            height: "15vh",
          }}
        >
          <TextField
            disabled={isReplying}
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
            onKeyDown={keyboardCheck}
          />
          <Button variant="contained" onClick={submit} fullWidth>
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
