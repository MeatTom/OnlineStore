import React, { useState } from 'react';
import { useGetUserInfoQuery, useGetUserOrdersQuery, useUpdateUserPasswordMutation, useUpdateUserInfoMutation, useSendCodeMutation, useCancelOrderMutation } from '../../Services/socksApi';
import ModalStyle from "../UserInfo/UserInfo.module.scss";
import InputMask from 'react-input-mask';
import Header from "../Header/header";
import SideCart from "../SideCart/SideCart";
import { useNavigate } from "react-router-dom";
import ReactCodeInput from "react-code-input";
import Loading from "../Loading/Loading";
import { useNotification } from '../Notification/Notification';

const props = {
    inputStyle: {
        fontFamily: 'monospace',
        marginRight:  '5px',
        marginBottom:  '12px',
        MozAppearance: 'textfield',
        minWidth: '5%',
        maxWidth: '15%',
        borderRadius: '3px',
        fontSize: '15px',
        height: '35px',
        paddingLeft: '5px',
        backgroundColor: 'white',
        color: '#ff795e',
        border: '1px solid #ea9682'
    }
}

const UserInfo = () => {
    const [cartIsOpen, setCartIsOpen] = useState(false);
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [emailVerification, setEmailVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [nameValMessage, setNameValMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [emailValMessage, setEmailValMessage] = useState('');
    const [phoneValMessage, setPhoneValMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [passwordValMessage, setPasswordValMessage] = useState('');
    const [changePasswordMode, setChangePasswordMode] = useState(false);
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
    const { addNotification } = useNotification();
    const { data: user, isLoading: isLoadingUser, isError } = useGetUserInfoQuery();
    const { data: orders , isLoading: isLoadingOrders } = useGetUserOrdersQuery();
    const [updatePassword] = useUpdateUserPasswordMutation();
    const [updateUserInfo] = useUpdateUserInfoMutation();
    const [sendCode] = useSendCodeMutation();
    const [cancelOrder] = useCancelOrderMutation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate("/");
    };

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token && !isLoadingUser) {
            navigate('/');
        }
    }, [isLoadingUser, navigate]);

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleClose = () => {
        navigate("/");
    }

    const handleEdit = () => {
        setEditMode(true);
        setNewName(user.name);
        setNewEmail(user.email);
        setNewPhone(user.phone);
    }

    const handleNameChange = (e) => {
        const value = e.target.value;
        const trimmedValue = value.trim();
        setNewName(value);

        const isValidName = /^[а-яА-Яa-zA-Z\- ]{3,}$/.test(trimmedValue);

        setNameValMessage(
            !isValidName
                ? 'Неверный формат имени. Имя может содержать кириллицу, латиницу, тире и пробел'
                : trimmedValue.length < 3
                    ? 'Имя должно содержать как минимум 3 символа'
                    : ''
        );
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        const cleanedValue = value.replace(/[\s-]+/g, '');

        setNewPhone(value);

        const isValidPhone = cleanedValue.length === 14;

        setPhoneValMessage(
            cleanedValue.length >= 2
                ? !isValidPhone
                    ? 'Некорректный формат номера телефона. Введите полный номер по маске.'
                    : ''
                : ''
        );
    };

    const handleEditClose = () => {
        setEditMode(false);
    }

    const handleSave = async () => {
        try {
            await updateUserInfo({
                name: newName,
                email: newEmail,
                phone: newPhone,
                code: verificationCode,
            }).unwrap();

            setEditMode(false);
            setEmailVerification(false);
            setVerificationCode('');
            setErrorMessage('');
        } catch (error) {
            console.error('Ошибка при обновлении пользователя:', error);
            setErrorMessage('Ошибка при обновлении пользователя. Убедитесь, что код подтверждения верен.');
        }
    };

    const handleChangePassword = async () => {
        try {
            await updatePassword({ currentPassword, newPassword }).unwrap();
            setPasswordChangeSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setPasswordValMessage('');
        } catch (error) {
            console.error('Ошибка при смене пароля:', error);
            setPasswordValMessage('Ошибка при смене пароля. Убедитесь, что текущий пароль верен.');
        }
    };

    const handleSendCode = async () => {
        if (!validateEmail(newEmail)) {
            setEmailValMessage('Пожалуйста, введите корректный email');
            return;
        }
        try {
            await sendCode(newEmail).unwrap();
                setEmailVerification(true);
                setEmailValMessage('');
        } catch (error) {
            if (error.status === 400 && error.data.error === 'Пользователь с таким email уже существует') {
                setEmailValMessage('Аккаунт с данным email уже зарегистрирован.');
            } else {
                console.error('Ошибка при отправке кода подтверждения:', error.response.data.error);
                setEmailValMessage('Аккаунт с данным email уже зарегистрирован.');
            }
        }
    }

    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);

        const isValidPassword = value.length >= 5 && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\d\s:])[A-Za-z\d^\w\d\s:]+$/.test(value);

        setPasswordValMessage(
            value && !isValidPassword
                ? 'Пароль должен содержать не менее 5 символов, хотя бы одну латинскую букву, одну цифру и один специальный символ'
                : ''
        );
    };


    const handleCodeChange = (verificationCode) => {
        setVerificationCode(verificationCode);
        setErrorMessage('');
    };

    const handleCancelVerification = () => {
        setEmailVerification(false);
        setVerificationCode('');
    }

    const formatUpdatedAt = (updatedAt) => {
        const date = new Date(updatedAt);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    const handleOpenCart = () => {
        setCartIsOpen(true);
    };

    const handleCancelPasswordChange = () => {
        setChangePasswordMode(false);
        setCurrentPassword('');
        setNewPassword('');
        setPasswordValMessage('');
    };


        const handleCancelOrder = async (id) => {
            try {
                await cancelOrder(id).unwrap();
            } catch (error) {
                addNotification('Ошибка добавления товара в корзину! Необходимо войти в аккаунт.', 'error');
                console.error(error);
            }
        };


    if (isLoadingUser || isLoadingOrders || isError) {
        return (
            <div className={ModalStyle.user_modal}>
                <Header isLoading={isLoadingUser} isError={isError}/>
                <Loading/>
            </div>
        );
    }

    const handleAdminPanel = () => {
        window.location.href = process.env.REACT_APP_URL_ADMIN;
    };


    return (
        <div className={ModalStyle.user_modal}>
            <Header onClickedCart={handleOpenCart}/>
            {cartIsOpen && <SideCart onClosedCart={() => setCartIsOpen(false)}/>}
            {user.isAdmin && (
                <div className={ModalStyle.admin_button_container}>
                    <button className={ModalStyle.admin_panel_button} onClick={handleAdminPanel}>
                        Перейти в административную панель
                    </button>
                </div>
                )}
            <div className={ModalStyle.user_title_container}>
                <svg className={ModalStyle.auth_button_close} onClick={handleClose} width="35" height="35"
                     viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M13 9.00003L10.2121 11.7879C10.095 11.9051 10.095 12.095 10.2121 12.2122L13 15M21 17V7.00003C21 4.79089 19.2091 3.00003 17 3.00003H7C4.79086 3.00003 3 4.79089 3 7.00003L3 17C3 19.2092 4.79086 21 7 21H17C19.2091 21 21 19.2092 21 17Z"
                        stroke="#000000" strokeWidth="2" strokeLinecap="round"
                    />
                </svg>
                <h2 className={ModalStyle.user_back_text}>Вернуться на главную</h2>
                <h1 className={ModalStyle.user_info_title}>Данные о пользователе:</h1>
            </div>
            <div className={ModalStyle.user_info}>
            {user ? (
                    <div>
                        {editMode ? (
                            <div>
                                <h2 className={ModalStyle.user_edit_title}>Изменение данных пользователя</h2>
                                <label>
                                    Имя:
                                    <input className={ModalStyle.user_info_name} type="text" value={newName}
                                           onChange={handleNameChange}/>
                                    {nameValMessage && <p className={ModalStyle.error_message}>{nameValMessage}</p>}
                                </label>
                                <br/>
                                <label>
                                    Email:
                                    {emailVerification ? (
                                        <div>
                                            <label className={ModalStyle.new_email_title}>Введите код подтверждения:</label>
                                            <ReactCodeInput
                                                name="code"
                                                type="number"
                                                fields={6}
                                                value={verificationCode}
                                                onChange={handleCodeChange}
                                                placeholder="Код подтверждения"
                                                inputMode={"numeric"}
                                                {...props}
                                            />
                                            <button className={ModalStyle.new_email_btn} onClick={handleCancelVerification}>Отмена</button>
                                            {errorMessage && <p className={ModalStyle.error_message}>{errorMessage}</p>}
                                        </div>
                                    ) : (
                                        <div>
                                            <input type="email" value={newEmail} className={ModalStyle.user_info_email}
                                                   onChange={(e) => setNewEmail(e.target.value)}/>
                                            {newEmail && newEmail !== user.email &&
                                                <button onClick={handleSendCode} className={ModalStyle.new_email_btn}>Подтвердить почту</button>}
                                            {emailValMessage &&
                                                <p className={ModalStyle.error_message}>{emailValMessage}</p>}
                                        </div>
                                    )}
                                </label>
                                <br/>
                                <label>
                                    Телефон:
                                    <InputMask mask="+7(999)999-99-99" maskChar=" " value={newPhone}
                                               onChange={handlePhoneChange}>
                                        {(inputProps) => <input className={ModalStyle.user_info_phone}
                                                                type="text" {...inputProps} />}
                                    </InputMask>
                                    {phoneValMessage && <p className={ModalStyle.error_message}>{phoneValMessage}</p>}
                                </label>
                                <br/>
                                <button className={ModalStyle.user_info_save_button} onClick={handleSave}>Применить
                                    изменения
                                </button>
                                <button className={ModalStyle.user_info_save_button} onClick={handleEditClose}>Отмена
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p className={ModalStyle.user_info_text}>Имя: {user.name}</p>
                                <p className={ModalStyle.user_info_text}>Email: {user.email}</p>
                                <p className={ModalStyle.user_info_text}>Телефон: {user.phone ? user.phone : 'нет номера телефона'}</p>
                                <button className={ModalStyle.user_info_edit_button} onClick={handleEdit}>Редактировать
                                    данные
                                </button>
                            </div>
                        )}
                        {changePasswordMode ? (
                            <div className={ModalStyle.change_password_form}>
                                {passwordChangeSuccess ? (
                                    <div>
                                        <p>Пароль успешно изменён</p>
                                        <button onClick={() => {
                                            setChangePasswordMode(false);
                                            setPasswordChangeSuccess(false);
                                        }}>OK
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <h2>Смена пароля</h2>
                                        <label>
                                            Текущий пароль:
                                            <input type="password" value={currentPassword}
                                                   onChange={(e) => setCurrentPassword(e.target.value)}/>
                                        </label>
                                        <label>
                                            Новый пароль:
                                            <input type="password" value={newPassword}
                                                   onChange={handleNewPasswordChange}/>
                                        </label>
                                        {passwordValMessage &&
                                            <p className={ModalStyle.error_message}>{passwordValMessage}</p>}
                                        <button onClick={handleChangePassword}>Отправить</button>
                                        <button onClick={handleCancelPasswordChange}>Отменить</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button className={ModalStyle.user_info_edit_button}
                                    onClick={() => setChangePasswordMode(true)}>Изменить пароль</button>
                        )}
                    </div>
                ) : (
                    <Loading/>
                )}
            </div>
            <div className={ModalStyle.orders}>
                <h2 className={ModalStyle.user_order_title}>Заказы:</h2>
                {Array.isArray(orders.orders) && orders.orders.length > 0 ? (
                    <div className={ModalStyle.user_info_orders} style={{maxHeight: '380px', overflow: 'auto'}}>
                        {orders.orders.map((order) => (
                            <div key={order.id} className={ModalStyle.user_info_order}>
                                {order.Status.name === 'Новый' && <button className={ModalStyle.cancel_order_button}
                                                                          onClick={() => handleCancelOrder(order.id)}>Отменить
                                    заказ</button>}
                                <p className={ModalStyle.user_info_order_date}>Дата
                                    заказа: {formatUpdatedAt(order.createdAt)}</p>
                                <p className={ModalStyle.user_info_order_total}>Сумма заказа: {order.total_price}₽</p>
                                <p className={ModalStyle.user_info_order_items}>Статус: {order.Status.name}</p>
                                <p className={ModalStyle.user_info_order_items}>Товары:</p>
                                <ul className={ModalStyle.user_info_order_items}>
                                    {order.orderTovars.map((orderTovar) => (
                                        <React.Fragment key={orderTovar.id}>
                                            <hr className={ModalStyle.order_item_separator}/>
                                            <li key={orderTovar.id} className={ModalStyle.user_info_order_item}>
                                            <span
                                                className={ModalStyle.user_info_order_item_name}>{orderTovar.tovar.name}</span>
                                                <span
                                                    className={ModalStyle.user_info_order_item_details}>Размер: {orderTovar.size.size_name}, Количество: {orderTovar.amount}</span>
                                            </li>
                                            <hr className={ModalStyle.order_item_separator}/>
                                        </React.Fragment>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>У Вас нет заказов</p>
                )}

            </div>
            <button className={ModalStyle.user_info_logout_button} onClick={handleLogout}>Выйти</button>
        </div>
    );

}

export default UserInfo;
