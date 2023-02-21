import './index.scss';
import Item from './Components/Item/Item'
import Header from "./Components/Header/header";
import SideCart from "./Components/SideCart/SideCart";
import Search from "./Components/Search/Search";

const arr =[
    {name: 'SinSay "Funny-Taco socks"' , price: 10, imageUrl: "/statics/Socks/Socks2.png"},
    {name: 'TOEI "DreamHome socks"' , price: 12,  imageUrl: "/statics/Socks/Socks3.png"},
    {name: 'Jaws "Room Monster socks"' , price: 7,  imageUrl: "/statics/Socks/Socks5.png"},
    {name: 'SinSay "Halloween socks"' , price: 5,  imageUrl: "/statics/Socks/Socks4.png"}
];

function App() {
    return (
        <div className="Wrapper">
            <Header/>
            <SideCart/>
            <Search/>
        <div className="main_content">
            <div className="socks">
                {
                    arr.map((obj) =>
                        <Item name={obj.name} price={obj.price} imageURL={obj.imageUrl}/>
                    )
                }
            </div>
        </div>
    </div>
    )
}

export default App;
