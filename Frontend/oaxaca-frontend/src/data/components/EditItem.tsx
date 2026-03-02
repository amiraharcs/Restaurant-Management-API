export default function EditItem({item, onClose} : any ) {
    return (
        <div className="edit_item_main" onClick={onClose}>
            <div className="edit_item_main_backdrop">

            </div>
            <div className="edit_item_content" onClick={(e) => e.stopPropagation()}>
                <button className="edit_item_content_close" type="button" onClick={onClose}>x</button>
                <p className="edit_item_title">Edit Product</p>
                <form action="" className="edit_item_form">
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
                        value={item.description}
                        name="description"
                        required
                    />

                    <label className="edit_item_form_label" htmlFor="price">Price (£)</label>
                    <input
                        className="edit_item_form_input"
                        id="price"
                        type="number"
                        step="0.01"
                        value={item.price}
                        name="price"
                        required
                    />

                    <label className="edit_item_form_label" htmlFor="calories">Calories (kcal)</label>
                    <input
                        className="edit_item_form_input"
                        id="calories"
                        type="number"
                        value={item.calories}
                        name="calories"
                        required
                    />

                    <label className="edit_item_form_label" htmlFor="ingredients">Ingredients (comma separated)</label>
                    <input
                        className="edit_item_form_input"
                        id="ingredients"
                        type="text"
                        value={item.ingredients}
                        name="ingredients"
                        required
                    />

                    <label className="edit_item_form_label" htmlFor="allergens">Allergens</label>
                    <input
                        className="edit_item_form_input"
                        id="allergens"
                        type="text"
                        value={item.allergens}
                        name="allergens"
                        required
                    />

                    <label className="edit_item_form_label" htmlFor="filters">Dietary Filters</label>
                    <input
                        className="edit_item_form_input"
                        id="filters"
                        type="text"
                        value={item.filters}
                        name="filters"
                        required
                    />

                    <label className="edit_item_form_label" htmlFor="itemType">Item Type</label>
                    <input
                        className="edit_item_form_input"
                        id="itemType"
                        type="text"
                        value={item.itemType}
                        name="itemType"
                        required
                    />

                    <label className="edit_item_form_label">Availability</label>
                    <div className="edit_item_radio_group">
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

                    <button type="submit" className="edit_item_save_btn">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    )
}