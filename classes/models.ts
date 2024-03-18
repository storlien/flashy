type Flashcard = {
    id: string;
    question: string;
    answer: string;
    hasQuestionImage?: boolean;
    hasAnswerImage?: boolean;
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

    hasLiked: boolean;
}

type UserSettings = {
    name: string | null | undefined;
    email: string | null | undefined;
    role?: string | null;
    favoriteSets: string[];
}

type ImageMetadata = {
    customMetadata: {
        userId: string;
        flashcardSetId: string;
    }
}

type ImageToUpload = {
    file: File;
    flashcardId: string;
    isQuestionImage: boolean;
}

export {
    type Flashcard,
    type FlashcardSet,
    type FlashcardSetPrefs,
    type UserSettings,
    type ImageMetadata,
    type ImageToUpload,
}
