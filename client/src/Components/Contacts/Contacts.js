import React, { useState } from 'react';
import ContactsStyle from './Contacts.module.scss';
import Header from "../Header/header";
import SideCart from "../SideCart/SideCart";

const Contacts = () => {
    const [cartIsOpen, setCartIsOpen] = useState(false);

    const handleOpenCart = () => {
        setCartIsOpen(true);
    };

    return (
        <div className={ContactsStyle.contacts}>
            <Header onClickedCart={handleOpenCart} />
            {cartIsOpen && <SideCart onClosedCart={() => setCartIsOpen(false)} />}
            <div className={ContactsStyle.header}>
                <h1>Контакты</h1>
            </div>
            <div className={ContactsStyle.content}>
                <div className={ContactsStyle.info}>
                    <h2>Свяжитесь с нами</h2>
                    <p><b>Email:</b> SocksHeaven@yandex.ru</p>
                    <p><b>Телефон:</b>  +7 (123) 456-78-90</p>
                    <p><b>Адрес:</b>  улица Марата, 26/11, Санкт-Петербург, Россия</p>
                    <p><b>Режим работы:</b> Пн-Пт, 9:00 - 18:00</p>
                </div>
                <div className={ContactsStyle.map}>
                    <iframe
                        title="map"
                        src="https://yandex.ru/map-widget/v1/?um=constructor%3Acf0ebdee527311d80611f51d5a4ba00bd2653c0b3840e3c5dffd1b654e131c33&amp;source=constructor"
                        width="1192" height="545" frameBorder="0"></iframe>
                </div>
            </div>
        </div>
    );
}

export default Contacts;
