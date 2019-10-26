import Ajv from "ajv";
import { JsonData } from "./StorageTypes";

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile({
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "https://foodlog.florianlammel.com/foodlog.schema.json",
    title: "Foodlog",
    description: "Foodlog",
    type: "object",
    properties: {
        foods: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    brand: { type: "string" },
                    quantity: { type: "number" },
                    servingSize: { type: "number" },
                    unit: { type: "string" },
                    isDeleted: { type: "boolean" },
                    sort: { type: "number" },
                    calories: { type: "number" },
                    fat: { type: "number" },
                    carbs: { type: "number" },
                    protein: { type: "number" },
                },
                additionalProperties: false,
                required: [
                    "id",
                    "name",
                    "brand",
                    "quantity",
                    "servingSize",
                    "unit",
                    "isDeleted",
                    "sort",
                    "calories",
                    "fat",
                    "carbs",
                    "protein",
                ],
            },
        },
        recipes: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    servings: { type: "number" },
                    ingredients: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                foodId: { type: "string" },
                                quantity: { type: "number" },
                                isDeleted: { type: "boolean" },
                                sort: { type: "number" },
                            },
                            additionalProperties: false,
                            required: ["id", "foodId", "quantity", "isDeleted", "sort"],
                        },
                    },
                    isDeleted: { type: "boolean" },
                    sort: { type: "number" },
                },
                additionalProperties: false,
                required: ["id", "name", "servings", "ingredients", "isDeleted", "sort"],
            },
        },
        consumptions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    consumable: {
                        type: "object",
                        properties: {
                            type: { type: "string" },
                            id: { type: "string" },
                        },
                        additionalProperties: false,
                        required: ["type", "id"],
                    },
                    quantity: { type: "number" },
                    date: { type: "string" },
                    isDeleted: { type: "boolean" },
                    sort: { type: "number" },
                },
                additionalProperties: false,
                required: ["id", "consumable", "quantity", "date", "isDeleted", "sort"],
            },
        },
        settings: {
            type: "object",
            properties: {
                targetCalories: {
                    type: "number",
                },
                targetFat: {
                    type: "number",
                },
                targetCarbs: {
                    type: "number",
                },
                targetProtein: {
                    type: "number",
                },
            },
            additionalProperties: false,
            required: ["targetCalories", "targetFat", "targetCarbs", "targetProtein"],
        },
    },
    additionalProperties: false,
    required: ["foods", "recipes", "consumptions", "settings"],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function isJsonData(json: any): json is JsonData {
    const valid = validate(json);
    if (valid) {
        return true;
    } else {
        console.error("Data is invalid", validate.errors);
        return false;
    }
}
