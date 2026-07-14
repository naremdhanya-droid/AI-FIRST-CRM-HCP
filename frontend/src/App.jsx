import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [interaction, setInteraction] = useState("");
  const [result, setResult] = useState(null);
  const [search, setSearch] = useState("");

  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem(
      "interactionHistory"
    );

    return savedHistory
      ? JSON.parse(savedHistory)
      : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "interactionHistory",
      JSON.stringify(history)
    );
  }, [history]);

  const analyzeInteraction = async () => {
    if (!interaction.trim()) {
      alert("Please enter an interaction.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: interaction,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to analyze interaction"
        );
      }

      const data = await response.json();

      setResult(data);

      const newInteraction = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        interaction: interaction,
        summary: data.summary,
        follow_up: data.follow_up,
      };

      setHistory((previousHistory) => [
        newInteraction,
        ...previousHistory,
      ]);

      setInteraction("");
    } catch (error) {
      console.error(error);

      alert(
        "Backend connection error. Check FastAPI server."
      );
    }
  };

  const deleteInteraction = (id) => {
    const updatedHistory = history.filter(
      (item) => item.id !== id
    );

    setHistory(updatedHistory);
  };

  const clearHistory = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all interaction history?"
    );

    if (confirmClear) {
      setHistory([]);
      setResult(null);
      setSearch("");
    }
  };

  const filteredHistory = history.filter(
    (item) => {
      const searchText = search.toLowerCase();

      return (
        item.interaction
          .toLowerCase()
          .includes(searchText) ||
        item.summary
          .toLowerCase()
          .includes(searchText) ||
        item.follow_up
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  return (
    <div className="app">
      <div className="container">
        <h1>
          AI-First CRM for HCP Interactions
        </h1>

        <p>
          Enter an HCP interaction to generate
          a summary and suggested follow-up.
        </p>

        <textarea
          placeholder="Enter interaction details..."
          value={interaction}
          onChange={(event) =>
            setInteraction(event.target.value)
          }
        />

        <button onClick={analyzeInteraction}>
          Analyze Interaction
        </button>

        {result && (
          <div className="result-card">
            <h2>Analysis Result</h2>

            <p>
              <strong>Summary: </strong>
              {result.summary}
            </p>

            <p>
              <strong>
                Suggested Follow-up:{" "}
              </strong>
              {result.follow_up}
            </p>
          </div>
        )}

        <div className="history">
          <h2>Interaction History</h2>

          <input
            type="text"
            placeholder="Search interactions..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <button onClick={clearHistory}>
            Clear History
          </button>

          {filteredHistory.length === 0 ? (
            <p>
              No interaction history found.
            </p>
          ) : (
            filteredHistory.map((item) => (
              <div
                className="history-card"
                key={item.id}
              >
                <p>
                  <strong>
                    Date & Time:{" "}
                  </strong>
                  {item.date}
                </p>

                <p>
                  <strong>
                    Interaction:{" "}
                  </strong>
                  {item.interaction}
                </p>

                <p>
                  <strong>Summary: </strong>
                  {item.summary}
                </p>

                <p>
                  <strong>
                    Suggested Follow-up:{" "}
                  </strong>
                  {item.follow_up}
                </p>

                <button
                  onClick={() =>
                    deleteInteraction(
                      item.id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;