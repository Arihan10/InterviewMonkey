from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio

from server import Server

app = FastAPI()

asyncQueue = asyncio.Queue()

# CORS middleware to allow React app to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Manage rooms and connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict = {}

    async def connect(self, websocket: WebSocket, room: str):
        await websocket.accept()
        if room not in self.active_connections:
            self.active_connections[room] = []
        self.active_connections[room].append(websocket)

    def disconnect(self, websocket: WebSocket, room: str):
        if room in self.active_connections:
            self.active_connections[room].remove(websocket)
            if not self.active_connections[room]:
                del self.active_connections[room]

    async def send_message(self, message: str, room: str):
        if room in self.active_connections:
            for connection in self.active_connections[room]:
                json_message = json.dumps(message)
                await connection.send_text(json_message)

manager = ConnectionManager()

@app.websocket("/ws/{room}")
async def websocket_endpoint(websocket: WebSocket, room: str):
    await manager.connect(websocket, room)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            print(message_data)

            await asyncQueue.put((message_data, room))
    except WebSocketDisconnect:
        manager.disconnect(websocket, room)

server = Server(asyncQueue=asyncQueue, manager=manager)

async def startup_event():
    asyncio.create_task(server.run())

app.add_event_handler("startup", startup_event)