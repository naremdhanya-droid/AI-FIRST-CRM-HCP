# AI-First CRM for HCP Interactions

## Project Description

AI-First CRM for HCP Interactions is a web application used to record and analyze healthcare professional (HCP) interactions.

The application generates:

- Interaction summary
- Suggested follow-up action
- Interaction history

## Features

- Add a new HCP interaction
- Analyze interaction details
- Generate an interaction summary
- Generate a suggested follow-up
- Store interaction history
- Search interaction history
- Delete individual interactions
- Clear complete interaction history
- Save history using Local Storage
- Keep history after page refresh

## Technologies Used

### Frontend

- React.js
- Vite
- JavaScript
- HTML
- CSS

### Backend

- Python
- FastAPI
- Uvicorn

## How to Run the Project

### Start the Backend

Open the backend terminal and run:

```bash
cd fastapi-backend
uvicorn main:app --reload