import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import ModalStyle from './ItemModal.module.scss';
import { useGetSizesQuery, useGetStockQuery, useAddSizeToCartMutation } from '../../Services/socksApi';
import SizeTable from '../SizeTable/SizeTable';
import { useNotification } from '../Notification/Notification';

const getCustomStyles= () => {
    const width = window.innerWidth;
    let modalHeight = '84%';
    if (width <= 520) {
        modalHeight = '80%';
        } else if (width <= 1600) {
        modalHeight = '75%';
        }
    return{content: {
            top: '50%',
            left: '50%',
            width: '65%',
            height: modalHeight,
            maxWidth: '1240px',
            maxHeight: '700px',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '20px',
        },
    }

};

function ItemModal({ isOpen, onClose, name, imageURL, price, description, currentItemId, onAddFavorite, onDelFavorite, isFavorite, isAuthenticated }) {
    const [addedToCart, setAddedToCart] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isSizeSelected, setIsSizeSelected] = useState(false);
    const [isSizeTableOpen, setIsSizeTableOpen] = useState(false);
    const [customStyles, setCustomStyles] = useState(getCustomStyles());
    const { addNotification } = useNotification();

    const { data: sizes, isSuccess: sizesLoaded } = useGetSizesQuery();
    const { data: stock, isSuccess: stockLoaded } = useGetStockQuery(currentItemId || 0);

    const [addSizeToCartMutation] = useAddSizeToCartMutation();

    useEffect(() => {
        setIsSizeSelected(selectedSize !== null);
    }, [selectedSize]);

    useEffect(() => {
        const handleResize = () => {
            setCustomStyles(getCustomStyles());
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleSizeSelection = (sizeId) => {
        setSelectedSize(sizeId);
    };

    const handleAddToCart = async () => {
        try {

            if (selectedSize) {
                const token = localStorage.getItem('token');
                if (token) {
                    await addSizeToCartMutation({ itemId: currentItemId, sizeId: selectedSize, token });
                    setAddedToCart(true);
                    console.log('Size added to cart successfully');
                } else {
                    console.error('No token found in localStorage');
                    addNotification('Ошибка добавления товара в корзину! Необходимо войти в аккаунт.', 'error');
                }
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const handleClose = () => {
        onClose();
        setAddedToCart(false);
        setSelectedSize(null);
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
            overlayClassName={ModalStyle.modal_overlay}
            appElement={document.getElementById('root')}
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
                    <p className={ModalStyle.item_modal_price}>Цена: {price}₽</p>
                    {isAuthenticated && (
                        <>
                    {isFavorite ? (
                        <svg className={`${ModalStyle.delFromFavorite} active`} onClick={onDelFavorite} width="30px" height="30px" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" fill="red">
                            <path d="M60.732 29.7C41.107 29.7 22 39.7 22 67.41c0 27.29 45.274 67.29 74 94.89 28.744-27.6 74-67.6 74-94.89 0-27.71-19.092-37.71-38.695-37.71C116 29.7 104.325 41.575 96 54.066 87.638 41.516 76 29.7 60.732 29.7z"/>
                        </svg>
                    ) : (
                        <svg className={ModalStyle.addToFavorite} onClick={onAddFavorite} width="30px"
                             height="30px" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg"
                             fill="none">
                            <path
                                d="M60.732 29.7C41.107 29.7 22 39.7 22 67.41c0 27.29 45.274 67.29 74 94.89 28.744-27.6 74-67.6 74-94.89 0-27.71-19.092-37.71-38.695-37.71C116 29.7 104.325 41.575 96 54.066 87.638 41.516 76 29.7 60.732 29.7z"/>
                        </svg>
                    )}
                        </>
                    )}
                </div>
            </div>
            <div className={ModalStyle.size_modal_header}>
                <p className={ModalStyle.size_modal_title}>Выберите размер:</p>
                <p className={ModalStyle.size_modal_table} onClick={openSizeTable}>Таблица размеров</p>
            </div>
            <p className={ModalStyle.size_modal_description}>RUS</p>

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
                                            selectedSize === stockItem.sizeId ? ModalStyle.selected : ''
                                        }`}
                                        onClick={() => handleSizeSelection(stockItem.sizeId)}
                                    >
                                        {size ? size.size_name : 'Unknown'}
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
                              !isSizeSelected ? ModalStyle.item_cart_btn_disabled : ''
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
