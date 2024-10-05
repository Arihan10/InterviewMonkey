import os
import re
import urllib

from bs4 import BeautifulSoup, Comment
from typing import List, Tuple
from openai import OpenAI
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException


class Scraper:
    def __init__(self, client):
        self.client = client
        self.driver = webdriver.Chrome()

    def get_contents(self, company, position) -> List[str]:
        """
        Scrape top 5 sites that provide interview questions
        """
        search_url = f"{company} {position} interview questions"
        self.driver.get(f"https://www.google.com/search?q={urllib.parse.quote_plus(search_url)}")

        html_contents: List[Tuple[str, str, str]] = []
        try:
            results = WebDriverWait(self.driver, 10).until(
                EC.visibility_of_all_elements_located((By.XPATH, '(//h3)[position() <= 5]'))
            )

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

            with open(os.path.join(output_dir, f'{txt}.txt'), 'w') as f:
                f.write(link + "\n")
                f.write(final_content)

            print(f'Cleaned content saved to {os.path.join(output_dir, f"{txt}.txt")}')

            final_output_contents.append(final_content)

        self.driver.quit()

        return final_output_contents
    
    def gen_questions(self, company, position, n, all_contents):
        prompt = """
        Given a text dump of a composite of the five top sites for providing information for interviewing at a COMPANY for a ROLE, generate a list of N interview questions tailored to the company role based on the provided text information in the following format:

        {
            "questions": [
                1: "Generic example: Why do you want to work at Microsoft?",
                2: "Generic example: When did you start programming?",
                ...
            ]
        }

        Provide only the above JSON and nothing else.
        """

        user_prompt = f"""
        COMPANY: {company}
        ROLE: {position}
        TEXT DUMP: {all_contents[0]}
        """

        response = self.client.chat.completions.create(
            messages=[{
                "role": "system",
                "content": prompt
            }, {
                "role": "user",
                "content": user_prompt
            }],
            model="gpt-4o-mini"
        )

        completion = response.choices[0].message.content
        print(completion)
        with open("openai_response.txt", "w") as f:
            f.write(completion)


if __name__ == "__main__":
    from dotenv import load_dotenv

    load_dotenv()
    driver = webdriver.Chrome()

    company = "shopify"
    position = "software engineering"

    client = OpenAI(
        api_key = os.environ.get("OPENAI_API_KEY"),
        organization = os.environ.get("OPENAI_ORGANIZATION")
    )

    scraper = Scraper(client)
    
    all_contents = scraper.get_contents(company, position)

    print("ALL CONTENTS: ", all_contents)

    print("\n\n\nFirst one\n\n\n", all_contents[0], '\nlength', len(all_contents[0]))

    n = 5

    scraper.gen_questions(company, position, n, all_contents[0])

