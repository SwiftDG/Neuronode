require("dotenv").config();
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend/dist")));

const problems = [
  {
    id: 1,
    title: "Two Sum",
    category: "arrays",
    difficulty: "Easy",
    pattern: "Hashmap",
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists",
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 6, we return [0, 1].",
      },
    ],
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, output: [0, 1] },
    ],
    hiddenTestCases: [
      { input: { nums: [1, 2, 3, 4, 5], target: 9 }, output: [3, 4] },
      { input: { nums: [-1, -2, -3, -4, -5], target: -8 }, output: [2, 4] },
    ],
    youtubeId: "KLlXCFG5TnA",
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    // Write your solution here\n    \n};`,
      python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your solution here\n        pass`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        \n    }\n}`,
    },
    hints: [
      "Imagine you're looking for two puzzle pieces that fit together to make the target number. As you pick up each piece, what if you checked whether its perfect match is already in a box you've been filling?",
      "A HashMap (or object in JavaScript) is like a magic box — you can check if something is inside it instantly, no matter how many things are in it. This is called O(1) lookup. As you go through the array, store each number you've seen in this box.",
      "For each number you see, calculate what number would complete the pair: complement = target - currentNumber. Then check if that complement is already in your box. If it is — you found your pair! If not, put the current number in the box and keep going.",
    ],
  },
  {
    id: 2,
    title: "Contains Duplicate",
    category: "arrays",
    difficulty: "Easy",
    pattern: "Hashset",
    description: `Given an integer array \`nums\`, return \`true\` if any value appears at least twice in the array, and return \`false\` if every element is distinct.`,
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁹ ≤ nums[i] ≤ 10⁹"],
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "true",
        explanation: "The element 1 appears at index 0 and index 3.",
      },
      {
        input: "nums = [1,2,3,4]",
        output: "false",
        explanation: "All elements are distinct.",
      },
      {
        input: "nums = [1,1,1,3,3,4,3,2,4,2]",
        output: "true",
        explanation: "Multiple elements appear more than once.",
      },
    ],
    testCases: [
      { input: { nums: [1, 2, 3, 1] }, output: true },
      { input: { nums: [1, 2, 3, 4] }, output: false },
      { input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] }, output: true },
    ],
    hiddenTestCases: [
      { input: { nums: [1] }, output: false },
      { input: { nums: [1, 1] }, output: true },
    ],
    youtubeId: "3OamzN90kPg",
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {boolean}\n */\nfunction containsDuplicate(nums) {\n    // Write your solution here\n    \n};`,
      python: `class Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        # Write your solution here\n        pass`,
      java: `class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Write your solution here\n        \n    }\n}`,
    },
    hints: [
      "Think of it like a guest list at a party. As each guest arrives, you check if their name is already on the list. If it is — duplicate found! If not, add their name and move to the next guest.",
      "A Set is a special collection that only holds unique values. If you try to add something that's already there, it just ignores it. So if you add a number to a Set and the Set's size doesn't increase — that number was already there!",
      "Go through each number in the array. Before adding it to your Set, check if it already exists in the Set using the `has()` method. If it does, return true immediately. If you finish the whole array without finding a duplicate, return false.",
    ],
  },
  {
    id: 3,
    title: "Valid Anagram",
    category: "arrays",
    difficulty: "Easy",
    pattern: "Hashmap / Frequency Count",
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.`,
    constraints: [
      "1 ≤ s.length, t.length ≤ 5 × 10⁴",
      "s and t consist of lowercase English letters",
    ],
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: "true",
        explanation: "Both strings contain: a×3, n×1, g×1, r×1, m×1.",
      },
      {
        input: 's = "rat", t = "car"',
        output: "false",
        explanation: "rat has r,a,t but car has c,a,r — different letters.",
      },
    ],
    testCases: [
      { input: { s: "anagram", t: "nagaram" }, output: true },
      { input: { s: "rat", t: "car" }, output: false },
      { input: { s: "a", t: "a" }, output: true },
    ],
    hiddenTestCases: [
      { input: { s: "ab", t: "a" }, output: false },
      { input: { s: "aacc", t: "ccac" }, output: false },
    ],
    youtubeId: "9UtInBqnCgA",
    starterCode: {
      javascript: `/**\n * @param {string} s\n * @param {string} t\n * @return {boolean}\n */\nfunction isAnagram(s, t) {\n    // Write your solution here\n    \n};`,
      python: `class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        # Write your solution here\n        pass`,
      java: `class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Write your solution here\n        \n    }\n}`,
    },
    hints: [
      "Anagrams are like the same ingredients in a different order. 'listen' and 'silent' have the exact same letters — just rearranged. So what do they share? The count of each letter is identical. Start there.",
      "Build a 'frequency map' — a hashmap where each key is a letter and each value is how many times it appears. For example, 'aab' becomes {a: 2, b: 1}. Build this for both strings.",
      "If both strings have the same frequency map, they're anagrams. A quick trick: if the lengths differ, return false immediately. Then build one frequency map for s (adding counts) and use it for t (subtracting counts). If any count goes below 0, they're not anagrams.",
    ],
  },
  {
    id: 4,
    title: "Group Anagrams",
    category: "arrays",
    difficulty: "Medium",
    pattern: "Hashmap / Sorting",
    description: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.

An anagram is a word or phrase formed by rearranging the letters of another word, using all the original letters exactly once.`,
    constraints: [
      "1 ≤ strs.length ≤ 10⁴",
      "0 ≤ strs[i].length ≤ 100",
      "strs[i] consists of lowercase English letters",
    ],
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation:
          "eat, tea, ate are all anagrams. tan, nat are anagrams. bat has no anagram.",
      },
      {
        input: 'strs = [""]',
        output: '[[""]]',
        explanation: "Single empty string.",
      },
      {
        input: 'strs = ["a"]',
        output: '[["a"]]',
        explanation: "Single character.",
      },
    ],
    testCases: [
      {
        input: { strs: ["eat", "tea", "tan", "ate", "nat", "bat"] },
        output: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]],
      },
      { input: { strs: [""] }, output: [[""]] },
      { input: { strs: ["a"] }, output: [["a"]] },
    ],
    hiddenTestCases: [
      {
        input: { strs: ["abc", "bca", "cab", "xyz"] },
        output: [["abc", "bca", "cab"], ["xyz"]],
      },
    ],
    youtubeId: "vzdNOK2oB2E",
    starterCode: {
      javascript: `/**\n * @param {string[]} strs\n * @return {string[][]}\n */\nfunction groupAnagrams(strs) {\n    // Write your solution here\n    \n};`,
      python: `class Solution:\n    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:\n        # Write your solution here\n        pass`,
      java: `class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Write your solution here\n        \n    }\n}`,
    },
    hints: [
      "Think about what all anagrams have in common. 'eat', 'tea', 'ate' — they all contain e, a, t. What if you sorted each word alphabetically? 'eat' → 'aet', 'tea' → 'aet', 'ate' → 'aet'. They all become the same thing!",
      "That sorted version is your key. Use a hashmap where the key is the sorted string and the value is a list of all words that sort to that key.",
      "Go through each word in strs. Sort its letters alphabetically to get the key. Check if that key exists in your hashmap — if yes, add the word to that group. If no, create a new group. At the end, return all the groups (the values of your hashmap).",
    ],
  },
  {
    id: 5,
    title: "Top K Frequent Elements",
    category: "arrays",
    difficulty: "Medium",
    pattern: "Hashmap / Bucket Sort",
    description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in any order.`,
    constraints: [
      "1 ≤ nums.length ≤ 10⁵",
      "-10⁴ ≤ nums[i] ≤ 10⁴",
      "k is in the range [1, the number of unique elements in the array]",
      "It is guaranteed that the answer is unique",
    ],
    examples: [
      {
        input: "nums = [1,1,1,2,2,3], k = 2",
        output: "[1,2]",
        explanation:
          "1 appears 3 times, 2 appears 2 times, 3 appears 1 time. Top 2 are 1 and 2.",
      },
      {
        input: "nums = [1], k = 1",
        output: "[1]",
        explanation: "Only one element, so top 1 is just [1].",
      },
    ],
    testCases: [
      { input: { nums: [1, 1, 1, 2, 2, 3], k: 2 }, output: [1, 2] },
      { input: { nums: [1], k: 1 }, output: [1] },
    ],
    hiddenTestCases: [
      { input: { nums: [4, 4, 4, 3, 3, 2, 1], k: 2 }, output: [4, 3] },
      { input: { nums: [1, 2], k: 2 }, output: [1, 2] },
    ],
    youtubeId: "YPTqKIgVk-k",
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} k\n * @return {number[]}\n */\nfunction topKFrequent(nums, k) {\n    // Write your solution here\n    \n};`,
      python: `class Solution:\n    def topKFrequent(self, nums: List[int], k: int) -> List[int]:\n        # Write your solution here\n        pass`,
      java: `class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        // Write your solution here\n        \n    }\n}`,
    },
    hints: [
      "Before finding the 'most frequent', you need to know how frequent each number is. Start by counting — go through the array and use a hashmap to record how many times each number appears. For [1,1,1,2,2,3] you'd get {1:3, 2:2, 3:1}.",
      "Now you have frequencies. You need the top k. One approach: sort by frequency descending, take first k. But there's a smarter way called bucket sort — create an array of size n+1 where the index represents frequency. Put numbers into their frequency bucket.",
      "With bucket sort: create array `buckets` where `buckets[3]` contains all numbers that appear exactly 3 times. Then iterate from the highest bucket to lowest, collecting numbers until you have k of them. This runs in O(n) time — faster than sorting!",
    ],
  },
  {
    id: 6,
    title: "Product of Array Except Self",
    category: "arrays",
    difficulty: "Medium",
    pattern: "Prefix / Suffix Products",
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

The product of any prefix or suffix of \`nums\` is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in O(n) time and without using the division operation.`,
    constraints: [
      "2 ≤ nums.length ≤ 10⁵",
      "-30 ≤ nums[i] ≤ 30",
      "The product of any prefix or suffix fits in a 32-bit integer",
    ],
    examples: [
      {
        input: "nums = [1,2,3,4]",
        output: "[24,12,8,6]",
        explanation:
          "answer[0] = 2×3×4 = 24, answer[1] = 1×3×4 = 12, answer[2] = 1×2×4 = 8, answer[3] = 1×2×3 = 6",
      },
      {
        input: "nums = [-1,1,0,-3,3]",
        output: "[0,0,9,0,0]",
        explanation: "The zero makes most products zero.",
      },
    ],
    testCases: [
      { input: { nums: [1, 2, 3, 4] }, output: [24, 12, 8, 6] },
      { input: { nums: [-1, 1, 0, -3, 3] }, output: [0, 0, 9, 0, 0] },
    ],
    hiddenTestCases: [
      { input: { nums: [2, 3, 4, 5] }, output: [60, 40, 30, 24] },
      { input: { nums: [1, 1, 1, 1] }, output: [1, 1, 1, 1] },
    ],
    youtubeId: "bNvIQI2wAjk",
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number[]}\n */\nfunction productExceptSelf(nums) {\n    // Write your solution here\n    \n};`,
      python: `class Solution:\n    def productExceptSelf(self, nums: List[int]) -> List[int]:\n        # Write your solution here\n        pass`,
      java: `class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Write your solution here\n        \n    }\n}`,
    },
    hints: [
      "You can't use division. So think about what answer[i] actually means: it's the product of everything to the LEFT of i, multiplied by the product of everything to the RIGHT of i. Can you calculate those separately?",
      "Do two passes through the array. First pass (left to right): for each position i, calculate the product of all numbers to its left. Store these in a 'prefix' array. Second pass (right to left): calculate the product of all numbers to its right.",
      "Multiply prefix[i] × suffix[i] to get answer[i]. You can even do this with O(1) extra space: fill the result array with prefix products in one pass, then multiply by the running suffix product in a second pass going right to left.",
    ],
  },
  {
    id: 7,
    title: "Maximum Subarray",
    category: "arrays",
    difficulty: "Medium",
    pattern: "Kadane's Algorithm / Dynamic Programming",
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum = 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "Only one element, so the max subarray sum is 1.",
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "The entire array [5,4,-1,7,8] has sum 23.",
      },
    ],
    testCases: [
      { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, output: 6 },
      { input: { nums: [1] }, output: 1 },
      { input: { nums: [5, 4, -1, 7, 8] }, output: 23 },
    ],
    hiddenTestCases: [
      { input: { nums: [-1, -2, -3, -4] }, output: -1 },
      { input: { nums: [1, 2, 3, -100, 4, 5, 6] }, output: 15 },
    ],
    youtubeId: "5WZl3MMT0Eg",
    starterCode: {
      javascript: `/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction maxSubArray(nums) {\n    // Write your solution here\n    \n};`,
      python: `class Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        # Write your solution here\n        pass`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your solution here\n        \n    }\n}`,
    },
    hints: [
      "At each position in the array, you have a simple choice: should I extend my current subarray by including this number, or should I start a brand new subarray from here? Think about when starting fresh is smarter than continuing.",
      "Starting fresh is better when your current running sum is negative — because a negative sum only drags you down. So: if currentSum + nums[i] > nums[i], extend. Otherwise, start fresh at nums[i]. In simpler terms: currentSum = Math.max(nums[i], currentSum + nums[i]).",
      "This is called Kadane's Algorithm. Keep two variables: currentSum (the best sum ending at this position) and maxSum (the best you've seen so far). Update maxSum = Math.max(maxSum, currentSum) at each step. Start both at nums[0] and loop from index 1.",
    ],
  },
];

app.get("/api/problems", (req, res) => {
  const publicProblems = problems.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    difficulty: p.difficulty,
    pattern: p.pattern,
    description: p.description,
    constraints: p.constraints,
    examples: p.examples,
    testCases: p.testCases,
    youtubeId: p.youtubeId,
    starterCode: p.starterCode,
    hints: p.hints,
  }));
  res.json(publicProblems);
});

app.get("/api/problems/:id", (req, res) => {
  const problem = problems.find((p) => p.id === parseInt(req.params.id));
  if (!problem) return res.status(404).json({ error: "Problem not found" });
  const { hiddenTestCases, ...publicProblem } = problem;
  res.json(publicProblem);
});

app.post("/api/hint", (req, res) => {
  const { problemId, hintLevel } = req.body;
  const problem = problems.find((p) => p.id === problemId);
  if (!problem) return res.status(404).json({ error: "Problem not found" });
  const hint = problem.hints[hintLevel];
  if (!hint)
    return res.json({
      hint: "You've seen all the hints. Trust your thinking — you have everything you need.",
    });
  res.json({ hint });
});

app.post("/api/analyze", async (req, res) => {
  const { code, problemId, language } = req.body;
  const problem = problems.find((p) => p.id === problemId);
  if (!problem) return res.status(404).json({ error: "Problem not found" });

  console.log("Analyze called for problem:", problemId);
  console.log("API Key exists:", !!ANTHROPIC_API_KEY);
  console.log("API Key prefix:", ANTHROPIC_API_KEY?.slice(0, 10));

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `You are a Socratic DSA tutor. A student is solving "${problem.title}" in ${language}.

Their code:
\`\`\`${language}
${code}
\`\`\`

Problem: ${problem.description}

Analyze their approach and respond with:
1. What they're doing right (be specific and encouraging)
2. One Socratic question that guides them toward improvement WITHOUT giving the answer
3. A hint about time/space complexity if relevant

Keep it concise, beginner-friendly, and never give the solution directly. Max 150 words.`,
          },
        ],
      }),
    });

    console.log("Anthropic response status:", response.status);
    const data = await response.json();
    console.log("Anthropic response:", JSON.stringify(data).slice(0, 200));

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const analysis = data.content[0].text;
    res.json({ analysis });
  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).json({ error: "Analysis failed", details: err.message });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Neuronode running on ${process.env.PORT || 5000}`);
});
