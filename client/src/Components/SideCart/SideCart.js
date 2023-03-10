import style from './SideCart.module.scss'
import React from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
function SideCart ({onClosedCart}) {

    const [items, setItems] = React.useState([]);

    React.useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get('http://localhost:5000/show_cart');
                setItems(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCartItems();
    }, []);

    const cartItemDelete = async (id) => {
        console.log((id))
        try {
            await axios.delete(`http://localhost:5000/show_cart/delete/${id}`);
            // Обновляем состояние корзины
            setItems(prevItems => prevItems.filter(prevItem => prevItem.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const decrementCartItem = async (itemId) => {
        try {
            await axios.put(`http://localhost:5000/show_cart/decrement/${itemId}`);

            // Если количество товара меньше или равно 1, удаляем товар из корзины
            if (items.find(item => item.id === itemId)?.amount <= 1) {
                setItems(prevItems => prevItems.filter(prevItem => prevItem.id !== itemId));
            } else {
                // Иначе обновляем количество товара в корзине
                setItems(prevItems => prevItems.map(prevItem => prevItem.id === itemId ? {...prevItem, amount: prevItem.amount - 1} : prevItem));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const incrementCartItem = async (itemId) => {
        try {
            await axios.put(`http://localhost:5000/show_cart/increment/${itemId}`);
            setItems((prevItems) =>
                prevItems.map((prevItem) => {
                    if (prevItem.id === itemId) {
                        return {
                            ...prevItem,
                            amount: prevItem.amount + 1,
                        };
                    }
                    return prevItem;
                })
            );
        } catch (error) {
            console.error(error);
        }
    };


    return(
        <div className={style.sideCart}>
            <div className={style.drawer_shadow}>
                <div className={style.drawer}>
                    <div className={style.drawer_line}></div>
                    <div className={style.closeCart}>
                        <svg onClick={onClosedCart} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="white" stroke="#DBDBDB"/>
                            <path d="M20.0799 18.6155L17.6311 16.1667L20.0798 13.718C21.0241 12.7738 19.5596 11.3093 18.6154 12.2536L16.1667 14.7023L13.7179 12.2535C12.7738 11.3095 11.3095 12.7738 12.2535 13.7179L14.7023 16.1667L12.2536 18.6154C11.3093 19.5596 12.7738 21.0241 13.718 20.0798L16.1667 17.6311L18.6155 20.0799C19.5597 21.0241 21.0241 19.5597 20.0799 18.6155Z" fill="#B5B5B5"/>
                        </svg>
                    </div>
                    <h1>Корзина</h1>
                    <div className={style.cartItems}>
                            {items.map((item) => (
                                <div key={uuidv4()} className={style.cartItem}>
                                    <img src={item.image} alt="sock" width={200}/>
                                <p>{item.name}<b>Price: {item.price}</b>Amount:
                                    <button onClick={() => decrementCartItem(item.id)}>-</button>
                                    {item.amount}
                                    <button onClick={() => incrementCartItem(item.id)}>+</button>
                                </p>
                                <svg className={style.delButton} onClick={() => cartItemDelete(item.id)} width="25" height="25" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.0799 7.61553L6.6311 5.16673L9.07982 2.71801C10.0241 1.77376 8.55964 0.309342 7.61539 1.25359L5.16668 3.70231L2.71787 1.2535C1.77384 0.309466 0.309467 1.77384 1.2535 2.71787L3.70231 5.16668L1.25359 7.61539C0.309343 8.55964 1.77376 10.0241 2.71801 9.07982L5.16673 6.6311L7.61553 9.0799C8.55969 10.0241 10.0241 8.55969 9.0799 7.61553Z" fill="#B5B5B5"/>
                                </svg>
                                </div>
                                ))
                            }
                    </div>
                    <div className={style.bottomCart}>
                        <p>Итоговая сумма: <b> $ 30</b></p>
                        <div className={style.CheckoutButton}>
                            <img src="/statics/Checkout_Icon.png" alt="checkout"/>
                            <p>Checkout</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideCart