import React from "react";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "../Registration/Registration";
import { slide as Menu } from "react-burger-menu";
import headerStyle from "../Header/header.module.scss";

function Header(props) {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');
    const [isRegistrationOpen, setIsRegistrationOpen] = React.useState(false);
    const [isUserInfoOpen] = React.useState(false);
    const [menuOpen, setMenuOpen] = React.useState(false);

    const handleRegistrationClick = () => {
        if (!props.isLoading) {
            setIsRegistrationOpen(true);
        }
    };

    const handleUserInfoClick = () => {
        if (isAuthenticated && !props.isLoading && !props.isError) {
            navigate("/user-info");
        } else {
            setIsRegistrationOpen(true);
        }
    };

    const handleFavoriteClick = () => {
        if (isAuthenticated && !props.isLoading && !props.isError) {
            navigate("/my-favorite");
        } else {
            setIsRegistrationOpen(true);
        }
    };

    const handleLogoClick = () => {
        navigate("/");
    };

    const handleOpenAboutUs = () => {
        navigate("/about");
    }

    const handleOpenContacts = () => {
        navigate("/contacts");
    }

    const handleRegistrationClose = () => {
        setIsRegistrationOpen(false);
    };

    const handleStateChange = (state) => {
        setMenuOpen(state.isOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    React.useEffect(() => {
        if (isRegistrationOpen || isUserInfoOpen || props.cartIsOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isRegistrationOpen, isUserInfoOpen, props.cartIsOpen]);

    return (
        <header>
            <div className={headerStyle.header_left}>
                <img onClick={handleLogoClick} width="60px" src="/statics/socksLogo.svg" alt="logo" />
                <div>
                    <h1 className={headerStyle.company_title}>Socks Heaven</h1>
                    <p className={headerStyle.company_text}>Носки, которые поднимут настроение</p>
                </div>
                <div className={headerStyle.header_links}>
                    <p onClick={handleOpenAboutUs}>О нас</p>
                    <p onClick={handleOpenContacts}>Контакты</p>
                </div>
            </div>
            <Menu
                left
                noOverlay
                isOpen={menuOpen}
                onStateChange={handleStateChange}
                customBurgerIcon={false}
                customCrossIcon={false}
                className={headerStyle.bm_menu}
            >
                <img className={headerStyle.bm_close_btn} onClick={closeMenu} alt="close" src="/statics/burger_close_btn.svg" />
                <p className={headerStyle.bm_item} onClick={handleOpenAboutUs}>О нас</p>
                <p className={headerStyle.bm_item} onClick={handleOpenContacts}>Контакты</p>
            </Menu>
            <img
                className={headerStyle.burger_icon}
                onClick={toggleMenu}
                width="45px"
                src="/statics/burger_menu.svg"
                alt="menu"
            />
            <ul className={headerStyle.header_right}>
                <li>
                    {isAuthenticated ? (
                        <img
                            onClick={handleFavoriteClick}
                            width="30px"
                            src="/statics/heart.svg"
                            alt="favorite"
                        />
                    ) : (
                        <img
                            onClick={handleRegistrationClick}
                            width="30px"
                            src="/statics/heart.svg"
                            alt="profile"
                        />
                    )}
                </li>
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
                <></>
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
