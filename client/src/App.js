import './App.scss';
import React from "react";
import Item from './Components/Item/Item';
import Header from "./Components/Header/header";
import SideCart from "./Components/SideCart/SideCart";
import axios from 'axios';

function App() {
    let [item, setItem] = React.useState([])
    let [cartItems, setCartItems] = React.useState([])
    let [searchBar, setSearchBar] = React.useState('')
    const [cartIsOpen, setCartIsOpen] = React.useState(false)

    React.useEffect(() => {
        axios.get('http://localhost:5000/tovars')
            .then((response) => {
                setItem(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const onAddToCart = (obj) => {
        console.log(obj.id)
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

    return (
        <div className="Wrapper">
            <Header onClickedCart={() => setCartIsOpen(true)}/>
            {cartIsOpen && <SideCart item={cartItems} onClosedCart={() => setCartIsOpen(false)}/>}
            <div className="Search">
                <p>Search Item</p>
                <input onChange={onChangeSearchBar} placeholder="Halloween socks..." className="Search_bar"/>
            </div>
            <div className="main_content">
                <div className="socks">
                    {
                        item.filter(item => item.name.toLowerCase().includes(searchBar.toLowerCase())).map((item) =>
                            <Item key={item.id} id={item.id}
                            name={item.name} price={item.price} imageURL = {item.image.replace(/\\/g, "/")}
                            onPlus = {() => onAddToCart(item)}/>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default App;

