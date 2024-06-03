import React, { createContext, useContext, useState, useCallback } from 'react';
import NotificationStyle from './Notification.module.scss';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = 'info') => {
        setNotifications(prevNotifications => [
            ...prevNotifications,
            { id: Date.now(), message, type }
        ]);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prevNotifications =>
            prevNotifications.filter(notification => notification.id !== id)
        );
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification, removeNotification }}>
            {children}
            <div className={NotificationStyle.notificationsContainer}>
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        className={`${NotificationStyle.notification} ${NotificationStyle[notification.type]}`}
                    >
                        {notification.message}
                        <button onClick={() => removeNotification(notification.id)}>ОК</button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
