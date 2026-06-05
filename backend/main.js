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
      "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
    youtubeId: "KLlXCFG5TnA",
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // your code here\n}`,
      python: `def two_sum(nums, target):\n    # your code here\n    pass`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // your code here\n    }\n}`,
    },
    hints: [
      "What data structure lets you check if a value exists in O(1) — meaning instantly, no matter how big the array?",
      "Could you go through the array once and remember what you've seen so far?",
      "For each number, check if (target - that number) is something you've already seen.",
    ],
  },
  {
    id: 2,
    title: "Contains Duplicate",
    category: "arrays",
    difficulty: "Easy",
    description:
      "Given an integer array nums, return true if any value appears at least twice, and false if every element is distinct.",
    youtubeId: "3OamzN90kPg",
    starterCode: {
      javascript: `function containsDuplicate(nums) {\n  // your code here\n}`,
      python: `def contains_duplicate(nums):\n    # your code here\n    pass`,
      java: `class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // your code here\n    }\n}`,
    },
    hints: [
      "How would you remember which numbers you've already seen as you go through the array?",
      "A Set is like a bag that refuses to hold duplicates — what happens when you try to add something already in it?",
      "Go through each number. If it's already in your Set, you found a duplicate. If not, add it.",
    ],
  },
  {
    id: 3,
    title: "Valid Anagram",
    category: "arrays",
    difficulty: "Easy",
    description:
      "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram uses the same letters, just rearranged.",
    youtubeId: "9UtInBqnCgA",
    starterCode: {
      javascript: `function isAnagram(s, t) {\n  // your code here\n}`,
      python: `def is_anagram(s, t):\n    # your code here\n    pass`,
      java: `class Solution {\n    public boolean isAnagram(String s, String t) {\n        // your code here\n    }\n}`,
    },
    hints: [
      "Anagrams have the exact same letters — just in different order. What do they share?",
      "What if you counted how many times each letter appears in both strings?",
      "Build a frequency map (letter → count) for both strings. If the maps are equal, they're anagrams.",
    ],
  },
  {
    id: 4,
    title: "Group Anagrams",
    category: "arrays",
    difficulty: "Medium",
    description:
      "Given an array of strings, group the anagrams together. You can return the answer in any order.",
    youtubeId: "vzdNOK2oB2E",
    starterCode: {
      javascript: `function groupAnagrams(strs) {\n  // your code here\n}`,
      python: `def group_anagrams(strs):\n    # your code here\n    pass`,
      java: `class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // your code here\n    }\n}`,
    },
    hints: [
      "All anagrams in a group share something in common — what is it?",
      "If you sort the letters of any anagram, you get the same result. Could that be your group key?",
      "Sort each string alphabetically. Use that sorted version as a key in a hashmap. Group strings by their key.",
    ],
  },
  {
    id: 5,
    title: "Top K Frequent Elements",
    category: "arrays",
    difficulty: "Medium",
    description:
      "Given an integer array nums and an integer k, return the k most frequent elements.",
    youtubeId: "YPTqKIgVk-k",
    starterCode: {
      javascript: `function topKFrequent(nums, k) {\n  // your code here\n}`,
      python: `def top_k_frequent(nums, k):\n    # your code here\n    pass`,
      java: `class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        // your code here\n    }\n}`,
    },
    hints: [
      "Before finding the top k, what do you need to know about each number?",
      "Count how often each number appears using a hashmap. Now you have frequencies — how do you get the top k?",
      "Sort by frequency and take the top k. Or use a bucket sort where index = frequency for O(n) speed.",
    ],
  },
  {
    id: 6,
    title: "Product of Array Except Self",
    category: "arrays",
    difficulty: "Medium",
    description:
      "Given an integer array nums, return an array where each element is the product of all other elements. You cannot use division.",
    youtubeId: "bNvIQI2wAjk",
    starterCode: {
      javascript: `function productExceptSelf(nums) {\n  // your code here\n}`,
      python: `def product_except_self(nums):\n    # your code here\n    pass`,
      java: `class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // your code here\n    }\n}`,
    },
    hints: [
      "You can't use division. Think about what each position's answer actually is.",
      "The answer at position i = (product of everything to the left) × (product of everything to the right).",
      "Do two passes: first build left products, then multiply by right products going backwards.",
    ],
  },
  {
    id: 7,
    title: "Maximum Subarray",
    category: "arrays",
    difficulty: "Medium",
    description:
      "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.",
    youtubeId: "5WZl3MMT0Eg",
    starterCode: {
      javascript: `function maxSubArray(nums) {\n  // your code here\n}`,
      python: `def max_sub_array(nums):\n    # your code here\n    pass`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        // your code here\n    }\n}`,
    },
    hints: [
      "At each position, you have a choice: extend the current subarray, or start fresh. Which is better?",
      "If your running sum goes negative, it's dragging you down — starting fresh from the current element is smarter.",
      "Track currentSum and maxSum. At each step: currentSum = max(num, currentSum + num). Update maxSum if currentSum is bigger.",
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
