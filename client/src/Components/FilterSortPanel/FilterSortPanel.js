import React, { useState } from 'react';
import PanelStyle from "./FilterSortPanel.module.scss";

const FilterSortPanel = ({ onFilterChange, minPrice, maxPrice }) => {
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortBy, setSortBy] = useState('priceAsc');

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setPriceRange(prevState => ({ ...prevState, [name]: value }));
        onFilterChange({ priceRange: { ...priceRange, [name]: value }, sortBy });
    };

    const handleSortByChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        onFilterChange({ priceRange, sortBy: value });
    };

    return (
        <div className={PanelStyle.filter_sort_panel}>
            <div className={PanelStyle.filter}>
                <label>
                    Цена:
                </label>
                    <input
                        type="number"
                        name="min"
                        placeholder="От"
                        value={priceRange.min}
                        onChange={handlePriceChange}
                        min={minPrice}
                        max={maxPrice}
                    />
                    <input
                        type="number"
                        name="max"
                        placeholder="До"
                        value={priceRange.max}
                        onChange={handlePriceChange}
                        min={minPrice}
                        max={maxPrice}
                    />

            </div>
            <div className={PanelStyle.sort}>
                <label>Сортировка:</label>
                <select value={sortBy} onChange={handleSortByChange}>
                    <option value="name">По названию</option>
                    <option value="priceAsc">По возрастанию цены</option>
                    <option value="priceDesc">По убыванию цены</option>
                    <option value="createdAtAsc">По новизне (старые к новым)</option>
                    <option value="createdAtDesc">По новизне (новые к старым)</option>
                </select>
            </div>
        </div>
    );
};


export default FilterSortPanel;
