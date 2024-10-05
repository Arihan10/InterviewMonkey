from openai import OpenAI
from camera import read_frame

class Interviewer:
    def __init__(self, client: OpenAI):
        self.client = client

    

