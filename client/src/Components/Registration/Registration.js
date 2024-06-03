import React, { useState } from 'react';
import { useSendCodeMutation, useRegisterMutation } from '../../Services/socksApi';
import Modal from 'react-modal';
import ModalStyle from '../Registration/Registration.module.scss';
import InputMask from 'react-input-mask';
import AuthForm from '../Auth/Auth';
import ReactCodeInput from 'react-code-input';

const props = {
    inputStyle: {
        fontFamily: 'monospace',
        marginRight:  '5px',
        marginBottom:  '12px',
        MozAppearance: 'textfield',
        minWidth: '5%',
        maxWidth: '15%',
        borderRadius: '3px',
        fontSize: '14px',
        height: '25px',
        paddingLeft: '5px',
        backgroundColor: 'white',
        color: '#ff795e',
        border: '1px solid #ea9682'
    }
}

const RegistrationForm = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [nameValMessage, setNameValMessage] = useState('');
    const [passwordValMessage, setPasswordValMessage] = useState('');
    const [phoneValMessage, setPhoneValMessage] = useState('');

    const [sendCode] = useSendCodeMutation();
    const [register] = useRegisterMutation();

    const handleSendCode = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setErrorMessage('Пожалуйста, введите корректный email');
            return;
        }
        try {
            await sendCode(email).unwrap();
            setIsCodeSent(true);
        } catch (error) {
            if (error.status === 400 && error.data.error === 'Пользователь с таким email уже существует') {
                setErrorMessage('Аккаунт с данным email уже зарегистрирован.');
            } else {
                setErrorMessage('Ошибка при отправке кода подтверждения. Попробуйте снова.');
            }
        }
    };

    const handleRegistration = async (e) => {
        e.preventDefault();

        if (!name || !password || !code) {
            setErrorMessage('Пожалуйста, заполните все поля');
            return;
        }

        try {
            await register({ name, email, password, code, phone }).unwrap();
            setIsSuccess(true);
        } catch (error) {
            setErrorMessage('Ошибка при регистрации пользователя. Убедитесь, что код подтверждения верен.');
        }
    };

    const handleClose = () => {
        onClose();
    };

    const handleAuthClose = () => {
        setIsAuthOpen(false);
    };

    const handleAuthOpen = () => {
        setIsAuthOpen(true);
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        const trimmedValue = value.trim();
        setName(value);

        const isValidName = /^[а-яА-Яa-zA-Z\- ]{3,}$/.test(trimmedValue);

        setNameValMessage(
            !isValidName
                ? 'Неверный формат имени. Имя может содержать кириллицу, латиницу, тире и пробел'
                : trimmedValue.length < 3
                    ? 'Имя должно содержать как минимум 3 символа'
                    : ''
        );
    };


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrorMessage('');
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        const isValidPassword = value.length >= 5 && /^(?=.*[0-9])(?=.*[a-zA-Z])/.test(value);

        setPasswordValMessage(
            !isValidPassword
                ? 'Пароль должен содержать не менее 5 символов, хотя бы одну цифру и латинские буквы'
                : ''
        );
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        const cleanedValue = value.replace(/[\s-]+/g, '');

        setPhone(value);

        const isValidPhone = cleanedValue.length === 14;

        setPhoneValMessage(
            cleanedValue.length >= 2
                ? !isValidPhone
                    ? 'Некорректный формат номера телефона. Введите полный номер по маске.'
                    : ''
                : ''
        );
    };


    const handleEnteredCodeChange = (code) => {
        setCode(code.trim());
        setErrorMessage('');
    };

    const handleChangeEmail = () => {
        setIsCodeSent(false);
        setEmail('');
        setErrorMessage('');
    };

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel="Size Modal"
            className={`${ModalStyle.reg_modal} ${isAuthOpen ? ModalStyle.hidden : ''}`}
            overlayClassName={ModalStyle.reg_modal_overlay}
            appElement={document.getElementById('root')}
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
                    {!isCodeSent ? (
                        <form className={ModalStyle.reg_form} onSubmit={handleSendCode} noValidate>
                            <h2>Введите ваш email</h2>
                            {errorMessage && (
                                <p className={ModalStyle.reg_error_message}>{errorMessage}</p>
                            )}
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                            />
                            <button type="submit">Отправить код</button>
                        </form>
                    ) : (
                        <form className={ModalStyle.reg_form} onSubmit={handleRegistration}>
                            <h2>Регистрация</h2>
                            {errorMessage && (
                                <p className={ModalStyle.reg_error_message}>{errorMessage}</p>
                            )}
                            <input
                                type="text"
                                placeholder="Имя"
                                value={name}
                                onChange={handleNameChange}
                            />
                            <p className={ModalStyle.reg_error_message}>{nameValMessage}</p>

                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                disabled
                            />
                            <p onClick={handleChangeEmail} className={ModalStyle.change_email_btn}>Изменить почту</p>
                            <input
                                type="password"
                                placeholder="Пароль"
                                value={password}
                                onChange={handlePasswordChange}
                                autoComplete="off"
                            />
                            <p className={ModalStyle.reg_error_message}>{passwordValMessage}</p>
                            <p className={ModalStyle.code_message}>Введите код подтверждения с почты</p>
                            <ReactCodeInput
                                name="code"
                                type="number"
                                fields={6}
                                value={code}
                                onChange={handleEnteredCodeChange}
                                placeholder="Код подтверждения"
                                inputMode={"numeric"}
                                {...props}
                            />
                            <InputMask
                                mask="+7(999)999-99-99"
                                maskChar=" "
                                value={phone}
                                onChange={handlePhoneChange}
                            >
                                {(inputProps) => <input
                                    type="text"
                                    placeholder="Телефон"
                                    {...inputProps}
                                />}
                            </InputMask>
                            <p className={ModalStyle.reg_error_message}>{phoneValMessage}</p>
                            <button type="submit">Зарегистрироваться</button>
                        </form>
                    )}
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
