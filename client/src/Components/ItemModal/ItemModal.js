import React, { useState } from "react";
import Modal from 'react-modal';
import ModalStyle from './ItemModal.module.scss'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        width: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '10px',
    },
};

function ItemModal({isOpen, onClose, name, imageURL, price, description, onAddToCart}) {
    const [addedToCart, setAddedToCart] = useState(false);

    const handleAddToCart = () => {
        onAddToCart({id: Date.now(), name, imageURL, price});
        setAddedToCart(true);
    };

    const handleClose = () => {
        onClose();
        setAddedToCart(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel="Item Modal"
            style={customStyles}
        >
            <div className={ModalStyle.item_header}>
                <h2 className={ModalStyle.item_modal_title}>{name}</h2>
                <button className={ModalStyle.item_modal_button} onClick={handleClose}>Close</button>
            </div>
            <div className={ModalStyle.item_modal_content}>
                <img className={ModalStyle.item_modal_image} src={imageURL} alt={name} />
                <div className={ModalStyle.item_modal_details}>
                    <p className={ModalStyle.item_modal_description}>{description}</p>
                    <p className={ModalStyle.item_modal_price}>Price: ${price}</p>
                    {!addedToCart && (
                        <button className={ModalStyle.item_cart_button} onClick={handleAddToCart}>Добавить в корзину</button>
                    )}
                    {addedToCart && (
                        <button className={ModalStyle.item_cart_button} onClick={handleClose}>Добавлено!</button>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default ItemModal;
