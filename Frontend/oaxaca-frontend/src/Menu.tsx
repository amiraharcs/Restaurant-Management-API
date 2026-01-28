import './css/Menu.css'
import menu from "./data/menu.json"

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
                                        <h3>{item.name}</h3>
                                        <p className='menu_item_filters'>{item.filters.join(", ")}</p>
                                        <p className='menu_item_price'>£{item.price}</p>
                                    </div>
                                </div>)
                        )}
                    </div>
                </section>
            ) )}
        </main>
    )
}