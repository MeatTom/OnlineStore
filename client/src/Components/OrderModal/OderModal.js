import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from 'react-modal';
import ModalStyle from './OderModal.module.scss';

function OrderModal({ products, onClose, isOpen }) {
    const [deliveryTypes, setDeliveryTypes] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [deliveryType, setDeliveryType] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [isUserRegistered, setIsUserRegistered] = useState(true);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    const fetchDeliveryTypes = async () => {
        try {
            const response = await axios.get("http://localhost:5000/delivery");
            setDeliveryTypes(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPaymentMethods = async () => {
        try {
            const response = await axios.get("http://localhost:5000/payment");
            setPaymentMethods(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeliveryTypeChange = (event) => {
        setDeliveryType(event.target.value);
    };

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleDeliveryAddressChange = (event) => {
        setDeliveryAddress(event.target.value);
    };

    const handlePlaceOrder = async () => {
        try {
            const orderData = {
                customerId: localStorage.getItem('userId'),
                deliveryTypeId: deliveryType,
                paymentMethodId: paymentMethod,
                deliveryAddress,
                total_price: calculateTotalPrice(),
                products,
            };

            await axios.post("http://localhost:5000/order", orderData);

            setIsOrderPlaced(true);
        } catch (error) {
            console.error(error);
        }
    };

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        products.forEach((product) => {
            totalPrice += product.price * product.amount;
        });
        return totalPrice;
    };

    useEffect(() => {
        fetchDeliveryTypes();
        fetchPaymentMethods();

        const userId = localStorage.getItem('userId');
        setIsUserRegistered(userId && userId !== "0");
    }, []);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Order Modal"
            className={ModalStyle.order_modal}
            overlayClassName={ModalStyle.order_modal_overlay}
        >
            <div>
                <svg className={ModalStyle.order_modal_close} onClick={onClose} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="white" stroke="#DBDBDB"/>
                    <path d="M20.0799 18.6155L17.6311 16.1667L20.0798 13.718C21.0241 12.7738 19.5596 11.3093 18.6154 12.2536L16.1667 14.7023L13.7179 12.2535C12.7738 11.3095 11.3095 12.7738 12.2535 13.7179L14.7023 16.1667L12.2536 18.6154C11.3093 19.5596 12.7738 21.0241 13.718 20.0798L16.1667 17.6311L18.6155 20.0799C19.5597 21.0241 21.0241 19.5597 20.0799 18.6155Z" fill="#B5B5B5"/>
                </svg>
                <div>
                    {!isUserRegistered ? (
                        <p className={ModalStyle.register_message}>
                            Только зарегистрированные пользователи могут оформить заказ. Пожалуйста, войдите в аккаунт или зарегистрируйтесь!
                        </p>
                    ) : isOrderPlaced ? (
                        <div>
                        <p className={ModalStyle.order_placed_message}>
                            Заказ успешно оформлен!
                        </p>
                        </div>
                    ) : (
                        <>
                            <h2>Checkout</h2>
                            <div className={ModalStyle.form_group}>
                                <label className={ModalStyle.label}>Delivery Type:</label>
                                <select
                                    value={deliveryType}
                                    onChange={handleDeliveryTypeChange}
                                    className={ModalStyle.select}
                                >
                                    <option value="">Выберите тип доставки</option>
                                    {deliveryTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={ModalStyle.form_group}>
                                <label className={ModalStyle.label}>Payment Method:</label>
                                <select
                                    value={paymentMethod}
                                    onChange={handlePaymentMethodChange}
                                    className={ModalStyle.select}
                                >
                                    <option value="">Выберите способ оплаты</option>
                                    {paymentMethods.map((method) => (
                                        <option key={method.id} value={method.id}>
                                            {method.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {deliveryType === "2" && (
                                <div className={ModalStyle.form_group}>
                                    <label className={ModalStyle.label}>Адрес доставки:</label>
                                    <input
                                        className={ModalStyle.input}
                                        type="text"
                                        value={deliveryAddress}
                                        onChange={handleDeliveryAddressChange}
                                    />
                                </div>
                            )}
                            <button onClick={handlePlaceOrder} className={ModalStyle.button}>
                                Заказать
                            </button>
                            <button onClick={onClose} className={ModalStyle.button}>
                                Отмена
                            </button>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default OrderModal;
