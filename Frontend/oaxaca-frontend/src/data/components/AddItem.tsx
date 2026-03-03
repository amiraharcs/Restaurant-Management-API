import { useState } from "react";
import { addMenuItem } from "../../api/waiterApi";

export default function AddItem({ onClose }: any) {
  const [errors, setErrors] = useState({} as Record<string, string>);

  async function submitForm(formData: FormData) {
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
      api?: string;
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
        .map((v: any) => v.trim())
        .filter((v: any) => v.length > 0);

      if (ingredients.length === 0) {
        validationErrors.ingredients = "Please enter at least one ingredient";
      }
    }

    const allergensRaw = formData.get("allergens")?.toString().trim() ?? "";
    if (allergensRaw && allergensRaw.length > 0) {
  const allergens = allergensRaw
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);

  if (allergens.length === 0) {
    validationErrors.allergens =
      "Please enter valid allergens separated by commas";
  }
}
    const filtersRaw = formData.get("filters")?.toString().trim() ?? "";
    const allowedFilters = ["None", "Meat", "GlutenFree", "Vegetarian", "Vegan"];

   if (filtersRaw && filtersRaw.length > 0) {

  const filters = filtersRaw
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);

  if (filters.length === 0) {
    validationErrors.filters = "Please enter valid filters separated by commas";
  } else {
    const invalidFilters = filters.filter(
      (filter) => !allowedFilters.includes(filter)
    );

    if (invalidFilters.length > 0) {
      validationErrors.filters =
        `Invalid filters: ${invalidFilters.join(", ")}. ` +
        `Allowed values are: ${allowedFilters.join(", ")}`;
    }
  }
}

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

    setErrors(validationErrors as any);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const newItem = {
        name,
        description,
        price,
        calories,
        ingredients: ingredientsRaw
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v.length > 0),
        allergens: allergensRaw
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v.length > 0),
        filters: filtersRaw
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v.length > 0),
        itemType: itemType as "FOOD" | "DRINK" | "DESSERT",
        isAvailable: isAvailableRaw === "true",
        image,
      };

      await addMenuItem(newItem);
      onClose?.();
    } catch (error: any) {
      setErrors({
        api: error.message || "Failed to add product. Please try again.",
      });
    }
  }

  return (
    <div className="add_item_main" onClick={onClose}>
      <div className="add_item_main_backdrop"></div>

      <div className="add_item_content" onClick={(e) => e.stopPropagation()}>
        <button className="add_item_content_close" type="button" onClick={onClose}>
          x
        </button>

        <div className="add_item_scroll">
          <p className="add_item_title">Add Product</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              submitForm(formData);
            }}
            className="add_item_form"
          >
            <label className="add_item_form_label" htmlFor="name">
              Name
            </label>
            <input
              className="add_item_form_input"
              id="name"
              type="text"
              name="name"
              required
            />

            <label className="add_item_form_label" htmlFor="description">
              Description
            </label>
            <textarea
              className="add_item_form_textarea"
              id="description"
              rows={4}
              name="description"
              required
            />

            <label className="add_item_form_label" htmlFor="price">
              Price (£)
            </label>
            <input
              className="add_item_form_input"
              id="price"
              type="number"
              step="0.01"
              name="price"
              required
            />

            <label className="add_item_form_label" htmlFor="calories">
              Calories (kcal)
            </label>
            <input
              className="add_item_form_input"
              id="calories"
              type="number"
              name="calories"
              required
            />

            <label className="add_item_form_label" htmlFor="ingredients">
              Ingredients (comma separated)
            </label>
            <input
              className="add_item_form_input"
              id="ingredients"
              type="text"
              name="ingredients"
              required
            />

            <label className="add_item_form_label" htmlFor="allergens">
              Allergens
            </label>
            <input
              className="add_item_form_input"
              id="allergens"
              type="text"
              name="allergens"
            />

            <label className="add_item_form_label" htmlFor="filters">
              Dietary Filters
            </label>
            <input
              className="add_item_form_input"
              id="filters"
              type="text"
              name="filters"
            />

            <label className="add_item_form_label" htmlFor="itemType">
              Item Type
            </label>
            <select
              name="itemType"
              id="itemType"
              defaultValue="FOOD"
              className="add_item_form_select"
            >
              <option value="FOOD">FOOD</option>
              <option value="DESSERT">DESSERT</option>
              <option value="DRINK">DRINK</option>
            </select>

            <label className="add_item_form_label" htmlFor="image">
              Image (must lead with a /)
            </label>
            <input
              className="add_item_form_input"
              id="image"
              type="text"
              name="image"
              required
            />

            <label className="add_item_form_label">Availability</label>
            <div className="add_item_radio_group">
              <label className="add_item_radio_label">
                <input type="radio" name="isAvailable" value="true" />
                Available
              </label>
              <label className="add_item_radio_label">
                <input type="radio" name="isAvailable" value="false" />
                Not Available
              </label>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="error_box">
                <p className="error_box_title">Please fix the following errors:</p>
                <ul>
                  {Object.entries(errors).map(([field, message]: any) => (
                    <li className="error_box_list" key={field}>
                      {message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button type="submit" className="add_item_save_btn">
              Add Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}