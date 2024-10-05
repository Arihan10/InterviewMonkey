import os
import re
import urllib

from bs4 import BeautifulSoup, Comment
from typing import List, Tuple
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import StaleElementReferenceException

keywords = [
    'interview', 'question', 'role', 'experience', 'skills', 
    'challenge', 'situation', 'behavioral', 'technical', 'tell me about', 'describe a time'
]

class Scraper:
    def __init__(self):
        pass

if __name__ == "__main__":
    driver = webdriver.Chrome()

    company = "shopify"
    position = "software engineering"

    searchUrl = f"{company} {position} interview questions"

    driver.get(f"https://www.google.com/search?q={urllib.parse.quote_plus(searchUrl)}")

    html_contents: List[Tuple[str, str, str]] = []
    try:
        results = WebDriverWait(driver, 10).until(
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
                driver.get(link)

                WebDriverWait(driver, 10).until(
                    EC.visibility_of_element_located((By.XPATH, '//body'))
                )
                
                html_content = driver.page_source
                html_contents.append((txt, link, html_content))
            else:
                print(f"Invalid URL: {link}")
    finally:
        pass

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

    # do something with html_contents
    # feed into GPT-4o

    driver.quit()