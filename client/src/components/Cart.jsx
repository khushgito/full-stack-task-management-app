import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";

export default function Cart({ menuItems }) {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.items);

    return (
        <div>
            <h2>Menu</h2>
            <ul>
                {menuItems.map((item) => (
                    <li key={item.id}>
                        {item.name} - ${item.price}
                        <button onClick={() => dispatch(addToCart(item))}>
                            Add to Cart
                        </button>
                    </li>
                ))}
            </ul>
            <h2>Cart</h2>
            <ul>
                {cart.map((item) => (
                    <li key={item.id}>
                        {item.name} - ${item.price} x {item.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
}
