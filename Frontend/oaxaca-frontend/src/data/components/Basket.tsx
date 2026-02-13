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

    type BasketItem = {
        item : MenuItem;
        quantity: number;
    }

export default function Basket({basket, setBasket} : any ) {

    return (
        <aside className="basket">
            <div className='basket_main'>
                <div className="basket_title">
                    <h3>Basket</h3>
                    <FaBasketShopping />
                </div>
                <div className="basket_content">
                    {basket.length === 0 ? 
                    ( 
                    <div className="basket_empty">
                        <p>Your Basket is Empty</p>
                        <FaBasketShopping className="basket_empty_icon"/>
                    </div>
                    ) 
                    : 
                    (
                        <div className="basket_items">
                            {basket.map((basketItem : BasketItem, i : number) => (
                            <div className='basket_item'>
                                <img src={basketItem.item.image} alt={basketItem.item.name} className='basket_item_image'/>
                                <div className="basket_item_text">
                                    <p className="basket_item_name">{basketItem.item.name}</p>
                                    <div className="basket_item_price_quantity_div">
                                        <p className="basket_item_price">£{basketItem.item.price * basketItem.quantity}</p>
                                        <div className="basket_item_quantity_div">
                                            <button className='basket_item_quantity_change' onClick={() => {setBasket( (prevBasket : BasketItem[]) => {
                                                return prevBasket.map( (prevBasketItem : BasketItem) =>
                                                prevBasketItem.item.name === basketItem.item.name ? {...prevBasketItem, quantity: prevBasketItem.quantity - 1} : prevBasketItem
                                                )
                                                .filter( (prevBasketItem) => prevBasketItem.quantity > 0)
                                            })}}
                                            >-</button>
                                            <p className="basket_item_quantity">{basketItem.quantity}</p>
                                            <button className='basket_item_quantity_change' onClick={() => (setBasket( (prevBasket : BasketItem[]) => {
                                                return prevBasket.map( (prevBasketItem : BasketItem) =>
                                                prevBasketItem.item.name === basketItem.item.name ? {...prevBasketItem, quantity: prevBasketItem.quantity + 1} : prevBasketItem
                                                )
                                            }))}
                            
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ))}
                            <button className="basket_checkout">Checkout</button>
                        </div>
                    )}

                </div>
            </div>
        </aside>
    )
}