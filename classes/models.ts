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

type UserSettings = {
    id?: string;
    name: string | null | undefined;
    email: string | null | undefined;
    role? : string | null;
    favoriteSets: string[];
}

export {
    type Flashcard,
    type FlashcardSet,
    type FlashcardSetPrefs,
    type UserSettings,
}