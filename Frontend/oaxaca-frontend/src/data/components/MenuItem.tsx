import "../../css/Menu.css"
import { FaFire } from 'react-icons/fa';
import { LuWheatOff } from "react-icons/lu";
import { SiVega } from "react-icons/si";
import { FaLeaf } from "react-icons/fa";

export default function MenuItem({item, onClose}: any) {
    return (
        <div className="menu_item_main">
            <div className="menu_item_main_backdrop">

            </div>
            <div className="menu_item_main_content">
                <button className="menu_item_main_close" onClick={onClose}>x</button>
                <div className="menu_item_main_left">
                    
                    <img src={item.image} alt="" className="menu_item_main_img"/>
                    <div className='menu_item_main_calories'>
                        <FaFire className='calorie_icon'/>
                        <p className='calorie_text'>{item.calories}kcal</p>
                    </div>

                </div>
                <div className="menu_item_main_right">
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
                        </div>
                    ))}</div>
                    <p className="menu_item_main_name">{item.name}</p>
                    <p>{item.description}</p>
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

                    <div className='menu_item_main_add'>
                        <p className='menu_item__main_add_add'>Add</p>
                        <p className='menu_item__main_price'>£{item.price}</p>
                    </div>
                </div>
            </div>
            
        </div>
    )
}