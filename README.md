# Wage Bait

[![React Version](https://img.shields.io/badge/react-v19.2-blue)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/evanbones/GIT-2026/blob/main/LICENSE)

### Tech Stack

- **Frontend:** React 19/Vite
- **Backend:** Express
- **Infrastructure:** Docker & Docker Compose

## Team Members

- Evan Bowness
- Patrick Rinn
- Cohen Kucher

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

You will need Docker installed on your machine.

- [Get Docker](https://docs.docker.com/get-docker/)

### Installation & Running Locally

1. **Clone the repository**

```bash
git clone https://github.com/evanbones/Wage-Bait.git
cd Wage-Bait
```

2. **Start the development environment**
   Run the following command from the root directory to build and spin up both the Express backend and React frontend:

```bash
docker compose watch
```

3. **View the application**

- Frontend (Vite/React): Open `http://localhost:5173` in your browser.
- Backend: Available at `http://localhost:8000`.