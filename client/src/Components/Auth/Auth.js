import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import ModalStyle from '../Auth/Auth.module.scss';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../Services/socksApi';

const AuthForm = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMutation, { isLoading }] = useLoginMutation();
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleAuthorization = async (e) => {
        e.preventDefault();

        if (email === '' || password === '') {
            setErrorMessage('Пожалуйста, заполните все поля');
            return;
        }

        try {
            const response = await loginMutation({ email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            setIsSuccess(true);
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
            setErrorMessage('Неверный логин или пароль');
        }
    };

    useEffect(() => {
        let timer;
        if (isSuccess) {
            timer = setTimeout(() => {
                navigate("/user-info");
            }, 2000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [isSuccess, navigate]);

    const handleClose = () => {
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            contentLabel="Size Modal"
            className={ModalStyle.auth_modal}
            overlayClassName={ModalStyle.auth_modal_overlay}
            appElement={document.getElementById('root')}
        >
            <>
                <svg
                    className={ModalStyle.auth_button_close}
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
                    <div className={ModalStyle.auth_success_message}>
                        <h4>Вход выполнен успешно!</h4>
                    </div>
                ) : (
                    <form className={ModalStyle.auth_form} onSubmit={handleAuthorization}>
                        <h4>Вход</h4>
                        {errorMessage && (
                            <div className={ModalStyle.auth_error_message}>{errorMessage}</div>
                        )}
                        <input
                            type="email"
                            placeholder="Почта"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Вход...' : 'Войти'}
                        </button>
                    </form>
                )}
            </>
        </Modal>
    );
};

export default AuthForm;
