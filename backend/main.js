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
    difficulty: "Easy",
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
    difficulty: "Easy",
    description: "Determine if any value appears at least twice in the array.",
    hints: [
      "How would you track what you have already seen?",
      "What structure gives you O(1) lookup and stores unique values?",
      "Add each element to a Set — if it already exists, you found a duplicate",
    ],
  },
  {
    id: 3,
    title: "Valid Anagram",
    category: "arrays",
    difficulty: "Easy",
    description: "Check if two strings are anagrams of each other.",
    hints: [
      "What do anagrams have in common structurally?",
      "What if you counted the frequency of each character?",
      "Build a frequency map for both strings and compare them",
    ],
  },
  {
    id: 4,
    title: "Group Anagrams",
    category: "arrays",
    difficulty: "Medium",
    description: "Group strings that are anagrams of each other together.",
    hints: [
      "What property do all anagrams in a group share?",
      "Could you use that shared property as a key?",
      "Sort each string — anagrams produce the same sorted string. Use it as a hashmap key",
    ],
  },
  {
    id: 5,
    title: "Top K Frequent Elements",
    category: "arrays",
    difficulty: "Medium",
    description: "Find the k most frequent elements in an array.",
    hints: [
      "Count the frequency of each element first",
      "Now you need the top k frequencies — what structure helps?",
      "A heap or bucket sort works — bucket sort is O(n)",
    ],
  },
  {
    id: 6,
    title: "Product of Array Except Self",
    category: "arrays",
    difficulty: "Medium",
    description:
      "Return an array where each element is the product of all elements except itself. No division allowed.",
    hints: [
      "Can you solve it without using division?",
      "Think about prefix and suffix products separately",
      "Build left products in one pass, then multiply by right products in another",
    ],
  },
  {
    id: 7,
    title: "Maximum Subarray",
    category: "arrays",
    difficulty: "Medium",
    description:
      "Find the contiguous subarray with the largest sum (Kadane's Algorithm).",
    hints: [
      "Should you include the current element or start a new subarray?",
      "What happens when your running sum goes negative?",
      "Track current sum and max sum — reset current to 0 when it goes negative",
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
