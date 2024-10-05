import os
from openai import OpenAI
from random import randint

from scraper import Scraper
from gpt import Gpt
from interviewer import Interviewer

import asyncio

from dotenv import load_dotenv
load_dotenv()

class Server:
    def __init__(self, asyncQueue: asyncio.Queue):
        self.asyncQueue = asyncQueue

        self.client = OpenAI(
            api_key = os.environ.get("OPENAI_API_KEY"),
            organization = os.environ.get("OPENAI_ORGANIZATION")
        )

        self.scraper = Scraper()
        self.gpt = Gpt(self.client)
        self.interviewer = Interviewer(self.client)

        self.rooms = {}

    def set_manager(self, manager):
        self.manager = manager

    # room structure:
    """
    {
        room: str (id)
        clients: list of (client id, client name)
        company: str
        position: str
        room_name: str
        max_people: int
        max_questions: int
    }
    """
    async def open_room(self, room, company, position, room_name, name, max_people, max_questions):
        self.rooms[room] = {
            "room": room,
            "clients": set(),
            "company": company,
            "position": position,
            "room_name": room_name,
            "max_people": max_people,
            "max_questions": max_questions
        }
        return await self.join_room(room, name)

    async def join_room(self, room, name):
        client_id = randint(0, 100000)
        while client_id in self.rooms[room]["clients"]:
            client_id = randint(0, 100000)
        self.rooms[room]["clients"].append((client_id, name))
        return client_id

    async def get_room(self, room):
        # modify data so that the entire room data isnt sent but just what the user needs to see
        return self.rooms.get(room)

    async def close_room(self, room):
        del self.rooms

    async def run(self):
        print("running")
        
        while (True):
            message_data, room = await self.asyncQueue.get()

            # parse message
            message = message_data.get("message")
            type = message_data.get("type")

            # HAVE TYPE STUFF HERE
            if (type == "message"):
                json_message = {
                    "client_id": client_id,
                    "type": type,
                    "message": message,
                }
                 
                await self.manager.send_message(json_message, room)
            elif (type == "answer"):
                # handle
                pass

            # print(message)

            # Format the broadcast message with client ID
            # broadcast_message = f"Client {client_id} says: {message}"
            # await self.manager.send_message(broadcast_message, room)