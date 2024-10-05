import os
from openai import OpenAI

from scraper import Scraper
from gpt import Gpt
from interviewer import Interviewer

import asyncio


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

    def open_room(self, room, company, room_name, name, max_people, max_questions):
        self.rooms[room] = {
            "room": room,
            "clients": [],
            "company": company,
            "room_name": room_name,
            "max_people": max_people,
            "max_questions": max_questions
        }
        self.join_room(room, name)

    def join_room(self, room, client):
        self.rooms[room]["clients"].append(client)

    def get_room(self, room):
        # modify data so that the entire room data isnt sent but just what the user needs to see
        return self.rooms.get(room)

    def close_room(self, room):
        del self.rooms

    async def run(self):
        print("running")
        
        while (True):
            message_data, room = await self.asyncQueue.get()

            # parse message
            client_id = message_data.get("clientId")
            message = message_data.get("message")

            print(message)

            # Format the broadcast message with client ID
            broadcast_message = f"Client {client_id} says: {message}"
            await self.manager.send_message(broadcast_message, room)