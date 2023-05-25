import React from "react";
import RegistrationForm from "../Registration/Registration";
import UserInfo from "../UserInfo/UserInfo";
import headerStyle from "../Header/header.module.scss"

function Header(props) {
    const isAuthenticated = !!localStorage.getItem('token');
    const [isRegistrationOpen, setIsRegistrationOpen] = React.useState(false);
    const [isUserInfoOpen, setIsUserInfoOpen] = React.useState(false);

    const handleRegistrationClick = () => {
        if (!props.isLoading) {
            setIsRegistrationOpen(true);
        }
    };

    const handleUserInfoClick = () => {
        setIsUserInfoOpen(true);
        console.log(localStorage.getItem('token'))
    };

    const handleRegistrationClose = () => {
        setIsRegistrationOpen(false);
    };

    const handleUserInfoClose = (isClosed) => {
        setIsUserInfoOpen(isClosed);
    };

    React.useEffect(() => {
        if (isRegistrationOpen || isUserInfoOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isRegistrationOpen, isUserInfoOpen]);

    return (
        <header>
            <div className={headerStyle.header_left}>
                <img width="60px" src="/statics/socksLogo.svg" alt="logo" />
                <div>
                    <h1>Socks Heaven</h1>
                    <p>Носки, которые поднимут настроение</p>
                </div>
            </div>
            <ul className={headerStyle.header_right}>
                <li>
                    <img
                        onClick={props.onClickedCart}
                        className={headerStyle.cart_icon}
                        width="23px"
                        src="/statics/cart.svg"
                        alt="cart"
                    />
                </li>
                <li>
                    {isAuthenticated ? (
                        <img
                            onClick={handleUserInfoClick}
                            width="30px"
                            src="/statics/profile.svg"
                            alt="profile"
                        />
                    ) : (
                        <img
                            onClick={handleRegistrationClick}
                            width="30px"
                            src="/statics/profile.svg"
                            alt="profile"
                        />
                    )}
                </li>
            </ul>
            {isAuthenticated ? (
                <UserInfo isOpen={isUserInfoOpen} onClose={handleUserInfoClose} />
            ) : (
                <RegistrationForm
                    isOpen={isRegistrationOpen}
                    onClose={handleRegistrationClose}
                />
            )}
        </header>
    );
}

export default Header;
