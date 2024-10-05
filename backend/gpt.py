from openai import OpenAI

class Gpt:
    def __init__(self, client: OpenAI):
        self.client = client

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
