import headerStyle from './header.module.scss'

function Header () {
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
                <img width="23px" src="/statics/cart.svg" alt="cart"/>
                <p>$ 0 </p>
            </li>
            <li>
                <img width="30px" src="/statics/profile.svg" alt="profile"/>
            </li>
        </ul>
    </header>
    )
}

export default Header