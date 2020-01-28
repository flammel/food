export type UUID = string;

export const nilUUID = "00000000-0000-0000-0000-000000000000";

// From https://stackoverflow.com/a/2117523
export function uuidv4(): UUID {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
