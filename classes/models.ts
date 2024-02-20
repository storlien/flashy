type Flashcard = {
    id: string;
    question: string;
    answer: string;
}

type FlashcardSet = {
    id: string;
    userId: string;
    public: boolean;
    name: string;
    category: string;
    flashcards: Flashcard[];
}

type FlashcardSetPrefs = {
    userId: string;
    setId: string;

    /** List of card ids marked as difficult by user */
    difficult: String[];

    /** List of card ids the user has marked as completed */
    completed: String[];
}