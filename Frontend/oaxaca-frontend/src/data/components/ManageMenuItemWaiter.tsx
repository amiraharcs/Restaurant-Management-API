import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteMenuItem, fetchMenuItemById } from "../../api/managerApi";
import NavBarWaiter from "./NavBarWaiter";
import StaffFooter from "./StaffFooter";
import { SiTicktick } from "react-icons/si";
import EditItem from "./EditItem";
import { getLoggedInStaffRole } from "./staffSession";
import { updateMenuItemAvailability } from "../../api/waiterApi";
import { GiCancel } from "react-icons/gi";

export default function ManageMenuItemWaiter() {
    const navigate = useNavigate();

  const { id } = useParams();
  const [item, setItem] = useState<any>(null);

  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    async function loadItem() {
      const data = await fetchMenuItemById(Number(id));
      setItem(data);
      console.log(data)
    }
    loadItem();
    
  }, [id]);

  if (!item) {
  return <div>Loading...</div>;
}


  async function changeAvailability(id: number, availability: boolean) {
    try {
        await updateMenuItemAvailability(id, availability)
        window.location.reload();
    } catch (error : any) {
        setError(error.message || "Failed to update item availability. Please try again.");
    }
  }

  return (
  <div className="manage_item_page">
    <NavBarWaiter />

    <div className="manage_item_content">
      <div className="manage_item_card">
            <div className="manage_item_header">
                <h1 className="manage_item_title">{item.name}</h1>
                {item.isAvailable ? <SiTicktick className="manage_item_tick"/> : <GiCancel className="manage_item_cross"/>}
            </div>
            <div className="manage_item_important_info">
                <span className="info_bubble info_type">
                    {item.itemType}
                </span>

                <span className="info_bubble info_id">
                    ID: {item.id}
                </span>
            </div>
            <img
            className="manage_item_image"
            src={item.image}
            alt={item.name}
            />
            <div className="manage_item_description">
                <p className="manage_item_description_title">Description</p>
                <p className="manage_item_description_text">{item.description}</p>
            </div>
            <div className="manage_item_ingredients">
                <p className="manage_item_ingredients_title">Ingredients</p>
                <div className="manage_item_ingredients_list">
                    {item.ingredients.map( (ingredient: any) => (
                        <p key={ingredient} className="manage_item_ingredient">{ingredient}</p>
                    ))}
                </div>
            </div>
            <div className="manage_item_allergen_filter">
                <div className="manage_item_box">
                    <p className="manage_item_allergen_filter_title">Allergens</p>
                    <div className="manage_item_tags">
                        {item.allergens && item.allergens.length > 0 ? item.allergens.map( (allergen: any) => (
                            <p key={allergen} className="manage_item_tag">{allergen}</p>
                        )) : <p className="manage_item_tag">None</p>}
                    </div>
                </div>
                <div className="manage_item_box">
                    <p className="manage_item_allergen_filter_title">Filter</p>
                    <div className="manage_item_tags">
                        {item.filters && item.filters.length > 0 ? item.filters.map( (filter: any) => (
                            <p key={filter} className="manage_item_tag">{filter}</p>
                        )) : <p className="manage_item_tag">None</p>}
                    </div>
                </div>
            </div>
            <div className="manage_item_price_calories_waiter">
                <p className="manage_item_calories_waiter">{item.calories} kcal</p>
                <p className="manage_item_price_waiter">£{Number(item.price).toFixed(2)}</p>
            </div>
            <div className="manage_item_buttons">
                <button className="btn btn_availability" onClick={() => {changeAvailability(item.id, !item.isAvailable)}}>Change Availability</button>
            </div>
            {error && (
                <div className="error_box">
                    <p className="error_box_title" style={{ fontSize: "1rem"}}>There was an error in updating the item: {error}</p>
                </div>
            )}
      </div>
    </div>

    <StaffFooter />
  </div>
  );
}