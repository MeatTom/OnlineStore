import './App.scss';
import React, { useState, useEffect } from "react";
import { useGetItemsQuery, useAddToCartMutation, useAddFavoriteMutation, useRemoveFavoriteMutation, useGetFavoritesQuery } from './Services/socksApi';
import Item from './Components/Item/Item';
import Header from "./Components/Header/header";
import SideCart from "./Components/SideCart/SideCart";
import Loading from "./Components/Loading/Loading";
import ScrollToTop from "react-scroll-up";
import FilterSortPanel from './Components/FilterSortPanel/FilterSortPanel';
import { useNotification } from './Components/Notification/Notification';

function App() {
    const [searchBar, setSearchBar] = useState('');
    const [cartIsOpen, setCartIsOpen] = useState(false);
    const [filterParams, setFilterParams] = useState({
        priceRange: { min: '', max: '' },
        sortBy: 'priceAsc',
    });

    const token = localStorage.getItem('token');
    const { addNotification } = useNotification();
    const { data: items, isLoading, isError, refetch } = useGetItemsQuery();
    const [addToCart] = useAddToCartMutation();
    const { data: favorites, refetch: refetchFavorites } = useGetFavoritesQuery();
    const [addToFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();

    const [displayedItems, setDisplayedItems] = useState([]);
    const [itemsToShow, setItemsToShow] = useState(8);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [contentVisible, setContentVisible] = useState(false);
    const [loadingDelayed, setLoadingDelayed] = useState(true);

    const handleAddFavorite = async (itemId) => {
        try {
            await addToFavorite(itemId);
            refetchFavorites();
        } catch (error) {
            addNotification('Ошибка добавления товара в корзину! Необходимо войти в аккаунт.', 'error');
            console.error('Ошибка при добавлении в избранное:', error);
        }
    };

    const handleRemoveFavorite = async (itemId) => {
        try {
            await removeFavorite(itemId);
            refetchFavorites();
        } catch (error) {
            console.error('Ошибка при удалении из избранного:', error);
        }
    };

    useEffect(() => {
        if (!isLoading && !isError && items) {
            let filteredItems = items;

            if (filterParams.priceRange.min) {
                filteredItems = filteredItems.filter(item =>
                    item.price >= parseFloat(filterParams.priceRange.min)
                );
            }
            if (filterParams.priceRange.max) {
                filteredItems = filteredItems.filter(item =>
                    item.price <= parseFloat(filterParams.priceRange.max)
                );
            }

            filteredItems = filteredItems.slice().sort((a, b) => {
                if (filterParams.sortBy === 'priceAsc') {
                    return a.price - b.price;
                } else if (filterParams.sortBy === 'priceDesc') {
                    return b.price - a.price;
                } else if (filterParams.sortBy === 'name') {
                    return a.name.localeCompare(b.name);
                } else if (filterParams.sortBy === 'createdAtAsc') {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                } else if (filterParams.sortBy === 'createdAtDesc') {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                return 0;
            });

            setDisplayedItems(filteredItems.slice(0, itemsToShow));
            setHasMoreItems(itemsToShow < filteredItems.length);
            setLoadingDelayed(false);
            setContentVisible(true);
        }
    }, [isLoading, isError, items, itemsToShow, filterParams]);

    const handleLoadMore = () => {
        setItemsToShow(itemsToShow + 4);
    };

    const onAddToCartClick = async (item) => {
        if (!token) {
            alert('Для добавления товара в корзину выполните вход');
            return;
        }
        try {
            await addToCart(item);
        } catch (error) {
            console.error('Ошибка при добавлении товара в корзину:', error);
        }
    };

    const onChangeSearchBar = (event) => {
        setSearchBar(event.target.value);
    };

    const onFilterChange = (params) => {
        setFilterParams(params);
    };

    if (isLoading || isError || loadingDelayed) {
        return (
            <div className="Wrapper">
                <Header isLoading={isLoading || loadingDelayed} isError={isError}/>
                {isError && (
                    <div className="load_error">
                    <p className="load_error_msg">Ошибка загрузки данных. Пожалуйста, попробуйте еще раз.</p>
                    <button className="load_error_btn" onClick={() => refetch()}>Повторить попытку</button>
                    </div>
                )}
                <Loading />
            </div>
        );
    }

    const minPrice = items && items.length > 0 ? Math.min(...items.map(item => item.price)) : 0;
    const maxPrice = items && items.length > 0 ? Math.max(...items.map(item => item.price)) : 1000;

    const filteredItems = displayedItems.filter(item => item.name.toLowerCase().includes(searchBar.toLowerCase()));

    return (
        <div className="Wrapper">
            <ScrollToTop showUnder={300} style={{ zIndex: 1000, position: 'fixed', bottom: '2rem', right: '2rem' }}>
                <span><img src="/statics/ButtonUp.png" alt="UP" /></span>
            </ScrollToTop>
            <Header onClickedCart={() => setCartIsOpen(true)} isLoading={isLoading || loadingDelayed} isError={isError} cartIsOpen={cartIsOpen}/>
            {cartIsOpen && <SideCart onClosedCart={() => setCartIsOpen(false)} />}
            {contentVisible && (
                <div>
                    <div className="Search">
                        <p>Поиск товара</p>
                        <input onChange={onChangeSearchBar} placeholder="Halloween socks..." className="Search_bar"/>
                    </div>
                    <FilterSortPanel
                        onFilterChange={onFilterChange}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                    />
                    <div className="main_content">
                        <div className="socks">
                            {filteredItems.length > 0 ? (
                                filteredItems.map(item => (
                                    <Item
                                        key={item.id}
                                        id={item.id}
                                        name={item.name}
                                        price={item.price}
                                        description={item.description}
                                        imageURL={item.image.replace('http://localhost:5000/image_storage/', process.env.REACT_APP_URL_IMG)}
                                        onPlus={() => onAddToCartClick(item)}
                                        onAddToFavorite={() => handleAddFavorite(item.id)}
                                        onRemoveFavorite={() => handleRemoveFavorite(item.id)}
                                        isFavorite={favorites?.some(fav => fav.itemId === item.id)}
                                    />
                                ))
                            ) : (
                                <p className="search_msg">Упс! Ничего не найдено...</p>
                            )}
                            {filteredItems.length > 0 && hasMoreItems && (
                                <button className="load_more_btn" onClick={handleLoadMore}>
                                    Загрузить больше
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
