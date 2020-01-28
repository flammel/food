import { Consumption, ConsumptionId } from "../Domain/Consumption";
import { Consumable } from "../Domain/Consumable";
import { Settings } from "../Domain/Settings";
import { Food, FoodId, Brand } from "../Domain/Food";
import { Recipe, RecipeId } from "../Domain/Recipe";
import { Statistics } from "../Domain/Statistics";

interface CrudApi<DataType, IdType> {
    create: (data: DataType) => Promise<void>;
    read: (id: IdType) => Promise<DataType>;
    update: (data: DataType) => Promise<void>;
    delete: (data: DataType) => Promise<void>;
    undoDelete: (data: DataType) => Promise<void>;
}

interface ConsumptionsApi extends CrudApi<Consumption, ConsumptionId> {
    load: (date: Date) => Promise<Consumption[]>;
    loadDatesWithData: () => Promise<Set<string>>;
}

interface ConsumablesApi {
    autocomplete: (str: string) => Promise<Consumable[]>;
}

interface FoodsApi extends CrudApi<Food, FoodId> {
    load: () => Promise<Food[]>;
    autocomplete: (search: string) => Promise<Food[]>;
}

interface RecipesApi extends CrudApi<Recipe, RecipeId> {
    load: () => Promise<Recipe[]>;
    duplicate: (recipe: Recipe) => Promise<void>;
}

interface SettingsApi {
    load: () => Promise<Settings>;
    update: (settings: Settings) => Promise<void>;
}

interface StatisticsApi {
    load: () => Promise<Statistics>;
}

interface BrandsApi {
    autocomplete: (search: string) => Promise<Brand[]>;
}

export interface Api {
    consumptions: ConsumptionsApi;
    consumables: ConsumablesApi;
    foods: FoodsApi;
    recipes: RecipesApi;
    settings: SettingsApi;
    statistics: StatisticsApi;
    brands: BrandsApi;
}
