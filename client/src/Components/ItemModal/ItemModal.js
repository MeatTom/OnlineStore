import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import ModalStyle from './ItemModal.module.scss';
import axios from "axios";
import SizeTable from "../SizeTable/SizeTable";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        width: '47%',
        height: '66%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '10px',
    },
};

function ItemModal({ isOpen, onClose, name, imageURL, price, description, onAddToCart, currentItemId }) {
    const [addedToCart, setAddedToCart] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [stock, setStock] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isSizeSelected, setIsSizeSelected] = useState(false);
    const [isSizeTableOpen, setIsSizeTableOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sizesResponse = await axios.get("http://localhost:5000/sizes");
                setSizes(sizesResponse.data);

                if (currentItemId) {
                    const stockResponse = await axios.get(`http://localhost:5000/stock/item/${currentItemId}`);
                    setStock(stockResponse.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [currentItemId]);

    const handleSizeSelection = (sizeId) => {
        setSelectedSize(sizeId);
        setIsSizeSelected(true);
    };

    const sendSizeToCart = async (itemId, sizeId) => {
        try {
            await axios.post("http://localhost:5000/cart/size", { itemId, sizeId });
            console.log("Размер успешно сохранен в корзине");
        } catch (error) {
            console.error("Ошибка при сохранении размера в корзине:", error);
        }
    };

    const handleAddToCart = () => {
        onAddToCart({ id: Date.now(), name, imageURL, price });
        setAddedToCart(true);

        setTimeout(() => {
            if (selectedSize) {
                sendSizeToCart(currentItemId, selectedSize);
            }
        }, 500);
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
        >
            <div className={ModalStyle.item_header}>
                <h2 className={ModalStyle.item_modal_title}>{name}</h2>
                <svg className={ModalStyle.size_button_close} onClick={handleClose}
                     width="15" height="25" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.0799 7.61553L6.6311 5.16673L9.07982 2.71801C10.0241 1.77376 8.55964 0.309342 7.61539 1.25359L5.16668 3.70231L2.71787 1.2535C1.77384 0.309466 0.309467 1.77384 1.2535 2.71787L3.70231 5.16668L1.25359 7.61539C0.309343 8.55964 1.77376 10.0241 2.71801 9.07982L5.16673 6.6311L7.61553 9.0799C8.55969 10.0241 10.0241 8.55969 9.0799 7.61553Z" fill="#B5B5B5"/>
                </svg>
            </div>
            <div className={ModalStyle.item_modal_content}>
                <img className={ModalStyle.item_modal_image} src={imageURL} alt={name} />
                <div className={ModalStyle.item_modal_details}>
                    <p className={ModalStyle.item_modal_description}>{description}</p>
                    <p className={ModalStyle.item_modal_price}>Price: ${price}</p>
                </div>
            </div>
            <div className={ModalStyle.size_modal_header}>
                <p className={ModalStyle.size_modal_title}>Выберите размер:</p>
                <p className={ModalStyle.size_modal_table} onClick={openSizeTable}>Таблица размеров</p>
            </div>
                <p className={ModalStyle.size_modal_description}>RUS</p>

            <div className={ModalStyle.size_modal_content}>
                {stock.map((stockItem) => {
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
                })}
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
                       Добавить в корзину
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

export default ItemModal;