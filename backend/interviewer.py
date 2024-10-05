from openai import OpenAI

class Interviewer:
    def __init__(self, client: OpenAI):
        self.client = client

    