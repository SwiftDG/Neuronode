const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// One problem from arrays category
const problems = [
  {
    id: 1,
    title: "Two Sum",
    category: "arrays",
    description: "Given an array of integers, find two numbers that add to target.",
    hints: [
      "What data structure lets you check if a value exists in O(1)?",
      "Could you iterate once and store values you've seen?",
      "For each number, check if (target - number) exists in what you've stored"
    ],
    solution: "Use a hashmap to store seen numbers"
  },
  // Add 2-3 more array problems
];

app.get('/api/problems', (req, res) => {
  res.json(problems);
});

app.post('/api/hint', (req, res) => {
  const { problemId, hintLevel } = req.body;
  const problem = problems.find(p => p.id === problemId);
  res.json({ hint: problem.hints[hintLevel] || "No more hints" });
});

app.listen(5000, () => console.log('Backend running on 5000'));