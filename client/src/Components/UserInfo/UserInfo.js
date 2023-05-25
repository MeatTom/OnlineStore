import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from "react-modal";
import ModalStyle from "../UserInfo/UserInfo.module.scss";
import InputMask from 'react-input-mask';

const UserInfo = ({ isOpen, onClose }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    const [userOrders, setUserOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId')
        setUser(null);
        onClose(false);
    };

    const fetchUserOrders = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`http://localhost:5000/orders/${userId}`);
            setUserOrders(response.data.orders);
        } catch (error) {
            console.error('Ошибка при получении заказов пользователя:', error.response.data.message);
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                if (isAuthenticated && token) {
                    const response = await axios.get(`http://localhost:5000/auth/profile`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    const userData = response.data;
                    setUser(userData);

                    localStorage.setItem('userId', userData.id);
                }
            } catch (error) {
                console.error('Ошибка при получении информации о пользователе:', error.response.data.error);
            }
            fetchUserOrders();
        };

        fetchUserInfo();
    }, [isAuthenticated]);

    const handleClose = () => {
        onClose();
    }

    const handleEdit = () => {
        setEditMode(true);
        setNewName(user.name);
        setNewEmail(user.email);
        setNewPhone(user.phone);
    }

    const handleEditClose = () => {
        setEditMode(false);
    }

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            const response = await axios.put(
                `http://localhost:5000/users/${userId}`,
                {
                    name: newName,
                    email: newEmail,
                    phone: newPhone,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const updatedUser = response.data;

            setUser(updatedUser);
            setEditMode(false);
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error.response.data.error);
        }
    }

    return (
        <Modal isOpen={isOpen} contentLabel="Size Modal" className={ModalStyle.user_modal}
               overlayClassName={ModalStyle.user_modal_overlay}>
            <div>
                <svg className={ModalStyle.auth_button_close} onClick={handleClose} width="15" height="25"
                     viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M9.0799 7.61553L6.6311 5.16673L9.07982 2.71801C10.0241 1.77376 8.55964 0.309342 7.61539 1.25359L5.16668 3.70231L2.71787 1.2535C1.77384 0.309466 0.309467 1.77384 1.2535 2.71787L3.70231 5.16668L1.25359 7.61539C0.309343 8.55964 1.77376 10.0241 2.71801 9.07982L5.16673 6.6311L7.61553 9.0799C8.55969 10.0241 10.0241 8.55969 9.0799 7.61553Z"
                        fill="#B5B5B5" />
                </svg>
                <h1 className={ModalStyle.user_info_title}>Данные о пользователе:</h1>
                {user ? (
                    <div>
                        {editMode ? (
                            <div>
                                <label>
                                    Имя:
                                    <input className={ModalStyle.user_info_name} type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
                                </label>
                                <br />
                                <label>
                                    Email:
                                    <input type="email" value={newEmail} className={ModalStyle.user_info_email} onChange={(e) => setNewEmail(e.target.value)} />
                                </label>
                                <br />
                                <label>
                                    Телефон:
                                    <InputMask
                                        mask="+7 (999) 999-99-99"
                                        maskChar=" "
                                        value={newPhone}
                                        onChange={(e) => setNewPhone(e.target.value)}
                                    >
                                        {(inputProps) => <input className={ModalStyle.user_info_phone} type="text" {...inputProps} />}
                                    </InputMask>
                                </label>
                                <br />
                                <button className={ModalStyle.user_info_save_button} onClick={handleSave}>Применить изменения</button>
                                <button className={ModalStyle.user_info_save_button} onClick={handleEditClose}>Отмена</button>
                            </div>
                        ) : (
                            <div>
                                <p className={ModalStyle.user_info_text}>Имя: {user.name}</p>
                                <p className={ModalStyle.user_info_text}>Email: {user.email}</p>
                                <p className={ModalStyle.user_info_text}>Телефон: {user.phone ? user.phone : 'нет номера телефона'}</p>
                                <button className={ModalStyle.user_info_edit_button} onClick={handleEdit}>Редактировать данные</button>
                            </div>
                        )}
                        <h2 className={ModalStyle.user_order_title}>Заказы:</h2>
                        <div className={ModalStyle.user_info_orders} style={{ maxHeight: '450px', overflow: 'auto' }}>
                            {userOrders.map((order) => (
                                <div key={order.id} className={ModalStyle.user_info_order}>
                                    <p className={ModalStyle.user_info_order_date}>Дата заказа: {order.createdAt}</p>
                                    <p className={ModalStyle.user_info_order_total}>Сумма заказа: {order.total_price}$</p>
                                    <p className={ModalStyle.user_info_order_items}>Товары:</p>
                                    <ul className={ModalStyle.user_info_order_items}>
                                        {order.orderTovars.map((orderTovar) => (
                                            <li key={orderTovar.id} className={ModalStyle.user_info_order_item}>
                                                <span className={ModalStyle.user_info_order_item_name}>{orderTovar.tovar.name}</span>
                                                <span className={ModalStyle.user_info_order_item_details}>
                                                Размер: {orderTovar.size.size_name}, Количество: {orderTovar.amount}
                                            </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <button className={ModalStyle.user_info_logout_button} onClick={handleLogout}>Выйти</button>
                    </div>
                ) : (
                    <p className={ModalStyle.user_info_loading}>Загрузка...</p>
                )}
            </div>
        </Modal>
    );
}

export default UserInfo;
