from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
from typing import List

import os

from server import Server

from pydantic import BaseModel

app = FastAPI()

asyncQueue = asyncio.Queue()

server = Server(asyncQueue=asyncQueue)

# CORS middleware to allow React app to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React app origin
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

async def recv_txt(websocket: WebSocket, room: str):
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            print(message_data)

            await asyncQueue.put((message_data, room))
    except WebSocketDisconnect:
        manager.disconnect(websocket, room)

async def recv_bin(websocket: WebSocket, room: str):
    try:
        while True:
            binary_data = await websocket.receive_bytes()
            print(f"Received binary data of length {len(binary_data)}")

            with open("received_image.png", "wb") as f:
                f.write(binary_data)

            print(f"Image saved at: {"received_image.png"}")
    except WebSocketDisconnect:
        manager.disconnect(websocket, room)


@app.websocket("/ws/{room}")
async def websocket_endpoint(websocket: WebSocket, room: str):
    await manager.connect(websocket, room)

    try:
        while True:
            message = await websocket.receive()
            if message["type"] == "websocket.receive":
                if "bytes" in message:
                    binary_data = await websocket.receive_bytes()
                    # print(f"Received binary data of length {len(binary_data)}")

                    with open("received_image.png", "wb") as f:
                        f.write(binary_data)

                elif "text" in message:
                    text_data = message["text"]
                    print(f"Received text data: {text_data}")
                    await manager.send_message("Text received", websocket)

    except WebSocketDisconnect:
        manager.disconnect(websocket, room)
        print("Client disconnected.")
    # try:
    #     while True:
    #         data = await websocket.receive_text()
    #         message_data = json.loads(data)

    #         print(message_data)

    #         await asyncQueue.put((message_data, room))
    # except WebSocketDisconnect:
    #     manager.disconnect(room)

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

class QuestionItem(BaseModel):
    company: str
    position: str
    n: int

@app.post("/questions")
async def questions(item: QuestionItem):

    print("Getting all contents")
    all_contents = server.get_contents(item.company, item.position)

    print("All contents fetched")

    output = server.gen_questions(item.company, item.position, item.n, '\n\n'.join(all_contents))

    print("Got output", output)

    # json return
    return output

class GradeItem(BaseModel):
    company: str
    position: str
    summary: str
    question: str
    response: str

@app.post("/grade")
async def grade(item: GradeItem):
    output = server.gpt.score(item.company, item.position, item.summary, item.question, item.response)

    # score is a string
    return output

server.set_manager(manager)

async def startup_event():
    asyncio.create_task(server.run())

app.add_event_handler("startup", startup_event)