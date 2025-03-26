export const sentences = [
  {
    id: 1,
    text: "The cat are sleeping on the couch",
    difficulty: "easy",
    errors: [
      {
        index: 2,
        correction: "is",
        options: ["is", "be", "am", "was"]
      }
    ],
    hint: "Check subject-verb agreement"
  },
  {
    id: 2,
    text: "She dont like chocolate ice cream",
    difficulty: "easy",
    errors: [
      {
        index: 1,
        correction: "doesn't",
        options: ["doesn't", "do not", "didnt", "don't"]
      }
    ],
    hint: "Third person singular needs 'doesn't'"
  },
  {
    id: 3,
    text: "They went to they're favorite restaurant yesterday",
    difficulty: "easy",
    errors: [
      {
        index: 3,
        correction: "their",
        options: ["their", "there", "they're", "they"]
      }
    ],
    hint: "Which 'their/there/they're' shows possession?"
  },
  {
    id: 4,
    text: "The children has finished their homework already",
    difficulty: "medium",
    errors: [
      {
        index: 2,
        correction: "have",
        options: ["have", "has", "had", "having"]
      }
    ],
    hint: "Plural subjects need plural verbs"
  },
  {
    id: 5,
    text: "Me and Tom are going to the concert tonight",
    difficulty: "medium",
    errors: [
      {
        index: 0,
        correction: "I",
        options: ["I", "Me", "Mine", "Myself"]
      }
    ],
    hint: "Which pronoun form is correct as a subject?"
  },
  {
    id: 6,
    text: "She speaked to the manager about her complaint",
    difficulty: "medium",
    errors: [
      {
        index: 1,
        correction: "spoke",
        options: ["spoke", "speaked", "speaking", "speaks"]
      }
    ],
    hint: "What's the correct past tense of 'speak'?"
  },
  {
    id: 7,
    text: "The team are playing good in the tournament",
    difficulty: "medium",
    errors: [
      {
        index: 3,
        correction: "well",
        options: ["well", "good", "better", "best"]
      }
    ],
    hint: "Should you use an adjective or adverb here?"
  },
  {
    id: 8,
    text: "Neither the students nor the teacher were able to solve the problem",
    difficulty: "hard",
    errors: [
      {
        index: 6,
        correction: "was",
        options: ["was", "were", "is", "are"]
      }
    ],
    hint: "With 'neither/nor', the verb agrees with the closest noun"
  },
  {
    id: 9,
    text: "The data shows that climate change is accelerating faster then expected",
    difficulty: "hard",
    errors: [
      {
        index: 8,
        correction: "than",
        options: ["than", "then", "that", "thus"]
      }
    ],
    hint: "Is this a time sequence or a comparison?"
  },
  {
    id: 10,
    text: "If I would have known about the party I would have attended",
    difficulty: "hard",
    errors: [
      {
        index: 1,
        correction: "had",
        options: ["had", "would have", "have", "would"]
      }
    ],
    hint: "What's the correct structure for third conditional?"
  }
]; 