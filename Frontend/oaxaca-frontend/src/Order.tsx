import { useLocation } from "react-router-dom"

export default function Order() {

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

    const location = useLocation();
    const basket = location.state?.basket;

    return (
        <div>
            <p>Hello, this is the order page</p>
            <p>{basket.map((basketItem : BasketItem) => (
                <p>{basketItem.item.name}</p>
            ))}</p>
        </div>
    )
}