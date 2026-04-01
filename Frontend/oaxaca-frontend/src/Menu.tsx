import './css/Menu.css'
import { useEffect, useState } from 'react';
import { FaFire } from 'react-icons/fa';
import { LuWheatOff } from "react-icons/lu";
import { SiVega } from "react-icons/si";
import { FaLeaf } from "react-icons/fa";
import { GiMeat } from "react-icons/gi";
import { IoFilter } from "react-icons/io5";
import MenuItem from './data/components/MenuItem';
import NavBar from "./data/components/NavBar";
import Basket from './data/components/Basket';
import HelpWidget from "./data/components/Help_widget";
import Footer from "./data/components/Footer";
import { fetchMenu } from './api/menuApi';

export default function Menu() {

    //UI state
    const [showItem, setShowItem] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>({});
    const [showFilter, setShowFilter] = useState(false);

    //structore of a basket item
    type BasketItem = {
        item: MenuItemType;
        quantity: number;
    }

    const [basket, setBasket] = useState<BasketItem[]>([])

    //structure of a menu item
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

     // The MenuData contains the FOOD/DESSERT/DRINK as string and items as MenuItemType array
    type MenuData = Record<string, MenuItemType[]>;

    // Backend provides FOOD/DESSERT/DRINK. Frontend UI uses main/dessert/drinks.
    const [products, setProducts] = useState<MenuData>({ main: [], dessert: [], drinks: [] });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    //Fetches menu once the webpage is loaded
    useEffect(() => {
        async function loadMenu() {
        try {
            setLoading(true);
            setError("");

            const data = await fetchMenu()
            //convert the backend strucuture to frontend format
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

    //Filter state
    const [selectedAllergen, setSelectedAllergen] = useState<string>("");
    const [selectedDietFilter, setSelectedDietFilter] = useState<string>("");

    const [minPrice, setMinPrice] = useState<number | undefined>(undefined)
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)

    //Filtering logic
    function filterProducts(products: MenuData, selectedAllergen: string, selectedDietFilter: string, minPrice: any, maxPrice: any): MenuData {
        const result: MenuData = {};

        Object.entries(products).forEach(([category, items]) => {
            result[category] = items.filter((item) => {
                const filterSelectedAllergen =
                    !selectedAllergen ||
                    selectedAllergen === "None" ||
                    !item.allergens.includes(selectedAllergen);

                const filterSelectedDietFilter =
                    !selectedDietFilter ||
                    selectedDietFilter === "None" ||
                    item.filters.includes(selectedDietFilter);

                const filterMinPrice = minPrice == null || item.price >= minPrice;
                const filterMaxPrice = maxPrice == null || item.price <= maxPrice;

                return filterSelectedAllergen && filterSelectedDietFilter && filterMinPrice && filterMaxPrice;
            })
        })

        return result;
    }

    //Function is used to apply all filters
    const filteredProducts = filterProducts(products, selectedAllergen, selectedDietFilter, minPrice, maxPrice);

    //Array contains unique allergens
    const allergensArray: string[] = [];
    Object.values(products).map((items) => {
        items.forEach((item) => {
            item.allergens.forEach((allergen) => {
                if (!allergensArray.includes(allergen)) {
                    allergensArray.push(allergen)
                }
            })
        })
    })

    //Array contains unique dietary filters
    const filtersArray: string[] = [];
    Object.values(products).map((items) => {
        items.forEach((item) => {
            item.filters.forEach((filter) => {
                if (!filtersArray.includes(filter)) {
                    filtersArray.push(filter)
                }
            })
        })
    })

    //Loading UI
    if (loading) {
        return (
            <main className='menu_main'>
                <NavBar />
                <div className='menu_header'>
                    <h1 className='menu_page_title'>Menu</h1>
                    <hr className='menu_page_title_br' />
                </div>
                <div className='menu_layout'>
                    <div className='menu_content'>
                        <div>Loading menu...</div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    //Error UI
    if (error) {
        return (
            <main className='menu_main'>
                <NavBar />
                <div className='menu_header'>
                    <h1 className='menu_page_title'>Menu</h1>
                    <hr className='menu_page_title_br' />
                </div>
                <div className='menu_layout'>
                    <div className='menu_content'>
                        <div>Failed to load menu: {error}</div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className='menu_main'>
            <NavBar />

            <div className='menu_header'>
                <h1 className='menu_page_title'>Menu</h1>
                {/*Toggle the filter side bar*/}
                <IoFilter className='menu_page_filter' onClick={() => (setShowFilter(true))} />
                
                {/*Key for the icons shown on the menu items*/}
                <div className="menu_key">
                    <div className="menu_key_items">
                        <div className="menu_key_item">
                            <GiMeat className="meatIcon" />
                            <span>Meat</span>
                        </div>

                        <div className="menu_key_item">
                            <FaLeaf />
                            <span>Vegetarian</span>
                        </div>

                        <div className="menu_key_item">
                            <SiVega />
                            <span>Vegan</span>
                        </div>

                        <div className="menu_key_item">
                            <LuWheatOff />
                            <span>Gluten Free</span>
                        </div>
                    </div>
                </div>
                <hr className='menu_page_title_br' />
            </div>

            <div className='menu_layout'>
                <div className='menu_content'>

                    {/*Render each category*/}
                    {Object.entries(filteredProducts).map(([category, items]) => (
                        <section key={category}>
                            <h2 className='category_title'>
                                {category === "main" ? "Main" : category === "dessert" ? "Dessert" : "Drinks"}
                            </h2>

                            {items.length === 0 && (
                                <div>No items available</div>
                            )}

                            <div className='menu_items_div'>
                                {items.map((item) =>
                                    item.isAvailable && (
                                        //Menu item box
                                        <div key={item.id ?? item.name} className='menu_item'
                                            onClick={() => { setShowItem(true); setSelectedItem(item); }}>
                                            <img className='menu_item_image' src={item.image} alt={item.name} />
                                            <div className='menu_item_text'>
                                                <div className='menu_item_title'>
                                                    <h3>{item.name}</h3>
                                                    <div className='menu_item_filters'>
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
                                                
                                                {/*Calories*/}
                                                <div className='menu_item_calories'>
                                                    <FaFire className='calorie_icon' />
                                                    <p className='calorie_text'>{item.calories}kcal</p>
                                                </div>
                                                
                                                {/*Add item to basket*/}
                                                <div className='menu_item_add' onClick={(e) => {
                                                    e.stopPropagation();
                                                    setBasket(prevBasket => {
                                                        const existingItem = prevBasket.find((basketItem) =>
                                                            basketItem.item.name === item.name
                                                        )

                                                        if (existingItem) {
                                                            return prevBasket.map((basketItem) =>
                                                                basketItem.item.name === item.name
                                                                    ? { ...basketItem, quantity: basketItem.quantity + 1 }
                                                                    : basketItem
                                                            )
                                                        }

                                                        return [...prevBasket, { item, quantity: 1 }]
                                                    })
                                                }}>
                                                    <p className='menu_item_add_add'>Add</p>
                                                    <p className='menu_item_price'>£{item.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>)
                                )}
                            </div>
                        </section>
                    ))}
                </div>

                <Basket basket={basket} setBasket={setBasket} />
            </div>

            {/*Filter sidebar*/}
            {showFilter &&
                <div className='filter' onClick={() => (setShowFilter(false))}>
                    <button className="filter_close" onClick={() => (setShowFilter(false))}>x</button>
                    <div className='filter_container' onClick={(e) => (e.stopPropagation())}>
                        <div className='filter_title'>
                            <p>Filter</p>
                            <IoFilter />
                        </div>
                        <form>
                            <div>
                                {/*Allergen filter*/}
                                <div>
                                    <label className='filter_prompt'>Have any allergens?</label>
                                    <select
                                        value={selectedAllergen}
                                        onChange={(e) => setSelectedAllergen(e.target.value)}
                                    >
                                        <option value="">None</option>
                                        {allergensArray.map((allergen) => (
                                            <option key={allergen} value={allergen}>
                                                {allergen}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/*Dietary Requirements filter*/}
                                <div>
                                    <label className='filter_prompt'>Dietary Requirements</label>
                                    <select
                                        value={selectedDietFilter}
                                        onChange={(e) => setSelectedDietFilter(e.target.value)}
                                    >
                                        <option value="">None</option>
                                        {filtersArray.map((filter) => (
                                            <option key={filter} value={filter}>
                                                {filter}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/*Price filter*/}
                                <div>
                                    <label className='filter_prompt'>Price (£)</label>
                                    <div className='filter_price_inputs'>
                                        <input type="number" value={minPrice} className='filter_price_box' placeholder='Min'
                                            onChange={(e) => { const v = e.target.value; setMinPrice(v === "" ? undefined : Number(v)) }}
                                        />
                                        <input type="number" value={maxPrice} className='filter_price_box' placeholder='Max'
                                            onChange={(e) => { const v = e.target.value; setMaxPrice(v === "" ? undefined : Number(v)) }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            }

            {/*Detailed item view popup*/}
            {showItem && <MenuItem item={selectedItem} setBasket={setBasket} onClose={() => {
                setShowItem(false)
                setSelectedItem({})
            }} />}

            <HelpWidget />
            <Footer />
        </main>
    )
}
