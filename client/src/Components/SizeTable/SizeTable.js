import React from 'react';
import Modal from 'react-modal';
import ModalStyle from './SizeTable.module.scss';

const SizeTable = ({ isOpen, onClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Size Table Modal"
            className={ModalStyle.size_table_modal}
            overlayClassName={ModalStyle.size_table_overlay}
        >
            <div className={ModalStyle.size_table_content}>
                <h2>Таблица размеров</h2>
                <table className={ModalStyle.size_table}>
                    <thead>
                    <tr>
                        <th>Размер</th>
                        <th>Длина стопы (см)</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>38-40</td>
                        <td>24-26</td>
                    </tr>
                    <tr>
                        <td>40-42</td>
                        <td>26-28</td>
                    </tr>
                    <tr>
                        <td>42-44</td>
                        <td>28-30</td>
                    </tr>
                    <tr>
                        <td>44-46</td>
                        <td>30-32</td>
                    </tr>
                    </tbody>
                </table>
                <button className={ModalStyle.close_button} onClick={onClose}>
                    Закрыть
                </button>
            </div>
        </Modal>
    );
};

export default SizeTable;
