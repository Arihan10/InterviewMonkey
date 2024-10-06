import os
import re
import urllib
import json

from bs4 import BeautifulSoup, Comment
from typing import List, Tuple
from openai import OpenAI
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import StaleElementReferenceException
from selenium.webdriver.chrome.service import Service

from gpt import Gpt

from dotenv import load_dotenv
load_dotenv()


class Scraper:
    def __init__(self):
        options = Options()
        options.add_argument('--headless=new')
        options.add_argument("--window-size=1,1")

        chrome_driver_path = os.environ.get("CHROME_DRIVER_PATH")

        service = Service(executable_path=chrome_driver_path)

        self.driver = webdriver.Chrome(options=options, service=service)

        # self.driver = webdriver.Chrome(options=options)

    def get_contents(self, company, position) -> List[str]:
        """
        Scrape top 5 sites that provide interview questions
        """
        search_url = f"{company} {position} interview questions"
        print("GETTING CONTENTS")
        self.driver.get(f"https://www.google.com/search?q={urllib.parse.quote_plus(search_url)}")
        print("DRIVER GET SUCCESSFUL")

        html_contents: List[Tuple[str, str, str]] = []
        try:
            search = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.ID, "search"))
            )

            print("Found search", search)

            # Somehow doesn't work???

            # results = WebDriverWait(self.driver, 10).until(
            #     EC.visibility_of_all_elements_located((By.XPATH, '(//h3)[position() <= 5]'))
            # )

            results = self.driver.find_elements(By.XPATH, '(//h3)[position() <= 5]')

            links: List[Tuple[str, str]] = []
            for result in results:
                try:
                    first_result_link = result.find_element(By.XPATH, '..').get_attribute('href')
                    print("Result Title: ", result.text)
                    print("Result URL: ", first_result_link)
                    links.append((result.text, first_result_link))
                except StaleElementReferenceException as exc:
                    print("Encountered a stale element while fetching links!")
                    raise exc
            
            for txt, link in links:
                if isinstance(link, str) and link:
                    self.driver.get(link)

                    WebDriverWait(self.driver, 10).until(
                        EC.visibility_of_element_located((By.XPATH, '//body'))
                    )
                    
                    html_content = self.driver.page_source
                    html_contents.append((txt, link, html_content))
                else:
                    print(f"Invalid URL: {link}")
        finally:
            pass

        final_output_contents = []

        for txt, link, html_content in html_contents:
            soup = BeautifulSoup(html_content, 'html.parser')

            for script in soup(['script', 'style']):
                script.decompose()

            for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
                comment.extract()

            for tag in soup.find_all(True):
                tag.unwrap()

            cleaned_content = str(soup)

            filtered_content = []
            for line in cleaned_content.splitlines(keepends=True):
                filtered_content.append(line)

            final_content = ''.join(filtered_content)
            final_content = re.sub(r'\n+', '\n', final_content)

            if not final_content:
                print(f'No relevant content found for {txt}.')
                final_content = 'No relevant interview-related content found.'

            output_dir = 'output'
            os.makedirs(output_dir, exist_ok=True)

            # with open(os.path.join(output_dir, f'{txt}.txt'), 'w') as f:
            #     f.write(link + "\n")
            #     f.write(final_content)

            print(f'Cleaned content saved to {os.path.join(output_dir, f"{txt}.txt")}')

            final_output_contents.append(final_content)

        # self.driver.quit()

        return final_output_contents

if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()

    company = "shopify"
    position = "qa"

    n = 5

    client = OpenAI(
        api_key = os.environ.get("OPENAI_API_KEY"),
        # organization = os.environ.get("OPENAI_ORGANIZATION")
    )

    scraper = Scraper()
    
    all_contents = scraper.get_contents(company, position)

    gpt = Gpt(client)

    output = gpt.gen_questions(company, position, n, '\n\n'.join(all_contents))

    print("JSON output:\n", output)
    print(len(output["questions"]))


    # interviewer pipeline

    question = output["questions"][0]

    response = input(question)

    score = gpt.score(company, position, output["summary"], question, response)

    print("Score:", score)


