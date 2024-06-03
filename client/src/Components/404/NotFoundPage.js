import React from 'react';
import { Link } from 'react-router-dom';
import NotFoundPageStyle from './NotFoundPage.module.scss';

const NotFoundPage = () => {
    return (
        <div className={NotFoundPageStyle.wrapper}>
        <div className={NotFoundPageStyle.not_found}>
            <h1>404 - Страница не найдена</h1>
            <p>Извините, запрошенная вами страница не найдена.</p>
            <Link to="/">Вернуться на главную</Link>
        </div>
        </div>
    );
}

export default NotFoundPage;
