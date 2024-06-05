import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_URL_API,
    prepareHeaders: (headers) => {
        headers.set("ngrok-skip-browser-warning", 'ngrok-skip-browser-warning');
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const socksApi = createApi({
    reducerPath: 'socksApi',
    tagTypes: ['CartItems', 'UserTags', 'Items', 'Stock'],
    baseQuery,
    endpoints: (builder) => ({
        sendCode: builder.mutation({
            query: (email) => ({
                url: '/auth/send-code',
                method: 'POST',
                body: { email },
            }),
        }),
        register: builder.mutation({
            query: ({ name, email, password, code, phone }) => ({
                url: '/auth/register',
                method: 'POST',
                body: { name, email, password, code, phone },
            }),
        }),
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: '/auth/login',
                method: 'POST',
                body: { email, password },
            }),
            invalidatesTags: [{ type: 'UserTags' }],
        }),

        getUserInfo: builder.query({
            query: () => ({
                url: '/auth/profile',
            }),
            providesTags: ['UserTags'],
        }),

        getUserOrders: builder.query({
            query: () => ({
                url: '/orders',
            }),
            providesTags: ['UserTags'],
        }),
        updateUserPassword: builder.mutation({
            query: ({ currentPassword, newPassword }) => ({
                url: '/users/update-password',
                method: 'PUT',
                body: { currentPassword, newPassword },
            }),
        }),
        updateUserInfo: builder.mutation({
            query: ({ name, email, phone, code }) => ({
                url: '/users/update',
                method: 'PUT',
                body: { name, email, phone, code },
            }),
            invalidatesTags: [{ type: 'UserTags' }],
        }),

        getItems: builder.query({
            query: () => '/tovars',
            providesTags: ['Items'],
        }),
        addToCart: builder.mutation({
            query: ({ itemId, sizeId, item }) => ({
                url: '/cart',
                method: 'POST',
                body: { itemId, sizeId, item },
            }),
            invalidatesTags: [{ type: 'Items'}],
        }),
        getSizes: builder.query({
            query: () => '/sizes',
            invalidatesTags: [{ type: 'Items'}],
        }),
        getStock: builder.query({
            query: (currentItemId) => `/stock/item/${currentItemId}`,
            invalidatesTags: [{ type: 'Items'}],
        }),
        getAllStock: builder.query({
            query: () => '/stock',
            invalidatesTags: [{ type: 'UserTags' }],
        }),
        addSizeToCart: builder.mutation({
            query: ({ itemId, sizeId }) => ({
                url: '/cart/size',
                method: 'POST',
                body: { itemId, sizeId },
            }),
            invalidatesTags: [{ type: 'CartItems', id: 'LIST' }],
        }),
        showCart: builder.query({
            query: () => ({
                url: '/show_cart',
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'CartItems', id })),
                        { type: 'CartItems', id: 'LIST' },
                    ]
                    : [{ type: 'CartItems', id: 'LIST' }],
        }),
        deleteCartItem: builder.mutation({
            query: (itemId) => ({
                url: `/show_cart/delete/${itemId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'CartItems', id: 'LIST' }],
        }),
        deleteAllCartItems: builder.mutation({
            query: () => ({
                url: `/cart/clear`,
                method: 'DELETE',
            }),
            invalidatesTags: ['CartItems'],
        }),
        decrementCartItem: builder.mutation({
            query: (itemId) => ({
                url: `/show_cart/decrement/${itemId}`,
                method: 'PUT',
            }),
            invalidatesTags: [{ type: 'CartItems', id: 'LIST' }],
        }),
        incrementCartItem: builder.mutation({
            query: (itemId) => ({
                url: `/show_cart/increment/${itemId}`,
                method: 'PUT',
            }),
            invalidatesTags: [{ type: 'CartItems', id: 'LIST' }],
        }),

        addFavorite: builder.mutation({
            query: (itemId) => ({
                url: '/add-to-favorites',
                method: 'POST',
                body: { itemId },
            }),
            invalidatesTags: [{ type: 'Items'}],
        }),
        removeFavorite: builder.mutation({
            query: (itemId) => ({
                url: `/favorites/${itemId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Items'}],
        }),
        getFavorites: builder.query({
            query: () => '/favorites',
            invalidatesTags: [{ type: 'Items'}],
        }),
        getDeliveryTypes: builder.query({
            query: () => '/delivery',
        }),
        getPaymentMethods: builder.query({
            query: () => '/payment',
        }),
        placeOrder: builder.mutation({
            query: (orderData) => ({
                url: '/order',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: [{ type: 'UserTags'}],
        }),
        cancelOrder: builder.mutation({
            query: (orderId) => ({
                url: `/cancel-order/${orderId}`,
                method: 'PATCH',
            }),
            invalidatesTags: [{ type: 'UserTags'}],
        }),
    }),
});

export const {
    useGetItemsQuery,
    useAddToCartMutation, useAddSizeToCartMutation,
    useGetSizesQuery, useGetStockQuery, useGetAllStockQuery,
    useShowCartQuery, useDeleteCartItemMutation, useDecrementCartItemMutation, useIncrementCartItemMutation, useDeleteAllCartItemsMutation,
    useSendCodeMutation, useRegisterMutation, useLoginMutation,
    useGetUserInfoQuery, useGetUserOrdersQuery, useUpdateUserPasswordMutation, useUpdateUserInfoMutation,
    useAddFavoriteMutation, useRemoveFavoriteMutation, useGetFavoritesQuery,
    useGetDeliveryTypesQuery, useGetPaymentMethodsQuery, usePlaceOrderMutation, useCancelOrderMutation
} = socksApi;

export const { reducer: socksApiReducer, middleware: socksApiMiddleware } = socksApi;
