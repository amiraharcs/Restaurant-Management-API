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
import NavBarManager from "./NavBarManager";

export default function ManageMenuItemManager() {
    const navigate = useNavigate();


  const { id } = useParams();
  const [item, setItem] = useState<any>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    try {
        await deleteMenuItem(item.id);
        setShowDeleteConfirm(false);
        navigate("/manage-menu-manager");
    } catch (error : any) {
        setError(error.message || "Failed to delete item. Please try again.");
    }
};

  useEffect(() => {
    async function loadItem() {
      const data = await fetchMenuItemById(Number(id));
      setItem(data);
      console.log(data)
    }
    loadItem();
    
  }, [id]);

    const [showItem, setShowItem] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>({});

  if (!item) return <p>Loading...</p>;

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
    <NavBarManager />

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
            <div className="manage_item_price_calories">
                <p className="manage_item_calories">{item.calories} kcal</p>
                <p className="manage_item_price">£{Number(item.price).toFixed(2)}</p>
            </div>
            <p className="manage_item_costToProduce">Cost To Procude: £{Number(item.costToProduce).toFixed(2)}</p>
            <div className="manage_item_buttons">
                <button className="btn btn_edit" onClick={() => {changeAvailability(item.id, !item.isAvailable)}}>Change Availability</button>
            </div>
            <div className="manage_item_buttons">
                <button className="btn btn_edit" onClick={() => { setShowItem(true); setSelectedItem(item); }}>Edit</button>
                <button className="btn btn_delete" onClick={() => {setShowDeleteConfirm(true)}}>Delete</button>
            </div>
            {error && (
                <div className="error_box">
                    <p className="error_box_title" style={{ fontSize: "1rem"}}>There was an error in updating the item: {error}</p>
                </div>
            )}
      </div>
    </div>

    <StaffFooter />

    {showItem && <EditItem item={selectedItem} onClose={() => {
                setShowItem(false)
                setSelectedItem({})
            }} />}

    {showDeleteConfirm && (
    <div className="confirm_delete_main">
        <div className="confirm_delete_main_backdrop" onClick={() => {setShowDeleteConfirm(false)}}></div>
        <div className="confirm_delete_main_content">
            <button
                className="confirm_delete_main_close"
                onClick={() => {setShowDeleteConfirm(false)}}
            >
                x
            </button>
            <h3 className="confirm_delete_main_title">Confirm Delete</h3>
            <p>Are you sure you want to delete this item?</p>
            <p className="delete-warning">This action cannot be undone.</p>
            <div className="confirm_delete_buttons">
                <button 
                    className="btn_cancel"
                    onClick={() => {setShowDeleteConfirm(false)}}
                >
                    Cancel
                </button>
                <button 
                    className="btn_delete_confirm"
                    onClick={handleConfirmDelete}
                >
                    Yes, Delete
                </button>
            </div>
            {error && (
                <div className="error_box">
                    <p className="error_box_title" style={{ fontSize: "1rem"}}>There was an error in deleting the item: {error}</p>
                </div>
            )}
        </div>
    </div>
)}
  </div>
  );
}