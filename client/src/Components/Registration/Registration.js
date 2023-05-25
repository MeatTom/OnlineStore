import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ModalStyle from '../Registration/Registration.module.scss';
import AuthForm from '../Auth/Auth';

const RegistrationForm = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegistration = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setErrorMessage('Пожалуйста, заполните все поля');
            return;
        }

        if (password.length < 5) {
            setErrorMessage('Пароль должен содержать не менее 5 символов');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setErrorMessage('Неверный формат почты');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/auth/register', {
                name,
                email,
                password,
            });

            const { token, user } = response.data;
            setIsSuccess(true);

            console.log('Регистрация успешна:', user, token);

            setTimeout(() => {
                setIsSuccess(false);
            }, 3000);
        } catch (error) {
            if (
                error.response.data.error === 'Введён неверный формат почты'
            ) {
                setErrorMessage('Введён неверный формат почты');
            } else {
                setErrorMessage('Ошибка при регистрации пользователя');
            }
        }
    };

    const handleClose = () => {
        onClose();
    };

    const handleAuthClose = () => {
        setIsAuthOpen(false);
        onClose()
    };

    const handleAuthOpen = () => {
        setIsAuthOpen(true);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        setErrorMessage('');
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrorMessage('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setErrorMessage('');
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel="Size Modal"
            className={ModalStyle.reg_modal}
            overlayClassName={ModalStyle.reg_modal_overlay}
        >
            <svg
                className={ModalStyle.reg_button_close}
                onClick={handleClose}
                width="15"
                height="25"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M9.0799 7.61553L6.6311 5.16673L9.07982 2.71801C10.0241 1.77376 8.55964 0.309342 7.61539 1.25359L5.16668 3.70231L2.71787 1.2535C1.77384 0.309466 0.309467 1.77384 1.2535 2.71787L3.70231 5.16668L1.25359 7.61539C0.309343 8.55964 1.77376 10.0241 2.71801 9.07982L5.16673 6.6311L7.61553 9.0799C8.55969 10.0241 10.0241 8.55969 9.0799 7.61553Z"
                    fill="#B5B5B5"
                />
            </svg>
            {isSuccess ? (
                <div className={ModalStyle.reg_success_message}>
                    <h2>Аккаунт успешно создан! </h2>
                    <h3>Войдите в аккаунт:</h3>
                    <button onClick={handleAuthOpen} className={ModalStyle.auth_btn}>Войти в аккаунт</button>
                </div>
            ) : (
                <>
                    <form className={ModalStyle.reg_form} onSubmit={handleRegistration}>
                        <h2>Registration</h2>
                        {errorMessage && (
                            <p className={ModalStyle.reg_error_message}>{errorMessage}</p>
                        )}
                        <input
                            type="text"
                            placeholder="Имя"
                            value={name}
                            onChange={handleNameChange}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <button type="submit">Зарегистрироваться</button>
                    </form>
                    <button onClick={handleAuthOpen} className={ModalStyle.auth_btn}>
                        Войти в аккаунт
                    </button>
                </>
            )}
            <AuthForm isOpen={isAuthOpen} onClose={handleAuthClose} />
        </Modal>
    );
};

export default RegistrationForm;
