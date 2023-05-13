import headerStyle from './header.module.scss'
import React from "react";

function Header (props) {
    return(
        <header>
        <div className={headerStyle.header_left}>
            <img width="60px" src="/statics/socksLogo.svg" alt="logo"/>
            <div>
                <h1>
                    Socks Heaven
                </h1>
                <p>Носки, которые поднимут настроение</p>
            </div>
        </div>
        <ul className={headerStyle.header_right}>
            <li>
                <img onClick={props.onClickedCart} className={headerStyle.cart_icon} width="23px" src="/statics/cart.svg" alt="cart"/>
            </li>
            <li>
                <img width="30px" src="/statics/profile.svg" alt="profile"/>
            </li>
        </ul>
    </header>
    )
}

export default Header