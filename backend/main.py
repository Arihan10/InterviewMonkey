from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio

from server import Server

app = FastAPI()

asyncQueue = asyncio.Queue()

server = Server(asyncQueue=asyncQueue)

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

    async def connect(self, websocket: WebSocket, room: str, client_id: str):
        await websocket.accept()
        if room not in self.active_connections:
            self.active_connections[room] = {}
        self.active_connections[room].put(client_id, websocket)
        
    def disconnect(self, room: str, client_id: str):
        if room in self.active_connections:
            del self.active_connections[room][client_id]
            if not self.active_connections[room]:
                del self.active_connections[room]

    async def send_message(self, message: str, room: str, client_id: str):
        if room in self.active_connections:
            if client_id in self.active_connections[room]:
                await self.active_connections[room][client_id].send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{room}")
async def websocket_endpoint(websocket: WebSocket, room: str):
    await manager.connect(websocket, room)
    disconnect_id: str = None
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            disconnect_id = message_data.get("client_id")

            await asyncQueue.put((message_data, room))
    except WebSocketDisconnect:
        manager.disconnect(room, disconnect_id)

@app.post("/create/{room}")
async def create_room(room: str, company: str = "Shopify", room_name: str = "", name: str = "Guest", max_people: int = 2, max_questions: int = 5):
    client_id = await asyncio.create_task(server.open_room(room, company, room_name, name, max_people, max_questions))
    return {
        "room": await server.get_room(room),
        "client_id": client_id
        }

@app.get("/join/{room}")
async def join_room(room: str, name: str = "Guest"):
    client_id = await server.join_room(room, name)
    return {
        "room": await server.get_room(room),
        "client_id": client_id
        }


server.set_manager(manager)

async def startup_event():
    asyncio.create_task(server.run())

app.add_event_handler("startup", startup_event)