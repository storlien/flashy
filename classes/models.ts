type Flashcard = {
    id: String;
    question: String;
    answer: String;
}

type FlashcardSet = {
    id: String;
    name: String;
    category: String;
    flashcards: Flashcard[];
}

type FlashcardSetPrefs = {
    username: String;
    difficult: String[]; // List of cards marked as difficult by user
    completed: String[]; // List of cards the user has marked as completed
}