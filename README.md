# AniX - Unofficial Web Client for Anixart

AniX is an unofficial web client for the Android application Anixart. It allows you to access and manage your Anixart account from a web browser on your desktop or laptop computer.

## Screenshots

user profile page
![user profile page image](./docs/profile.jpg)

main page
![main page image](./docs/index.jpg)

## Project Structure

This project consists of two main parts:

1. **Backend (Python with FastAPI):** This handles communication with the Anixart API and provides data to the frontend.
2. **Frontend (Next.js):** This is the user interface that you interact with in your web browser. It fetches data from the backend and displays it in a user-friendly way.

## Disclaimer

Please note that AniX is an unofficial project and is not affiliated with the developers of Anixart. It is recommended to use the official Anixart app for the most up-to-date features and functionality.

## Getting Started

The is a two ways to run this project locally. directly and via docker compose.

### Docker

#### Docker Requirements

- docker (>=26)
- docker compose (>= 2.27)

#### Running the project via Docker

Execute `docker compose -f docker-compose.dev.yml up` command in the root of the folder.

You can access the AniX web client in your browser at `http://127.0.0.1`. And API docs at `http://127.0.0.1/api/docs`

### Directly

#### Prerequisites

- Python 3.6 or later ([https://www.python.org/downloads/](https://www.python.org/downloads/))
- Node.js and npm ([https://nodejs.org/en](https://nodejs.org/en))

#### Setting Up the Backend

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

#### Setting Up the Frontend

1. Navigate to the `frontend` directory.
2. Install the required frontend dependencies:

   ```bash
   npm install
   ```

#### Running the Project

1. Start the backend server:

   ```bash
   cd ./backend
   source ./venv/bin/activate
   uvicorn main:app --reload
   ```

2. Start the frontend development server:

   ```bash
   cd ./frontend
   npm run dev
   ```

3. Start local traefik reverse proxy

   1. download a traefik binary from [github](https://github.com/traefik/traefik/releases/tag/v2.11.2)
   2. place it in traefik directory and make it executable
   3. run `sudo ./traefik --configFile ./traefik.yml`

You can access the AniX web client in your browser at `http://127.0.0.1`. And API docs at `http://127.0.0.1/api/docs`

## Development

To maintain code formatting it's recommended to use pre-commit hooks

0. Install global pre-commit `pip install pre-commit`
1. Install pre-commit hooks via `pre-commit install` inside repository folder

To maintain readable git commit messages it's recommended to use [commitizen](https://commitizen-tools.github.io/commitizen/)

Feel free to make changes and experiment with the project.

### Docker development environment

To run development environment via docker you can execute the docker watch command, it will watch and copy local changes in to the running container. you will need to use the dev compose file and docker files.

Execute the `docker compose -f docker-compose.dev.yml watch` command to set up the docker development environment.

To access the docker logs you can use `docker compose -f docker-compose.dev.yml logs -f` command.

## Deployment

1. clone this repository via `git clone https://github.com/Radiquum/AniX.git`
2. cd into the repository folder.
3. deploy app with below instructions.

### Docker Deployment

#### Docker Prerequisites

1. **Docker:** Make sure Docker is installed on your system. You can download it from [https://www.docker.com/](https://www.docker.com/).
2. **Docker Compose:** Docker Compose should also be installed. It's usually included with Docker installations.
3. **Domain Name:** (optional) You need a registered domain name (e.g., `example.com`) and have it pointing to your server's IP address.
4. **SSL Certificate:** (optional) For HTTPS, you'll need an SSL certificate. Let's Encrypt is a free and popular option.

#### Docker steps

1. Edit the .env file
2. Edit the docker-compose.yml file to match your needs.
3. run `docker compose up -d` to build and run production images.
4. your app will be available at `http(s)://{DOMAIN}`.
5. run `docker compose down` to stop the containers.

*notes*:

- application is deployed as http by default, to enable https you need to edit docker compose and .env files.

   if https is enabled, traefik will automatically issue HTTPS certificate from lets encrypt and redirect to HTTPS.

- you can also run `docker compose up --build` to build and run images without re-deploying the containers.


### Deta Space

1. **Install the Space CLI:**

   ```bash
   curl -fsSL https://deta.space/assets/space-cli.sh | sh
   ```

2. **Login to Deta Space:**

   ```bash
   space login
   ```

   (You'll need to grab an access token from your Space dashboard)

3. **Create a new Space Project:**

   ```bash
   space new
   ```

   (This will guide you through setting up your project)

4. **Push your app to Deta Space:**

   ```bash
   space push
   ```

   (This will build and deploy your application)

You can find more details in the Deta Space documentation: [Deta Space Docs](https://docs.deta.space/)

<!-- ### Standalone

To be added soon . . . -->

## Contributing

We welcome contributions to this project! If you have any bug fixes, improvements, or new features, please feel free to create a pull request.
