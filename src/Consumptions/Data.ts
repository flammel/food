import { NutritionData, Quantity } from "../Types";
import { Food } from "../Foods/Data";

export type ConsumptionId = number;

export interface Consumption extends NutritionData {
    readonly id: ConsumptionId;
    readonly date: Date;
    readonly food: Food;
}

export function withFood(consumption: Consumption, food: Food): Consumption {
    return {
        ...consumption,
        food,
        calories: (food.calories / food.quantity) * consumption.quantity,
        fat: (food.fat / food.quantity) * consumption.quantity,
        carbs: (food.carbs / food.quantity) * consumption.quantity,
        protein: (food.protein / food.quantity) * consumption.quantity,
    };
}

export function withQuantity(consumption: Consumption, quantity: Quantity): Consumption {
    return {
        ...consumption,
        quantity,
        calories: (consumption.food.calories / consumption.food.quantity) * (quantity || 0),
        fat: (consumption.food.fat / consumption.food.quantity) * (quantity || 0),
        carbs: (consumption.food.carbs / consumption.food.quantity) * (quantity || 0),
        protein: (consumption.food.protein / consumption.food.quantity) * (quantity || 0),
    };
}

export function consumptionDateString(consumption: Consumption): string {
    return dateToString(consumption.date);
}

export function dateToString(date: Date): string {
    return date.toISOString().substr(0,10);
}

function fromJson(json: any): Consumption | null {
    return {
        ...json,
        date: new Date(json.date),
    };
}

function datesEqual(d1: Date, d2: Date): boolean{
    return new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), 0, 0, 0, 0).getTime() === new Date(d2.getUTCFullYear(), d2.getUTCMonth(), d2.getUTCDate(), 0, 0, 0, 0).getTime()
}

export function loadConsumptions(date?: Date): Consumption[] {
    const items: Consumption[] = JSON.parse(window.localStorage.getItem("consumptions")) || [];
    return items.map(fromJson).filter((item) => item !== null).filter(item => !date || datesEqual(item.date, date));
}

export function saveConsumption(consumption: Consumption) {
    const id = Math.floor(Math.random() * 1000000);
    window.localStorage.setItem("consumptions", JSON.stringify([...loadConsumptions(), { ...consumption, id }]));
}

export function consumptionLabel(consumption: Consumption): string {
    return consumption.food.name + " (" + consumption.food.brand + ")";
}
