import os
from openai import OpenAI

from scraper import Scraper
from reader import Reader
from interviewer import Interviewer

class Server:
    def __init__(self):
        self.client = OpenAI(
            api_key = os.environ.get("OPENAI_API_KEY"),
            organization = os.environ.get("OPENAI_ORGANIZATION")
        )

        self.scraper = Scraper(self.client)
        self.reader = Reader(self.client)
        self.interviewer = Interviewer(self.client)

if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()

    def run(self, message, room):
        pass
