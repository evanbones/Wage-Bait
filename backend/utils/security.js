
// validates if a base64 string is a valid image (specifically JPG/PNG/WEBP).
export function isValidImageType(base64String) {
    if (!base64String) return true; // optional field
    const re = /^data:image\/(jpeg|jpg|png|webp);base64,/;
    return re.test(base64String);
}


// basic sanitization to remove potential script tags and restrict special symbols.

export function sanitizeInput(str) {
    if (typeof str !== 'string') return str;
    // remove HTML tags and common XSS patterns
    return str.replace(/<[^>]*>?/gm, '').trim();
}

// validates that a string contains only alphanumeric characters, dots, and underscores.
export function isValidUsername(username) {
    const re = /^[a-zA-Z0-9._]+$/;
    return re.test(username);
}
