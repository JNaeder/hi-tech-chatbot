import uvicorn
import ollama
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)


class ChatRequest(BaseModel):
    conversation: list


@app.get("/")
def test():
    return {"Hello": "World"}


@app.post("/chat")
def chat(chatRequest: ChatRequest):
    response = ollama.chat(model="llama3", messages=chatRequest.conversation, stream=True)

    async def generate():
        for chunk in response.iter_content(chunk_size=1024):
            if chunk:
                yield chunk

    return StreamingResponse(generate(), media_type="application/octet-stream")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
