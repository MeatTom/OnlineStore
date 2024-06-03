import { configureStore } from '@reduxjs/toolkit';
import { socksApi, socksApiMiddleware, socksApiReducer } from '../Services/socksApi';

const store = configureStore({
    reducer: {
        [socksApi.reducerPath]: socksApiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(socksApiMiddleware),
});


export default store;
