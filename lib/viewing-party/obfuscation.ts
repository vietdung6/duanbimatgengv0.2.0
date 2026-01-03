/**
 * Simple obfuscation for numerical IDs to prevent sequential ID guessing in URLs.
 * Uses a deterministic shift and base36 encoding.
 */

const SALT_PRIME = 1000003;
const OFFSET = 5000000;

/**
 * Obfuscates a numerical ID into a string.
 */
export function obfuscateId(id: number): string {
    // Simple algorithm: (id * prime + offset) converted to base36
    const obfuscatedNumber = (id * SALT_PRIME) + OFFSET;
    return obfuscatedNumber.toString(36).toUpperCase();
}

/**
 * Deobfuscates an obfuscated string back into a numerical ID.
 * Returns NaN if the input is invalid.
 */
export function deobfuscateId(obfuscatedId: string): number {
    try {
        const obfuscatedNumber = parseInt(obfuscatedId.toLowerCase(), 36);
        if (isNaN(obfuscatedNumber)) return NaN;

        const id = (obfuscatedNumber - OFFSET) / SALT_PRIME;

        // Check if it's a valid integer
        if (id % 1 !== 0 || id <= 0) return NaN;

        return id;
    } catch (error) {
        return NaN;
    }
}
