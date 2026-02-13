import { FaBasketShopping } from "react-icons/fa6";

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

    type BasketType = {basket: MenuItem[]};

export default function Basket({basket}:BasketType) {

    return (
        <aside className="basket">
            <div className='basket_main'>
                <div className="basket_title">
                    <h3>Basket</h3>
                    <FaBasketShopping />
                </div>
                <div className="basket_items">
                    {basket.length === 0 ? ( <p>Empty</p>) : 
                    (
                        basket.map((item, i) => (
                        <div className='basket_item'>
                            <img src={item.image} alt={item.name} className='basket_item_image'/>
                            <p>{item.name}</p>
                        </div>
                        ))
                    )}
                </div>
            </div>
        </aside>
    )
}