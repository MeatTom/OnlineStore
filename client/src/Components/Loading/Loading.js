import React from 'react';
import LoadingStyle from './Loading.module.scss'

const Loading = () => {
    return (
        <div className={LoadingStyle}>
            <p className={LoadingStyle.text}>Loading</p>
            <span className={LoadingStyle.spinner}/>
        </div>
    );
}

export default Loading;