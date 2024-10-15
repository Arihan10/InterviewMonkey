# InterviewMonkey

**Built by: Arihan Sharma, Minglun Shao, William Zeng, Luke**

![image](https://github.com/user-attachments/assets/687b6405-cb4d-4c64-89c1-af8b3265ff32)

# Showcase

![image](https://github.com/user-attachments/assets/c305a57e-226c-4d57-9e4e-294d29f64cfb)

![image](https://github.com/user-attachments/assets/78a1ecac-61ba-4966-a9c4-081674785927)

## 🌟Inspiration
The interview process can be unpredictable and stressful, especially when you’re targeting different companies and roles. We wanted to create a tool that makes interview prep more personalized, engaging, and interactive, while simulating a competitive and realistic environment. That’s why we built InterviewMonkeyDuels, combining AI, machine learning, and gamification to offer a unique preparation experience for all skill levels.

## 🖥️ What it does
InterviewMonkeyDuels is a game-changing platform for interview preparation. It lets users host rooms for any company and any role, with a combination of cutting-edge AI and real-time interactivity:

Our AI pipeline scans the web for company and role-specific data using Selenium and GPT for page fetching and information extraction, generating relevant interview questions dynamically. Participants can join rooms and compete by answering these customized questions. Responses are parsed in real-time by Whisper AI for speech-to-text (STT) and further analyzed by GPT for accuracy and relevance. A TensorFlow-based posture tracking system uses machine learning to monitor each participant’s body language, integrating posture feedback into the health-based game mechanics. The LLM then rates each participant’s response and shares the ratings with everyone in the room, creating an interactive and competitive environment. The game-like experience makes practicing for interviews both fun and effective, with each session tailored to the exact company and role being targeted.

## 🛠️ How we built it
We employed a range of advanced technologies to bring InterviewMonkeyDuels to life:

GPT powers both the question generation and web page scanning, pulling in relevant information from across the web for the interview room. Selenium handles the page fetching and ensures data from the web is retrieved dynamically. Whisper AI is used to process and transcribe users’ verbal answers into text, allowing for seamless interaction. TensorFlow is employed for real-time posture tracking, integrating body language into the gameplay by affecting health points based on user posture. FastAPI is used for the backend and to manage websockets, ensuring real-time communication between participants. Next.js powers the frontend, delivering a smooth and engaging user experience.

## 🏁 Challenges we ran into
Creating InterviewMonkeyDuels was a complex task:

Ensuring all AI models worked together in real time without introducing significant lag posed a serious challenge, especially when parsing responses and tracking posture simultaneously. Customizing interview questions for each company and role required fine-tuning the GPT model to ensure relevance and accuracy. Building a fluid and engaging frontend experience using Next.js while managing real-time communication via FastAPI websockets required a careful balance between performance and usability. Integrating TensorFlow for posture tracking in real time, while ensuring that feedback felt responsive and fair in the gameplay context, was a challenging process.

## 🏆Accomplishments that we're proud of
We’re proud of several key accomplishments:

Successfully implementing a dynamic AI pipeline that delivers real-time, company-specific, and role-specific questions. Seamlessly integrating TensorFlow for posture tracking and making body language an active part of the gameplay. Building a robust system that enables participants to compete in a real-time environment while receiving instant feedback, all within a Next.js frontend and FastAPI backend.

## ✏️ What we learned
Throughout the project, we deepened our knowledge of integrating multiple AI systems into a unified product and balancing real-time interaction with complex processing tasks. We also learned how important user experience is in a multi-user, gamified environment, and the critical role personalization plays in interview preparation.

## 💯 What's next for InterviewMonkeyDuels
We see tremendous business potential for InterviewMonkeyDuels:

We plan to offer subscription-based access, providing premium features such as advanced posture feedback and AI-driven coaching. By partnering with companies, we aim to create branded rooms where users can practice with real interview scenarios tailored to specific employers. We'll continue refining our AI and ML models to further improve response accuracy and real-time interaction, with the ultimate goal of becoming the go-to platform for interview preparation.
