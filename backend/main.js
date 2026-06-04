const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// API routes
const problems = [
  {
    id: 1,
    title: "Two Sum",
    category: "arrays",
    description:
      "Given an array of integers, find two numbers that add to target.",
    hints: [
      "What data structure lets you check if a value exists in O(1)?",
      "Could you iterate once and store values you've seen?",
      "For each number, check if (target - number) exists in what you've stored",
    ],
  },
  {
    id: 2,
    title: "Contains Duplicate",
    category: "arrays",
    description: "Determine if an array contains duplicates.",
    hints: [
      "Can you track what you've already seen?",
      "What data structure gives you O(1) lookups?",
      "Store each element as you go, check before adding",
    ],
  },
  {
    id: 3,
    title: "Valid Anagram",
    category: "arrays",
    description: "Check if two strings are anagrams.",
    hints: [
      "What if you counted the characters?",
      "Same characters, different order?",
      "Build a frequency map of both strings",
    ],
  },
  {
    id: 4,
    title: "Group Anagrams",
    category: "arrays",
    description: "Group strings that are anagrams together.",
    hints: [
      "Anagrams have the same sorted characters",
      "Could you use that as a key?",
      "Group by the sorted version of each string",
    ],
  },
  {
    id: 5,
    title: "Top K Frequent Elements",
    category: "arrays",
    description: "Find the k most frequent elements in an array.",
    hints: [
      "Count the frequency of each element first",
      "Now you need the top k frequencies",
      "A heap or bucket sort works here",
    ],
  },
  {
    id: 6,
    title: "Product of Array Except Self",
    category: "arrays",
    description:
      "Given an array, return an array where each element is the product of all elements except itself.",
    hints: [
      "Can't use division",
      "Think about prefix and suffix products",
      "Build left products, then right products",
    ],
  },
  {
    id: 7,
    title: "Maximum Subarray",
    category: "arrays",
    description:
      "Find the contiguous subarray with the largest sum (Kadane's algorithm).",
    hints: [
      "Track the maximum so far",
      "Should you include the current element or start fresh?",
      "If sum goes negative, reset it",
    ],
  },
];

app.get("/api/problems", (req, res) => {
  res.json(problems);
});

app.post("/api/hint", (req, res) => {
  const { problemId, hintLevel } = req.body;
  const problem = problems.find((p) => p.id === problemId);
  res.json({ hint: problem.hints[hintLevel] || "No more hints" });
});

// Fallback for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(5000, () => console.log("Neuronode running on 5000"));
