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

    async def run(self):
        print("running")
        
        while (True):
            message_data, room = await self.asyncQueue.get()

            # parse message
            client_id = message_data.get("client_id")
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