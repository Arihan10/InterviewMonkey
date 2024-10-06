import os
from openai import OpenAI

import cv2
import numpy as np

from scraper import Scraper
from gpt import Gpt
from camera import check_posture

import asyncio

from dotenv import load_dotenv
load_dotenv()

class Server:
    def __init__(self, asyncQueue: asyncio.Queue):
        self.asyncQueue = asyncQueue

        self.client = OpenAI(
            api_key = os.environ.get("OPENAI_API_KEY"),
            #organization = os.environ.get("OPENAI_ORGANIZATION")
        )

        self.scraper = Scraper()
        self.gpt = Gpt(self.client)

    def set_manager(self, manager):
        self.manager = manager

    def get_contents(self, company, position):
        return self.scraper.get_contents(company, position)
    
    def gen_questions(self, company, position, n, all_contents):
        return self.gpt.gen_questions(company, position, n, all_contents)

    async def run(self):
        print("running")
        
        while (True):
            message_data, room = await self.asyncQueue.get()

            if message_data is None:
                continue

            # print("message_data", message_data, room)

            # parse message
            client_id = message_data.get("client_id")
            message = message_data.get("message")
            type = message_data.get("type")

            json_message = {
                "client_id": client_id,
                "type": type,
                "message": message,
            }

            # HAVE TYPE STUFF HERE
            if (type == "answer"):
                # handle
                pass
            elif (type == "frame"):
                # print("hi")
                frame = cv2.imdecode(np.frombuffer(message, np.uint8), cv2.IMREAD_COLOR)
                score = check_posture(frame)
                broadcast_message = f"Posture {score[0]} {score[1]}"
                # print("Posture score", score)
                #await self.manager.send_message(broadcast_message, room)
            else:
                print("TYPE IS " + type)
                await self.manager.send_message(json_message, room)

            # print(message)

            # Format the broadcast message with client ID
            # broadcast_message = f"Client {client_id} says: {message}"
            # await self.manager.send_message(broadcast_message, room)