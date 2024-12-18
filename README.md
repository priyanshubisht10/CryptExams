# CryptExams

CryptExams is a cryptographically secure examination system designed to ensure the integrity and confidentiality of online exams. By utilizing technologies such as MERN, TypeScript, Redis, and public-key cryptography, the system addresses key challenges in exam security. It prevents unauthorized access to exam questions through question encryption and Shamir's Secret Sharing. During the exam, student submissions are authenticated using private keys and processed by a worker for real-time result verification. Negative responses trigger an immediate system shutdown, while verified answers are published publicly for transparency. The system ensures secure, scalable, and transparent examination processes.

## Features

The exam server is responsible for managing the security and integrity of the examination process. Below are the key features:

1. **Question Encryption and Storage**
    - **Private Key Generation**: The examiner generates a private key to encrypt the exam questions before they are stored in the database.
    - **Secure Question Storage**: The encrypted questions are stored in the database, ensuring that even those with access to the database cannot view the unencrypted questions.

2. **Student Registration**
    - **Secure Registration**: Students can register for the exam by providing necessary personal information and uploading a profile image, which is stored securely in Cloudinary.
    - **Email Notification**: A confirmation email is sent to the student upon successful registration via Nodemailer, ensuring the student receives personal details regarding the exam.

3. **Shamir's Secret Sharing for Key Distribution**
    - **Shamir’s Secret Sharing**: The examiner divides the private key used for question encryption into multiple parts (Shamir secrets).
    - **Secure Distribution**: These secrets are distributed to different independent authorities (e.g., government bodies), ensuring no single entity has access to the full key.
    - **Decryption at Exam Time**: On the day of the exam, the secrets are combined to generate the full private key, which is used to decrypt the exam questions for the students.

4. **Student Authentication**
    - **Secure Key Generation**: Each student is assigned a unique secret key at the exam center, which corresponds to a public key stored in the database.
    - **Private Key Usage**: Only the student knows their private key, ensuring secure authentication during the exam.

5. **Submission Handling and Queueing**
    - **Secure Submission**: Students submit their answers signed with their private key, ensuring the integrity and authenticity of their responses.
    - **Submission Queue**: Submissions are pushed to a message queue for processing by the worker machine, ensuring scalability and efficient handling of a large volume of responses.

6. **Real-Time Result Verification** 
    - **Worker for Verification**: The worker listens to the submission queue, verifying each submission against the stored public key in the database.
    - **Pub/Sub for Result Distribution**: The verification result is published to two separate channels in a Pub/Sub system—**positive processed** and **negative processed**.
    - Repo Link: (https://github.com/priyanshubisht10/result-worker.git)

7. **Negative Response Handling**
    - **WebSocket Integration**: A WebSocket server listens for verification responses in real-time and sends positive or negative feedback to the student interface.
    - **System Shutdown on Negative Response**: The client is connected to the WebSocket server and will shut down if a negative response is received, locking the student out and notifying the authorities.
    - Repo Link: (https://github.com/priyanshubisht10/websocket-server.git)

## Installation

Follow these steps to set up the Result Worker in your environment:

### Prerequisites

1. **Node.js** (version >= 16)
2. **Redis**
3. **Docker**
4. **Git**

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/priyanshubisht10/CryptExams
    ```
    ```bash
    cd CryptExams
    ```
2. Set up the server:
    ```bash
    cd server
    ```
3. Install dependencies:
    ```bash
   npm install
    ```
4. Set up environment variables:
Create a `config.env` file in the root directory and define the following variables:
    ```env
    DATABASE=
    DATABASE_PASSWORD=
    WORKER_DB=
    WORKER_DB_PASSWORD=
    PORT=
    NODE_ENV=development
    JWT_SECRET=
    JWT_SECRET_ADMIN=
    QUESTION_ENCRYPTION_ALGORITHM=aes-256-cbc
    IV_HASH=1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d
    SHAMIR_1=
    SHAMIR_2=
    SHAMIR_3=
    JWT_COOKIE_EXPIRES_IN=
    JWT_EXPIRES_IN=
    CLOUDINARY_CLOUD_NAME=
    CLOUDINARY_API_KEY=
    CLOUDINARY_API_SECRET=
    CLIENT_URL=http://localhost:5173/
    ```
5. Start Redis (in Docker Container): 
    ```bash
    docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
    ```
    ```bash
    docker exec -it redis-stack redis-cli
    ```
6. Start the backend server:
    ```bash
    nodemon server.js
    ```
7. Set up the frontend/client: Open a new terminal
    ```bash
    cd CryptExams/client
    ```
8. Install the dependencies:
    ```bash
    npm install
    ```
9. Run the Vite development server:
    ```bash
    npm run dev
    ```

## Additional Resources

I have also documented this on medium, Check it out:  
[https://priyanshubisht10.medium.com/](https://priyanshubisht10.medium.com/)  
