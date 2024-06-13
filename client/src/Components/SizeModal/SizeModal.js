import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import ModalStyle from './SizeModal.module.scss';
import { useGetSizesQuery, useGetStockQuery, useAddSizeToCartMutation } from '../../Services/socksApi';
import SizeTable from "../SizeTable/SizeTable";

const getCustomStyles = () => {
    const width = window.innerWidth;
    let modalWidth = '25%';
    if (width <= 520) {
        modalWidth = '80%';
    } else if (width <= 693) {
        modalWidth = '60%';
    } else if (width <= 890) {
        modalWidth = '45%';
    } else if (width <= 1246) {
        modalWidth = '35%';
    }

    return {
        content: {
            top: '50%',
            left: '50%',
            width: modalWidth,
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '10px',
            padding: '20px',
            boxSizing: 'border-box',
        },
    };
};

function SizeModal({ isOpen, onClose, name, imageURL, price, currentItemId }) {
    const [addedToCart, setAddedToCart] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isSizeSelected, setIsSizeSelected] = useState(false);
    const [customStyles, setCustomStyles] = useState(getCustomStyles());
    const [isSizeTableOpen, setIsSizeTableOpen] = useState(false);

    const { data: sizes, isSuccess: sizesLoaded } = useGetSizesQuery();
    const { data: stock, isSuccess: stockLoaded } = useGetStockQuery(currentItemId || 0);
    const [addSizeToCartMutation] = useAddSizeToCartMutation();

    useEffect(() => {
        setIsSizeSelected(selectedSize !== null);
    }, [selectedSize]);

    useEffect(() => {
        const handleResize = () => setCustomStyles(getCustomStyles());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSizeSelection = (sizeId) => {
        setSelectedSize(sizeId);
        setIsSizeSelected(true);
    };

    const handleAddToCart = async () => {
        try {

            setAddedToCart(true);

            if (selectedSize) {
                const token = localStorage.getItem('token');
                if (token) {
                    await addSizeToCartMutation({ itemId: currentItemId, sizeId: selectedSize, token });
                    console.log('Size added to cart successfully');
                } else {
                    console.error('No token found in localStorage');
                }
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const handleClose = () => {
        onClose();
        setAddedToCart(false);
    };

    const openSizeTable = () => {
        setIsSizeTableOpen(true);
    };

    const closeSizeTable = () => {
        setIsSizeTableOpen(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel="Size Modal"
            style={customStyles}
            appElement={document.getElementById('root')}
        >
            <div className={ModalStyle.size_modal_header}>
                <h2 className={ModalStyle.size_modal_title}>Выберите размер</h2>
            </div>
            <div>
                <p className={ModalStyle.size_modal_table} onClick={openSizeTable}>Таблица размеров</p>
                <p className={ModalStyle.size_modal_description}>RUS</p>
            </div>
            <div className={ModalStyle.size_modal_content}>
                {sizesLoaded && stockLoaded && currentItemId ? (
                    stock
                        .filter(stockItem => stockItem.quantity > 0)
                        .sort((a, b) => a.sizeId - b.sizeId)
                        .map((stockItem) => {
                            const size = sizes.find((size) => size.id === stockItem.sizeId);
                            return (
                                <div key={stockItem.id} className={ModalStyle.size_buttons_container}>
                                    <div className={ModalStyle.size_button_wrapper}>
                                        <button
                                            className={`${ModalStyle.size_button} ${
                                                selectedSize === stockItem.sizeId ? ModalStyle.selected : ""
                                            }`}
                                            onClick={() => handleSizeSelection(stockItem.sizeId)}
                                        >
                                            {size ? size.size_name : "Unknown"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                ) : (
                    <div>Loading...</div>
                )}
            </div>
            <div>
                {selectedSize && (
                    <div className={ModalStyle.size_quantity}>
                        <p>Пар в наличии: {stock.find((item) => item.sizeId === selectedSize)?.quantity}</p>
                    </div>
                )}
            </div>
            <div className={ModalStyle.size_modal_btn_bottom}>
                {!addedToCart ? (
                    <button
                        className={`${ModalStyle.size_cart_btn_active} ${
                            !isSizeSelected ? ModalStyle.item_cart_btn_disabled : ""
                        }`}
                        onClick={handleAddToCart}
                        disabled={!isSizeSelected}
                    >
                        В корзину
                    </button>
                ) : (
                    <button className={ModalStyle.size_cart_btn_active} onClick={handleClose}>
                        Добавлено
                    </button>
                )}
                <button className={ModalStyle.item_cart_btn_cancel} onClick={handleClose}>
                    Отмена
                </button>
                <SizeTable isOpen={isSizeTableOpen} onClose={closeSizeTable} />
            </div>
        </Modal>
    );
}

export default SizeModal;
