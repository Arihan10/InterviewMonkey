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

        self.scraper = Scraper()
        self.reader = Reader(self.client)
        self.interviewer = Interviewer(self.client)

