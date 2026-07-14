from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import TypedDict
from langgraph.graph import StateGraph, END
from datetime import datetime


app = FastAPI(title="AI-First CRM HCP Backend")


# Allow React frontend to connect with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request model
class Interaction(BaseModel):
    message: str


# LangGraph state
class AgentState(TypedDict):
    message: str
    summary: str
    follow_up: str


# Temporary interaction storage
interaction_history = []


# -----------------------------
# LANGGRAPH AGENT NODE
# -----------------------------

def analyze_interaction(state: AgentState):
    message = state["message"]

    summary = message.strip()

    follow_up = (
        "Contact the HCP again and complete "
        "the required follow-up actions."
    )

    return {
        "message": message,
        "summary": summary,
        "follow_up": follow_up,
    }


# Create LangGraph workflow
workflow = StateGraph(AgentState)

workflow.add_node(
    "analyze_interaction",
    analyze_interaction
)

workflow.set_entry_point(
    "analyze_interaction"
)

workflow.add_edge(
    "analyze_interaction",
    END
)

crm_agent = workflow.compile()


# -----------------------------
# TOOL 1: LOG INTERACTION
# -----------------------------

def log_interaction_tool(message: str):

    result = crm_agent.invoke(
        {
            "message": message,
            "summary": "",
            "follow_up": "",
        }
    )

    interaction = {
        "id": len(interaction_history) + 1,
        "date_time": datetime.now().isoformat(),
        "interaction": message,
        "summary": result["summary"],
        "follow_up": result["follow_up"],
    }

    interaction_history.append(interaction)

    return interaction


# -----------------------------
# TOOL 2: EDIT INTERACTION
# -----------------------------

def edit_interaction_tool(
    interaction_id: int,
    new_message: str
):

    for item in interaction_history:

        if item["id"] == interaction_id:

            result = crm_agent.invoke(
                {
                    "message": new_message,
                    "summary": "",
                    "follow_up": "",
                }
            )

            item["interaction"] = new_message
            item["summary"] = result["summary"]
            item["follow_up"] = result["follow_up"]

            return item

    return None


# -----------------------------
# TOOL 3: SEARCH INTERACTION
# -----------------------------

def search_interaction_tool(query: str):

    return [
        item
        for item in interaction_history
        if query.lower()
        in item["interaction"].lower()
    ]


# -----------------------------
# TOOL 4: DELETE INTERACTION
# -----------------------------

def delete_interaction_tool(
    interaction_id: int
):

    for item in interaction_history:

        if item["id"] == interaction_id:

            interaction_history.remove(item)

            return {
                "message":
                "Interaction deleted successfully"
            }

    return {
        "message":
        "Interaction not found"
    }


# -----------------------------
# TOOL 5: FOLLOW-UP SUGGESTION
# -----------------------------

def follow_up_tool(message: str):

    return {
        "suggested_follow_up":
        "Contact the HCP, schedule the next "
        "meeting, and complete pending actions."
    }


# -----------------------------
# API ROUTES
# -----------------------------

@app.get("/")
def home():

    return {
        "message":
        "AI CRM FastAPI backend is running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy",
        "langgraph": "enabled"
    }


@app.post("/analyze")
def analyze(data: Interaction):

    if not data.message.strip():

        raise HTTPException(
            status_code=400,
            detail="Interaction cannot be empty"
        )

    return log_interaction_tool(
        data.message
    )


@app.get("/interactions")
def get_interactions():

    return interaction_history


@app.put("/interactions/{interaction_id}")
def edit_interaction(
    interaction_id: int,
    data: Interaction
):

    result = edit_interaction_tool(
        interaction_id,
        data.message
    )

    if result is None:

        raise HTTPException(
            status_code=404,
            detail="Interaction not found"
        )

    return result


@app.get("/search")
def search_interactions(query: str):

    return search_interaction_tool(
        query
    )


@app.delete(
    "/interactions/{interaction_id}"
)
def delete_interaction(
    interaction_id: int
):

    return delete_interaction_tool(
        interaction_id
    )


@app.post("/follow-up")
def create_follow_up(
    data: Interaction
):

    return follow_up_tool(
        data.message
    )