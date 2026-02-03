import './css/Menu.css'
import menu from "./data/menu.json"
import { FaFire } from 'react-icons/fa';
import { LuWheatOff } from "react-icons/lu";
import { SiVega } from "react-icons/si";

export default function Menu() {
    return (
        <main>
            <h1 className='menu_page_title'>Menu</h1>
            <hr className='menu_page_title_br' />
            {Object.entries(menu).map( ([category, items]) => (
                <section>
                    <h2 className='category_title'>{category}</h2>
                    
                    <div className='menu_items_div'>
                        {items.map( (item) => 
                                item.isAvailable && (
                                <div key={item.name} className='menu_item'>
                                    <img className='menu_item_image' src={item.image} alt={item.name} />
                                    <div className='menu_item_text'>
                                        <div className='menu_item_title'>
                                            <h3>{item.name}</h3>
                                            <div className='menu_item_filters'>{item.filters.map( (filter, index) => (
                                            <div key={index}>
                                                {filter === "GlutenFree" && 
                                                     <LuWheatOff />
                                                }
                                                {filter === "Vegan" && 
                                                    <SiVega />
                                                }
                                            </div>
                                        ))}</div>
                                        </div>
                                        <div className='menu_item_calories'>
                                            <FaFire className='calorie_icon'/>
                                            <p className='calorie_text'>{item.calories}kcal</p>
                                        </div>
                                        <div className='menu_item_add'>
                                            <p className='menu_item_add_add'>Add</p>
                                            <p className='menu_item_price'>£{item.price}</p>
                                        </div>
                                    </div>
                                </div>)
                        )}
                    </div>
                </section>
            ) )}
        </main>
    )
}