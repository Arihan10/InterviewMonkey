from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse

from server import Server

app = FastAPI()

server = Server()

@app.get("/")
async def root():
    return {
        
    }