type User = {
    id: string;
    name: string;
    favorites: string[];
}

type Flashcard = {
    id: string;
    question: string;
    answer: string;
}

type FlashcardSet = {
    id: string;
    userId: string;
    isPublic: boolean;
    name: string;
    category: string;
    flashcards: Flashcard[];
}

type FlashcardSetPrefs = {
    userId: string;
    setId: string;

    /** List of card ids marked as difficult by user */
    difficult: string[];

    /** List of card ids the user has marked as completed */
    completed: string[];
}

export {
    type Flashcard,
    type FlashcardSet,
    type FlashcardSetPrefs
}