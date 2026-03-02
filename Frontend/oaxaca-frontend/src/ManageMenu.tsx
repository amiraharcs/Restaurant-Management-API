import NavBarWaiter from "./data/components/NavBarWaiter";
import StaffFooter from "./data/components/StaffFooter";
import "./css/ManageMenu.css";
import mockAlertsData from "./data/mockAlertsData.json";
import { getTotalNotifications } from "./data/notificationCount.ts";
import { useState, useEffect } from "react";
import { fetchMenu } from './api/menuApi';
import { FaFire } from 'react-icons/fa';
import { LuWheatOff } from "react-icons/lu";
import { SiVega } from "react-icons/si";
import { FaLeaf } from "react-icons/fa";
import { GiMeat } from "react-icons/gi";
import StaffWelcome from "./data/components/StaffWelcome.tsx";
import EditItem from "./data/components/EditItem.tsx";


export default function ManageMenu() {
  const totalNotifications = getTotalNotifications(
    mockAlertsData.mockCallWaiterAlerts || [],
    mockAlertsData.mockOrdersReady || [],
  );

      const [showItem, setShowItem] = useState(false);
      const [selectedItem, setSelectedItem] = useState<any>({});
  
      type MenuItemType = {
          id?: number;
          name: string;
          description: string;
          price: number;
          calories: number;
          isAvailable: boolean;
          ingredients: string[];
          allergens: string[];
          filters: string[];
          image: string;
          itemType?: string;
      };
  
      type MenuData = Record<string, MenuItemType[]>; // category -> items
  
      // Backend provides FOOD/DESSERT/DRINK. Frontend UI uses main/dessert/drinks.
      const [products, setProducts] = useState<MenuData>({ main: [], dessert: [], drinks: [] });
      const [loading, setLoading] = useState<boolean>(true);
      const [error, setError] = useState<string>("");
  
      useEffect(() => {
          async function loadMenu() {
          try {
              setLoading(true);
              setError("");
  
              const data = await fetchMenu()
              const mapped: MenuData = {
                  main: data.FOOD ?? [],
                  dessert: data.DESSERT ?? [],
                  drinks: data.DRINK ?? []
              }
              setProducts(mapped)
          } catch (e: any) {
              setError(e?.message ?? "Failed to load menu")
          } finally {
              setLoading(false)
          }
      }
      loadMenu()
      }, []);

  return (
    <main className="">
      <NavBarWaiter notificationCount={totalNotifications} />
      
        <div className="manage_menu_page">
          <StaffWelcome />
          <div className="manage_menu">
            <div className='manage_menu_header'>
              <div className="manage_menu_header_row">
                <h1 className="manage_menu_page_title">Manage Menu</h1>

                <div className="manage_menu_actions">
                  <button className="manage_menu_btn add_btn">
                    Add Item
                  </button>

                  <button className="manage_menu_btn delete_btn">
                    Delete Item
                  </button>
                </div>
              </div>
                <hr className='manage_menu_page_title_br' />
            </div>
             <div className='manage_menu_layout'>
                <div className='manage_menu_content'>
                    {Object.entries(products).map(([category, items]) => (
                        <section key={category}>
                            <h2 className='category_title'>
                                {category === "main" ? "Main" : category === "dessert" ? "Dessert" : "Drinks"}
                            </h2>
                            {items.length === 0 && (
                                <div>No items available</div>
                            )}
                            <div className='manage_menu_items_div'>
                                {items.map((item) =>
                                    item.isAvailable && (
                                        <div key={item.id ?? item.name} className='manage_menu_item'
                                        onClick={() => { setShowItem(true); setSelectedItem(item); }}>
                                            <img className='manage_menu_item_image' src={item.image} alt={item.name} />
                                            <div className='manage_menu_item_text'>
                                                <div className='manage_menu_item_title'>
                                                    <h3>{item.name}</h3>
                                                    <div className='manage_menu_item_filters'>
                                                        {item.filters.map((filter, index) => (
                                                            <div key={index}>
                                                                {filter === "GlutenFree" &&
                                                                    <LuWheatOff />
                                                                }
                                                                {filter === "Vegan" &&
                                                                    <SiVega />
                                                                }
                                                                {filter === "Vegetarian" &&
                                                                    <FaLeaf />
                                                                }
                                                                {filter === "Meat" &&
                                                                    <GiMeat className="meatIcon" />
                                                                }
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="manage_menu_item_calories_price">
                                                  <div className='manage_menu_item_calories'>
                                                      <FaFire className='calorie_icon' />
                                                      <p className='calorie_text'>{item.calories}kcal</p>
                                                  </div>
                                                  <p className='manage_menu_item_price'>£{item.price.toFixed(2)}</p>
                                                </div>
          
                                                <div className='manage_menu_item_add'>
                                                    <p className='manage_menu_item_add_add'>Edit</p>
          
                                                </div>
                                            </div>
                                        </div>)
                                )}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {showItem && <EditItem item={selectedItem} onClose={() => {
                        setShowItem(false)
                        setSelectedItem({})
                    }} />}

      <StaffFooter />
    </main>
  );
}
