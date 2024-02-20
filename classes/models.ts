type Flashcard = {
    id: String;
    question: String;
    answer: String;
}

type FlashcardSet = {
    id: String;
    userId: String;
    public: Boolean;
    name: String;
    category: String;
    flashcards: Flashcard[];
}

type FlashcardSetPrefs = {
    userId: String;
    setId: String;

    /** List of card ids marked as difficult by user */
    difficult: String[];

    /** List of card ids the user has marked as completed */
    completed: String[];
}