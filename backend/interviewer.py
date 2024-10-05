from openai import OpenAI
from camera import read_frame

class Interviewer:
    def __init__(self, client: OpenAI):
        self.client = client
    
    def score_frame(self, frame):
        #do something with read_frame
        read_frame(frame)

