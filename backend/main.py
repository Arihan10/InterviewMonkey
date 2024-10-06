from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
from typing import List

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

    async def send_message(self, message: str, room: str, client_id: str = None):
        json_message = json.dumps(message)

        if room in self.active_connections:
            if client_id:
                if client_id in self.active_connections[room]:
                    await self.active_connections[room][client_id].send_test(json_message)
            else:
                for connection in self.active_connections[room]:
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
        manager.disconnect(room)

@app.post("/create/{room}")
async def create_room(room: str, company: str = "Shopify", position: str = "Software Engineer", room_name: str = "", name: str = "Guest", max_people: int = 2, max_questions: int = 5):
    client_id = await asyncio.create_task(server.open_room(room, company, position, room_name, name, max_people, max_questions))
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

@app.post("/questions")
async def questions(company: str, position: str, n: int):    
    all_contents = server.get_contents(company, position)

    output = server.gen_questions(company, position, n, '\n\n'.join(all_contents))

    # json return
    return output

@app.post("/grade")
async def grade(company: str, position: str, summary: str, question: str, response: str):

    score = server.gpt.score(company, position, summary, question, response)

    # score is a string
    return {score}

server.set_manager(manager)

async def startup_event():
    asyncio.create_task(server.run())

app.add_event_handler("startup", startup_event)