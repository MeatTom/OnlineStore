import './App.scss';
import React from "react";
import Item from './Components/Item/Item';
import Header from "./Components/Header/header";
import SideCart from "./Components/SideCart/SideCart";
import axios from 'axios';
import Loading from "./Components/Loading/Loading";
import ScrollToTop from "react-scroll-up";

function App() {
    const [item, setItem] = React.useState([])
    const [cartItems, setCartItems] = React.useState([])
    const [searchBar, setSearchBar] = React.useState('')
    const [cartIsOpen, setCartIsOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true);
    const [displayedItems, setDisplayedItems] = React.useState([]);
    const [itemsToShow, setItemsToShow] = React.useState(8);
    const [hasMoreItems, setHasMoreItems] = React.useState(true);

    React.useEffect(() => {
        const getData = () => {
        axios.get('http://localhost:5000/tovars')
            .then((response) => {
                setItem(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(true);
            })
        };
        const intervalId = setInterval(() => {
            getData();
        }, 15000);

        getData();

        return () => clearInterval(intervalId);
   },[]);

    React.useEffect(() => {
        if (cartIsOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        }
    }, [cartIsOpen]);

    const onAddToCart = (obj) => {
        axios.post('http://localhost:5000/cart', { ...obj, id: obj.id })
            .then(response => {
                setCartItems(prev => [...prev, response.data]);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const onChangeSearchBar = (event) => {
        setSearchBar(event.target.value)
    }

    const handleLoadMore = () => {
        if (itemsToShow >= item.length) {
            setHasMoreItems(false);
        } else {
            setDisplayedItems([...displayedItems, ...item.slice(itemsToShow, itemsToShow + 4)]);
            setItemsToShow(itemsToShow + 4);
        }
    };

    React.useEffect(() => {
        setDisplayedItems(item.slice(0, itemsToShow));
    }, [item, itemsToShow]);

    return (
        <div className="Wrapper">
            <ScrollToTop showUnder={260}>
                <span><img src="/statics/ButtonUp.png" alt="UP"/></span>
            </ScrollToTop>
            <Header onClickedCart={() => setCartIsOpen(true)} />
            {cartIsOpen && <SideCart idItem={item.id} item={cartItems} onClosedCart={() => setCartIsOpen(false)} />}
            <div className="Search">
                <p>Search Item</p>
                <input onChange={onChangeSearchBar} placeholder="Halloween socks..." className="Search_bar"/>
            </div>
            {isLoading ? ( <Loading/>
                ) : (
                <div className="main_content">
                    <div className="socks">
                        {
                            displayedItems.filter(item => item.name.toLowerCase().includes(searchBar.toLowerCase())).map((item) =>
                                <Item key={item.id} id={item.id}
                                      name={item.name} price={item.price} description={item.description} imageURL = {item.image.replace(/\\/g, "/")}
                                      onPlus = {() => onAddToCart(item)} />
                            )
                        }
                        {hasMoreItems && itemsToShow < item.length && (
                            <button className="load_more_btn" onClick={handleLoadMore}>
                                Load more
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;

