export type Unit = "ml" | "g";

export function isUnit(value: string): value is Unit {
    return value === "g" || value === "ml";
}
