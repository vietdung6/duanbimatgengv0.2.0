import Hashids from 'hashids';

const HASH_SALT = process.env.HASH_SALT || 'gen-g-fandom-super-secret-salt-2024';
const MIN_LENGTH = 8;
const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

const hashids = new Hashids(HASH_SALT, MIN_LENGTH, ALPHABET);

export const encodeId = (id: number): string => {
    return hashids.encode(id);
};

export const decodeId = (hash: string): number | null => {
    const decoded = hashids.decode(hash);
    return decoded.length > 0 ? Number(decoded[0]) : null;
};
