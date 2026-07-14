# AI-First CRM HCP – Log Interaction Module

## Project Overview

This project is an AI-first Customer Relationship Management (CRM) application designed for Healthcare Professional (HCP) interactions.

The application allows field representatives to log, analyze, search, edit, and manage HCP interactions using a structured form and an AI-powered conversational interface.

## Technologies Used

- React.js
- Redux
- Python
- FastAPI
- LangGraph
- Groq LLM
- Gemma2-9b-it / Llama-3.3-70b-versatile
- REST API

## Key Features

- Log HCP interactions
- Edit existing interactions
- Search interaction history
- Analyze interactions using AI
- Generate interaction summaries
- Extract important interaction details
- Suggest follow-up actions
- Clear interaction history

## LangGraph AI Agent

The LangGraph agent manages HCP interaction workflows and uses the Groq LLM to understand interaction details, generate summaries, extract relevant information, and recommend follow-up actions.

## LangGraph Tools

1. Log Interaction
2. Edit Interaction
3. Search Interactions
4. Analyze Interaction
5. Generate Follow-up Actions

## Project Structure

- `frontend/` – React frontend application
- `backend/` – Backend application files
- `fastapi-backend/` – FastAPI and LangGraph AI services
- `requirements.txt` – Python dependencies

## How to Run the Project

### Backend

```bash
cd fastapi-backend
pip install -r requirements.txt
uvicorn main:app --reload
