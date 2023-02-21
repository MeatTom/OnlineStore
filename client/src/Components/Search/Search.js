import SearchStyle from './Search.module.scss'

function Search () {
    return(
        <div className={SearchStyle.Search}>
            <p>Search Item</p>
            <input placeholder="Halloween socks..." className={SearchStyle.Search_bar}/>
        </div>
    )
}

export default Search