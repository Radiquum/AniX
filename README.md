# AniX - Unofficial Web Client for Anixart

AniX is an unofficial web client for the Android application Anixart. It allows you to access and manage your Anixart account from a web browser on your desktop or laptop computer.

## Project Structure

This project consists of two main parts:

1. **Backend (Python with FastAPI):** This handles communication with the Anixart API and provides data to the frontend.
2. **Frontend (Next.js):** This is the user interface that you interact with in your web browser. It fetches data from the backend and displays it in a user-friendly way.

## Disclaimer

Please note that AniX is an unofficial project and is not affiliated with the developers of Anixart. It is recommended to use the official Anixart app for the most up-to-date features and functionality.

## Getting Started

### Prerequisites

* Python 3.6 or later ([https://www.python.org/downloads/](https://www.python.org/downloads/))
* Node.js and npm ([https://nodejs.org/en](https://nodejs.org/en))

### Setting Up the Backend

1. Clone this repository.
2. Navigate to the project directory in your terminal.
3. Create a virtual environment to isolate project dependencies:

   ```bash
   python -m venv venv
   source venv/bin/activate  # For Linux/macOS
   venv\Scripts\activate.bat  # For Windows
   ```

4. Install the required backend dependencies:

   ```bash
   pip install -r ./requirements.txt
   ```

5. (Optional) Create a `.env` file in the project root directory to store sensitive information like API keys.

### Setting Up the Frontend

1. Navigate to the `frontend` directory.
2. Install the required frontend dependencies:

   ```bash
   npm install
   ```

### Running the Project

1. Start the backend server:

   ```bash
   cd ..  # Navigate back to the project root directory
   uvicorn main:app --reload
   ```

2. Start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

3. Start local reverse proxy server like traefik

    ```to be added soon```

This will start the development server for both the backend and frontend. You can access the AniX web client in your browser at ```no url for now```.

<!-- ## Development

The code for both the backend and frontend is well-commented and should be easy to understand and modify. Feel free to make changes and experiment with the project. -->

## Deployment

### Docker

To be added soon . . .

### Deta Space

To be added soon . . .

### Standalone

To be added soon . . .

## Contributing

We welcome contributions to this project! If you have any bug fixes, improvements, or new features, please feel free to create a pull request.