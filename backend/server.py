import os
from openai import OpenAI

# from scraper import Scraper
# from reader import Reader
# from interviewer import Interviewer

import asyncio


class Server:
    def __init__(self, asyncQueue: asyncio.Queue, manager):
        self.asyncQueue = asyncQueue
        self.manager = manager

        # self.client = OpenAI(
        #     api_key = os.environ.get("OPENAI_API_KEY"),
        #     organization = os.environ.get("OPENAI_ORGANIZATION")
        # )

        # self.scraper = Scraper()
        # self.reader = Reader(self.client)
        # self.interviewer = Interviewer(self.client)

    async def run(self):
        print("running")
        
        while (True):
            message_data, room = await self.asyncQueue.get()

            # parse message
            client_id = message_data.get("clientId")
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