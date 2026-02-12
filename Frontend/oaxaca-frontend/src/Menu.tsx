import './css/Menu.css'
import menu from "./data/menu.json"
import { useState } from 'react';
import { FaFire } from 'react-icons/fa';
import { LuWheatOff } from "react-icons/lu";
import { SiVega } from "react-icons/si";
import { FaLeaf } from "react-icons/fa";
import { GiMeat } from "react-icons/gi";
import { IoFilter } from "react-icons/io5";
import MenuItem from './data/components/MenuItem';
import NavBar from "./data/components/NavBar";


export default function Menu() {

    const [showItem, setShowItem] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [showFilter, setShowFilter] = useState(false);

    const allergensArray: string[] = [];

    Object.values(menu).map((items) => {
        items.forEach( (item) => {
            item.allergens.forEach ( (allergen) => {
                if (!allergensArray.includes(allergen)) {
                    allergensArray.push(allergen)
                }
            })
        })
    })

    const filtersArray: string[] = [];

    Object.values(menu).map((items) => {
        items.forEach( (item) => {
            item.filters.forEach ( (filter) => {
                if (!filtersArray.includes(filter)) {
                    filtersArray.push(filter)
                }
            })
        })
    })

    return (
        <main>
            <NavBar />

            <div className='menu_header'>
                <h1 className='menu_page_title'>Menu</h1>
                <IoFilter className='menu_page_filter' onClick={() => (setShowFilter(true))}/>
                <hr className='menu_page_title_br'/>
            </div>
            
            {Object.entries(menu).map( ([category, items]) => (
                <section>
                    <h2 className='category_title'>{category}</h2>
    
                    <div className='menu_items_div'>
                        {items.map( (item) => 
                                item.isAvailable && (
                                <div key={item.name} className='menu_item' onClick={() => {setShowItem(true); setSelectedItem(item);}}>
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
                                                {filter === "Vegetarian" &&
                                                    <FaLeaf />
                                                }
                                                {filter === "Meat" &&
                                                    <GiMeat className="meatIcon"/>
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
            {showFilter && 
            <div className='filter'>
                <button className="filter_close" onClick={() => (setShowFilter(false))}>x</button>
                <div className='filter_container'>
                    <div className='filter_title'>
                        <p>Filter</p>
                        <IoFilter />
                    </div>
                    <form action="" className=''>
                        <div>
                            <label htmlFor="" className='filtern_title'>Have any allergens?</label>
                            <select name="allergens">
                            <option value="" className='fitler_option'>None</option>
                            {allergensArray.map( (allergen) => (
                                <option value={allergen} className='fitler_option'>{allergen}</option>
                                )
                            )}
                            </select>
                            <label htmlFor="" className='filtern_title'>Dietary Requirements</label>
                            <select name="allergens">
                            <option value="" className='fitler_option'>None</option>
                            {filtersArray.map( (filter) => (
                                <option value={filter} className='fitler_option'>{filter}</option>
                                )
                            )}
                            </select>
                        </div>

                        <div className='filter_apply_box'>
                            <button className='filter_apply'>Apply</button>
                        </div>
                    </form>
                </div>
            </div>


            }

            {showItem && <MenuItem item={selectedItem} onClose={() => {
                setShowItem(false)
                setSelectedItem({})
            }}/>}
        </main>
    )
}