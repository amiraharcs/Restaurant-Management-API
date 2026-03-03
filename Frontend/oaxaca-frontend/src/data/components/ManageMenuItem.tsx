import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMenuItemById } from "../../api/menuApi";
import NavBarWaiter from "./NavBarWaiter";
import StaffFooter from "./StaffFooter";

export default function ManageMenuItem() {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    async function loadItem() {
      const data = await fetchMenuItemById(Number(id));
      setItem(data);
    }
    loadItem();
  }, [id]);

  if (!item) return <p>Loading...</p>;

  return (
  <div className="manage_item_page">
    <NavBarWaiter />

    <div className="manage_item_content">
      <div className="manage_item_card">
        <h1 className="manage_item_title">{item.name}</h1>

        <img
          className="manage_item_image"
          src={item.image}
          alt={item.name}
        />

        <p className="manage_item_description">{item.description}</p>

        <div className="manage_item_meta">
          <p>£{Number(item.price).toFixed(2)}</p>
          <p>{item.calories} kcal</p>
        </div>
      </div>
    </div>

    <StaffFooter />
  </div>
  );
}