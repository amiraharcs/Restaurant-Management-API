import "../../css/Menu.css"
import { FaFire } from 'react-icons/fa';
import { LuWheatOff } from "react-icons/lu";
import { SiVega } from "react-icons/si";
import { FaLeaf } from "react-icons/fa";
import { GiMeat } from "react-icons/gi";

    //Structure of a menu item
    type MenuItem = {
        name: string;
        description: string;
        price: number;
        calories: number;
        isAvailable: boolean;
        ingredients: string[];
        allergens: string[];
        filters: string[];
        image: string;
    };

    //Structure of a basket item
    type BasketItem = {
        item : MenuItem;
        quantity: number;
    }

export default function MenuItem({item, setBasket, onClose}: any) {
    return (
        //Close popup when clicking outside box
        <div className="menu_item_main" onClick={onClose}>
            <div className="menu_item_main_backdrop">

            </div>
            <div className="menu_item_main_content" onClick={(e) => e.stopPropagation()}>
                
                {/*The left side of popup shows image and calories*/}
                <div className="menu_item_main_left">
                    
                    <img src={item.image} alt="" className="menu_item_main_img"/>
                    <div className='menu_item_main_calories'>
                        <FaFire className='calorie_icon'/>
                        <p className='calorie_text'>{item.calories}kcal</p>
                    </div>

                </div>

                {/*The right side of popup shows item detilas like name, description, ingredients, allergens, price*/}
                <div className="menu_item_main_right">
                    <button className="menu_item_main_close" onClick={onClose}>x</button>

                    {/*Dietary filter icons */}
                    <div className='menu_item_main_filters'>{item.filters.map( (filter: String, index: number) => (
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
                    ))}</div>

                    <p className="menu_item_main_name">{item.name}</p>
                    <p>{item.description}</p>

                    {/* Ingredients list */}
                    <div className="menu_item_main_box">
                        <p className="menu_item_main_box_title">Ingredients</p>
                         <div className="menu_item_main_box_list">
                            {item.ingredients.map((ingredient: String, index: number) => (
                                <p key={index} className="menu_item_main_box_list_item">
                                    {ingredient}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Allergens list */}
                    <div className="menu_item_main_box">
                        <p className="menu_item_main_box_title">Allergens</p>
                         <div className="menu_item_main_box_list">
                            {item.allergens.map((allergen: String, index: number) => (
                                <p key={index} className="menu_item_main_box_list_item">
                                    {allergen}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Add item to basket */}
                    <div className='menu_item_main_add' onClick={() => {
                            setBasket( (prevBasket : BasketItem[]) => {
                                const existingItem = prevBasket.find( (basketItem) => 
                                    basketItem.item.name === item.name
                                )

                                if (existingItem) {
                                    return prevBasket.map( (basketItem) => 
                                    basketItem.item.name === existingItem.item.name ? {...basketItem, quantity: basketItem.quantity + 1} : basketItem
                                    )
                                }
                                return [...prevBasket, {item, quantity: 1}]
                            })
                            onClose()
                        }}
                        >
                        <p className='menu_item__main_add_add'>Add</p>
                        <p className='menu_item__main_price'>£{item.price.toFixed(2)}</p>
                    </div>
                </div>
            </div>
            
        </div>
    )
}