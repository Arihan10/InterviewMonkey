import json
from openai import OpenAI

class Gpt:
    def __init__(self, client: OpenAI):
        self.client = client
    
    def score(self, company, position, summary, question, response):
        prompt = f"""
        The following is a summary for how {company} expects candidates for the {position} role to behave during an interview:

        "{summary}"

        You will include specific expectations within the summary for the type of responses expected by the company, including references (if available) to specific requirements for technologies, character traits, etc.

        Given an interview question and a candidate's response to it, you will grade the response based on its strength and the above criteria on a scale of 1-100. Your output will ONLY be a single integer, ranging from 1-100. 

        Keep in mind that the candidate's response is imperfect due to being parsed from audio via Text-to-Speech.
        """

        user_prompt = f"""
        QUESTION: {question}
        RESPONSE: {response}
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

        # DEBUG
        # print(completion)
        # with open("openai_response.txt", "w") as f:
        #     f.write(completion)

        return completion

    def gen_questions(self, company, position, n, all_contents):
        prompt = """
        Given a text dump of a composite of the five top sites for providing information for interviewing at a COMPANY for a ROLE, you will generate a list of N interview questions tailored to the company role based on the provided text information, and generate a specific summary of the type of responses and behaviour the company expects from the candidate during the interview. 

        You will provide a response in the following JSON format:

        {
            "summary": "[summary]",
            "questions": [
                "Generic example: Why do you want to work at Microsoft?",
                "Generic example: When did you start programming?",
                ...
            ]
        }

        Provide only the above JSON and nothing else.
        """

        user_prompt = f"""
        COMPANY: {company}
        ROLE: {position}
        TEXT DUMP: {all_contents}
        N: {n}
        """

        # DEBUG
        # print("User prompt: ", user_prompt)

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

        completion = completion.strip().lstrip("```json").rstrip("```")

        # DEBUG

        # print(completion)
        # with open("openai_response.txt", "w") as f:
        #     f.write(completion)

        return json.loads(completion)

    def feedback(self, company, position, summary, question, self_response, self_score, other_responses, other_scores):
        prompt = f"""
        The following is a summary for how {company} expects candidates for the {position} role to behave during an interview:

        "{summary}"

        You will include specific expectations within the summary for the type of responses expected by the company, including references (if available) to specific requirements for technologies, character traits, etc.

        Given the interview question, the user's response to the question, the user's score, a list of other people's responses and their corresponding responses, you will give feedback to the user for how they can improve on answering this question. Please reference other people's response when possible.

        Keep in mind that the candidate's response is imperfect due to being parsed from audio via Text-to-Speech.
        """

        construct_str = ""

        for i, response in enumerate(other_responses):
            construct_str += f"""
            OTHER RESPONSE {i+1}: {response}
            OTHER SCORE {i+1}: {other_scores[i]}
            """
        
        print("construct str", construct_str)

        user_prompt = f"""
        QUESTION: {question}
        USER RESPONSE: {self_response}
        USER SCORE: {self_score}

        {construct_str}
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

        return completion
