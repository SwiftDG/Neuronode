import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [problems, setProblems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [hint, setHint] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/problems")
      .then((res) => setProblems(res.data));
  }, []);

  const getHint = async () => {
    const res = await axios.post("http://localhost:5000/api/hint", {
      problemId: selected,
      hintLevel,
    });
    setHint(res.data.hint);
    setHintLevel(hintLevel + 1);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Neuronode — DSA Tutor</h1>

      <div>
        <h3>Problems</h3>
        {problems.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setSelected(p.id);
              setHint("");
              setHintLevel(0);
            }}
          >
            {p.title}
          </button>
        ))}
      </div>

      {selected && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          {problems.find((p) => p.id === selected) && (
            <>
              <h3>{problems.find((p) => p.id === selected).title}</h3>
              <p>{problems.find((p) => p.id === selected).description}</p>
              <button onClick={getHint}>Get Hint ({hintLevel})</button>
              {hint && (
                <p style={{ color: "#0066cc", marginTop: "10px" }}>{hint}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
