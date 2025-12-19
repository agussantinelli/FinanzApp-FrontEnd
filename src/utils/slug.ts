export const createSlug = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .normalize("NFD") // Split accents
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};
