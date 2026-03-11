import { useState } from "react";
import { editMenuItem } from "../../api/waiterApi";

export default function EditItem({item, onClose} : any ) {

    const [errors, setErrors] = useState({})

    async function submitForm(formData : FormData) {

        type FormErrors = {
        name?: string;
        description?: string;
        price?: string;
        calories?: string;
        ingredients?: string;
        allergens?: string;
        filters?: string;
        itemType?: string;
        image?: string;
        isAvailable?: string;
        api? : string
        };

        let validationErrors: FormErrors = {};

        const name = formData.get("name")?.toString().trim() ?? "";
        if (!name) {
            validationErrors.name = "Name is required";
        } else if (name.length < 2) {
            validationErrors.name = "Name must be at least 2 characters";
        }

        const description = formData.get("description")?.toString().trim() ?? "";
        if (!description) {
            validationErrors.description = "Description is required";
        } else if (description.length < 10) {
            validationErrors.description = "Description must be at least 10 characters";
        }

        const priceRaw = formData.get("price")?.toString().trim() ?? "";
        const price = Number(priceRaw);
        if (!priceRaw) {
            validationErrors.price = "Price is required";
        } else if (Number.isNaN(price)) {
            validationErrors.price = "Price must be a number";
        } else if (price <= 0) {
            validationErrors.price = "Price must be greater than 0";
        }

        const caloriesRaw = formData.get("calories")?.toString().trim() ?? "";
        const calories = Number(caloriesRaw);
        if (!caloriesRaw) {
            validationErrors.calories = "Calories is required";
        } else if (Number.isNaN(calories)) {
            validationErrors.calories = "Calories must be a number";
        } else if (calories < 0) {
            validationErrors.calories = "Calories cannot be negative";
        }

        const ingredientsRaw = formData.get("ingredients")?.toString().trim() ?? "";
        if (!ingredientsRaw) {
            validationErrors.ingredients = "Ingredients are required";
        } else {
            const ingredients = ingredientsRaw
            .split(",")
            .map((v:any) => v.trim())
            .filter((v:any) => v.length > 0);

            if (ingredients.length === 0) {
            validationErrors.ingredients = "Please enter at least one ingredient";
            }
        }

        const allergensRaw = formData.get("allergens")?.toString().trim() ?? "";
        if (allergensRaw) {
            const allergens = allergensRaw
                .split(",")
                .map((v) => v.trim())
                .filter((v) => v.length > 0);

            if (allergens.length === 0) {
                validationErrors.allergens = "Please enter valid allergens separated by commas";
            }
        }

        const vegetarian = formData.get("vegetarian") === "on";
        const vegan = formData.get("vegan") === "on";
        const glutenFree = formData.get("glutenFree") === "on";
        const meat = formData.get("meat") === "on";

        const itemType = formData.get("itemType")?.toString().trim() ?? "";
        if (!itemType) {
            validationErrors.itemType = "Item type is required";
        } else {
            const allowed = ["FOOD", "DRINK", "DESSERT"];
            if (!allowed.includes(itemType)) {
            validationErrors.itemType = "Item type must be FOOD, DRINK, or DESSERT";
            }
        }

        const image = formData.get("image")?.toString().trim() ?? "";
        if (!image) {
            validationErrors.image = "Image path is required";
        } else if (!image.startsWith("/")) {
            validationErrors.image = "Image path must start with '/'";
        }


        const isAvailableRaw = formData.get("isAvailable")?.toString().trim() ?? "";
        if (!isAvailableRaw) {
            validationErrors.isAvailable = "Availability is required";
        } else if (!(isAvailableRaw === "true" || isAvailableRaw === "false")) {
            validationErrors.isAvailable = "Availability must be true or false";
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
        const updatedItem = {
            id: item.id,
            name: name,
            description: description,
            price: price,
            calories: calories,
            ingredients: ingredientsRaw
                .split(",")
                .map((v) => v.trim())
                .filter((v) => v.length > 0)
                .map((v) => ({ name: v })),
             allergens: allergensRaw
                .split(",")
                .map((v) => v.trim())
                .filter((v) => v.length > 0)
                .join(","),
            vegetarian: vegetarian,
            vegan: vegan,
            glutenFree: glutenFree,
            meat: meat,
            itemType: itemType as "FOOD" | "DRINK" | "DESSERT",
            available: isAvailableRaw === "true",
            imageUrl: image,
        };

        await editMenuItem(item.id, updatedItem)
        window.location.reload()
    } catch (error: any) {
        setErrors({
            api: error.message || "Failed to update product. Please try again."
        })
    }

    }

    return (
        <div className="edit_item_main" onClick={onClose}>
            <div className="edit_item_main_backdrop">

            </div>
            <div className="edit_item_content" onClick={(e) => e.stopPropagation()}>
                <button className="edit_item_content_close" type="button" onClick={onClose}>x</button>
                <div className="edit_item_scroll">
                    <p className="edit_item_title">Edit Product</p>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        submitForm(formData);}}
                    className="edit_item_form">
                        <label className="edit_item_form_label" htmlFor="name">Name</label>
                        <input
                            className="edit_item_form_input"
                            id="name"
                            type="text"
                            defaultValue={item.name}
                            name="name"
                            required
                        />
                        <label className="edit_item_form_label" htmlFor="description">Description</label>
                        <textarea
                            className="edit_item_form_textarea"
                            id="description"
                            rows={4}
                            defaultValue={item.description}
                            name="description"
                            required
                        />
                        <label className="edit_item_form_label" htmlFor="price">Price (£)</label>
                        <input
                            className="edit_item_form_input"
                            id="price"
                            type="number"
                            step="0.01"
                            defaultValue={item.price}
                            name="price"
                            required
                        />
                        <label className="edit_item_form_label" htmlFor="calories">Calories (kcal)</label>
                        <input
                            className="edit_item_form_input"
                            id="calories"
                            type="number"
                            defaultValue={item.calories}
                            name="calories"
                            required
                        />
                        <label className="edit_item_form_label" htmlFor="ingredients">Ingredients (comma separated if multiple)</label>
                        <input
                            className="edit_item_form_input"
                            id="ingredients"
                            type="text"
                            defaultValue={item.ingredients}
                            name="ingredients"
                            required
                        />
                        <label className="edit_item_form_label" htmlFor="allergens">Allergens (optional - comma separated if multiple)</label>
                        <input
                            className="edit_item_form_input"
                            id="allergens"
                            type="text"
                            defaultValue={item.allergens}
                            name="allergens"
                        />
                        <label className="edit_item_form_label" htmlFor="filters">Dietary Filters (optional - comma separated if multiple)</label>
                        <div className="edit_item_form_filter">
                            <label>
                            <input
                                type="checkbox"
                                name="vegetarian"
                                defaultChecked={item.filters.includes("Vegetarian")}
                            />
                            Vegetarian
                            </label>
                            <label>
                            <input
                                type="checkbox"
                                name="vegan"
                                defaultChecked={item.filters.includes("Vegan")}
                            />
                            Vegan
                            </label>
                            <label>
                            <input
                                type="checkbox"
                                name="glutenFree"
                                defaultChecked={item.filters.includes("GlutenFree")}
                            />
                            Gluten Free
                            </label>
                            <label>
                            <input
                                type="checkbox"
                                name="meat"
                                defaultChecked={item.filters.includes("Meat")}
                            />
                            Meat
                            </label>
                        </div>
                        <label className="edit_item_form_label" htmlFor="itemType">Item Type</label>
                        <select name="itemType" id="itemType" defaultValue={item.itemType} className="edit_item_form_select">
                            <option value="FOOD">FOOD</option>
                            <option value="DESSERT">DESSERT</option>
                            <option value="DRINK">DRINK</option>
                        </select>
                        <label className="edit_item_form_label" htmlFor="image">Image (must lead with a /)</label>
                        <input
                            className="edit_item_form_input"
                            id="image"
                            type="text"
                            defaultValue={item.image}
                            name="image"
                            required
                        />
                        <label className="edit_item_form_label">Availability</label>
                        <div className="edit_item_radio_group" key={item.id}>
                        <label className="edit_item_radio_label">
                            <input
                            type="radio"
                            name="isAvailable"
                            value="true"
                            defaultChecked={item.isAvailable === true}
                            />
                            Available
                        </label>
                        <label className="edit_item_radio_label">
                            <input
                            type="radio"
                            name="isAvailable"
                            value="false"
                            defaultChecked={item.isAvailable === false}
                            />
                            Not Available
                        </label>
                        </div>
                        {Object.keys(errors).length > 0 && (
                            <div className="error_box">
                                <p className="error_box_title">Please fix the following errors:</p>
                                <ul>
                                    {Object.entries(errors).map(([field, message] : any) => (
                                        <li className="error_box_list" key={field}>{message}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <button type="submit" className="edit_item_save_btn">
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}