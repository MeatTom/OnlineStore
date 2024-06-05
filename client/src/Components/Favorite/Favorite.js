import React, {useState} from 'react';
import {useGetFavoritesQuery, useRemoveFavoriteMutation} from '../../Services/socksApi';
import Item from '../Item/Item';
import Loading from "../Loading/Loading";
import Header from "../Header/header";
import SideCart from "../SideCart/SideCart";
import FavoriteStyle from "./Favorite.module.scss";
import { useNavigate } from "react-router-dom";
import ScrollToTop from "react-scroll-up";
import { useNotification } from '../Notification/Notification';

const Favorites = () => {
    const { data: favorites, isLoading, isError, refetch: refetchFavorites  } = useGetFavoritesQuery();
    const [removeFavorite] = useRemoveFavoriteMutation();
    const [cartIsOpen, setCartIsOpen] = useState(false);
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const handleRemoveFavorite = async (itemId) => {
        try {
            await removeFavorite(itemId);
            refetchFavorites();
        } catch (error) {
            console.error('Ошибка при удалении из избранного:', error);
            addNotification('Ошибка при удалении из избранного!', 'error');
        }
    };

    if (isError || isLoading) {
        return (
            <div className={FavoriteStyle.wrapper}>
                <Header/>
                <Loading/>
            </div>
        );
    }


    const handleClose = () => {
        navigate("/");
    }

    return (
        <div className={FavoriteStyle.wrapper}>
            <ScrollToTop showUnder={300} style={{ zIndex: 1000, position: 'fixed', bottom: '2rem', right: '2rem' }}>
                <span><img src="/statics/ButtonUp.png" alt="UP" /></span>
            </ScrollToTop>
            <Header onClickedCart={() => setCartIsOpen(true)} isError={isError} cartIsOpen={cartIsOpen}/>
            {cartIsOpen && <SideCart onClosedCart={() => setCartIsOpen(false)} />}
            <div className={FavoriteStyle.fav_back_container}>
            <svg className={FavoriteStyle.button_back} onClick={handleClose} width="35" height="35"
                 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M13 9.00003L10.2121 11.7879C10.095 11.9051 10.095 12.095 10.2121 12.2122L13 15M21 17V7.00003C21 4.79089 19.2091 3.00003 17 3.00003H7C4.79086 3.00003 3 4.79089 3 7.00003L3 17C3 19.2092 4.79086 21 7 21H17C19.2091 21 21 19.2092 21 17Z"
                    stroke="#000000" strokeWidth="2" strokeLinecap="round"
                />
            </svg>
            <h3 className={FavoriteStyle.fav_back_text}>Вернуться на главную</h3>
            </div>
            <h2>Избранное</h2>
            {favorites && favorites.length > 0 ? (
                <div className={FavoriteStyle.list}>
                    {favorites.map((favorite) => (
                        <Item
                            key={favorite.id}
                            id={favorite.itemId}
                            name={favorite.Tovar.name}
                            price={favorite.Tovar.price}
                            description={favorite.Tovar.description}
                            imageURL={favorite.Tovar.image.replace(/\\/g, "/")}
                            onPlus={() => {
                            }}
                            onRemoveFavorite={() => handleRemoveFavorite(favorite.Tovar.id)}
                            isFavorite={true}
                        />
                    ))}
                </div>
            ) : (
                <div className={FavoriteStyle.blank}>
                    <p className={FavoriteStyle.blank_text}>Здесь пока пусто</p>
                    <button className={FavoriteStyle.blank_btn} onClick={handleClose}>Перейти в каталог</button>
                </div>
            )}

        </div>
    );
};

export default Favorites;
