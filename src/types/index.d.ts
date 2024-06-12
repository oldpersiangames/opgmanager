export interface Game {
    id: number;
    slug: string;
    ia_id: string;
    selling: boolean;
    title_fa: string;
    title_en: string;
    producers: Array;
    publishers: Array;
    release_dates: Array;
    platforms: Array;
    released_on_en: Array;
    released_on_fa: Array;
    defects_en: Array;
    defects_fa: Array;
    notes_en: string;
    notes_fa: string;
    content_en: string;
    content_fa: string;
    games: Array;
    contributes: Array;
    photos: Array;
    links: Array;
    files: string;
    tgfiles: string;
}