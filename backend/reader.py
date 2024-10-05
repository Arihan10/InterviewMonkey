from openai import OpenAI

class Reader:
    def __init__(self, client: OpenAI):
        self.client = client
