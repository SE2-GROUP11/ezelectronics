import _ from "underscore";
import { Category, Product } from "../../src/components/product";

type ProductObj = {
	sellingPrice: number;
	model: string;
	category: Category;
	arrivalDate: string;
	details: string;
	quantity: number;
};

export const getRandomProductObj = (): ProductObj => {
	const id = _.random(1000);
	return {
		sellingPrice: _.random(100),
		model: `Random product #${id}`,
		arrivalDate: "2024-01-01",
		details: `Description of random product #${id}`,
		quantity: _.random(100),
		category: _.sample([Category.APPLIANCE, Category.LAPTOP, Category.SMARTPHONE]) || Category.APPLIANCE
	};
};

export const productObjToClass = ({ sellingPrice, model, category, arrivalDate, details, quantity }: ProductObj) =>
	new Product(sellingPrice, model, category, arrivalDate, details, quantity);

export const getRandomProduct = (): Product => productObjToClass(getRandomProductObj());
