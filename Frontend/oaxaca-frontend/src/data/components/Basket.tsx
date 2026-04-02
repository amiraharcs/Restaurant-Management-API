import { FaBasketShopping } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

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

export default function Basket({basket, setBasket} : any ) {

    const navigate = useNavigate();

    //Calculate total value of items added to basket
    const total = basket.reduce((sum : number, basketItem : BasketItem) => 
    sum + basketItem.item.price * basketItem.quantity, 0
    );

    return (
        <aside className="basket">
            <div className='basket_main'>
                <div className="basket_title">
                    <h3>Basket</h3>
                    <FaBasketShopping />
                </div>
                <div className="basket_content">
                    {/*Shown if the basket is empty*/}
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
                            {basket.map((basketItem : BasketItem) => (
                            <div className='basket_item' key={basketItem.item.name}>
                                <img src={basketItem.item.image} alt={basketItem.item.name} className='basket_item_image'/>
                                <div className="basket_item_text">
                                    <p className="basket_item_name">{basketItem.item.name}</p>
                                    <div className="basket_item_price_quantity_div">
                                        <p className="basket_item_price">£{(basketItem.item.price * basketItem.quantity).toFixed(2)}</p>
                                        <div className="basket_item_quantity_div">
                                            {/* Decrease quantity, remove item if it reaches 0 */}
                                            <button className='basket_item_quantity_change' onClick={() => {setBasket( (prevBasket : BasketItem[]) => {
                                                return prevBasket.map( (prevBasketItem : BasketItem) =>
                                                prevBasketItem.item.name === basketItem.item.name ? {...prevBasketItem, quantity: prevBasketItem.quantity - 1} : prevBasketItem
                                                )
                                                .filter( (prevBasketItem) => prevBasketItem.quantity > 0)
                                            })}}
                                            >-</button>
                                            <p className="basket_item_quantity">{basketItem.quantity}</p>
                                            {/* Increase quantity*/}
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
                            {/* Basket total */}
                            <p className="basket_total">Total: <span className="basket_total_span">£{total.toFixed(2)}</span></p>
                            {/*Take user to order page and pass basket data*/}
                            <button className="basket_checkout" onClick={() => {navigate("/order", {state: { basket } })}}>Checkout</button>
                        </div>
                    )}

                </div>
            </div>
        </aside>
    )
}