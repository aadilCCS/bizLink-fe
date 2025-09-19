import { environment } from "environments/environment";

export const GlobalVariable = Object.freeze({
    BASE_URL: environment.API_URL,
});

export const ApiUrls = Object.freeze({

    LOGIN_USER: `${GlobalVariable.BASE_URL}auth/signIn`,
    ACCESS_CONTROLS: `${GlobalVariable.BASE_URL}auth/accessControls`,
    COMPANY_SETTINGS: `${GlobalVariable.BASE_URL}companySettings`,

    MEDIA_DOWNLOAD: `${GlobalVariable.BASE_URL}media/{0}/download`,
    MEDIA_UPLOAD: `${GlobalVariable.BASE_URL}media/upload`,
    SEARCH_BY_IMAGE: `${GlobalVariable.BASE_URL}search`,
    MEDIA: `${GlobalVariable.BASE_URL}media`,
    MEDIA_FE: `${GlobalVariable.BASE_URL}media-fe`,

    USERS: `${GlobalVariable.BASE_URL}users-fe`,
    GET_BUYERS: `${GlobalVariable.BASE_URL}get-buyers`,
    GET_SELLERS: `${GlobalVariable.BASE_URL}sellerWithProduct`,
    ROLE: `${GlobalVariable.BASE_URL}role`,
    CATEGORY: `${GlobalVariable.BASE_URL}category`,
    GET_ALL_CATEGORIES: `${GlobalVariable.BASE_URL}all-categories`,
    CART: `${GlobalVariable.BASE_URL}cart`,
    WISHLIST: `${GlobalVariable.BASE_URL}wishlist`,
    ORDER_PLACE: `${GlobalVariable.BASE_URL}order`,
    ORDER: `${GlobalVariable.BASE_URL}order`,
    ORDER_RETURN: `${GlobalVariable.BASE_URL}order-return`,
    ORDER_EXPORT_PDF: `${GlobalVariable.BASE_URL}order/export/pdf`,
    USER_ORDER: `${GlobalVariable.BASE_URL}order/user`,
    ADDRESS: `${GlobalVariable.BASE_URL}address`,
    GET_HEADER_COUNT: `${GlobalVariable.BASE_URL}get-header-count`,
    SUB_CATEGORY: `${GlobalVariable.BASE_URL}subCategory`,
    PRODUCT : `${GlobalVariable.BASE_URL}product`,
    REVIEW : `${GlobalVariable.BASE_URL}product/review`,
    FRONT_PRODUCT : `${GlobalVariable.BASE_URL}front-product`,
    LATEST_PRODUCT: `${GlobalVariable.BASE_URL}latest-product`,
    PRODUCT_FILTERED: `${GlobalVariable.BASE_URL}products/filtered`,
    PRODUCT_MODEL: `${GlobalVariable.BASE_URL}product-model`,
    BANNER : `${GlobalVariable.BASE_URL}banner`,
    BLOG : `${GlobalVariable.BASE_URL}blog`,
    PRE_DEFINED_QA : `${GlobalVariable.BASE_URL}preDefinedQA`,
    COUNTRY: `${GlobalVariable.BASE_URL}country`,
    STATE: `${GlobalVariable.BASE_URL}state`,
    CITY: `${GlobalVariable.BASE_URL}city`,
    PACKAGE: `${GlobalVariable.BASE_URL}package`,
    PRIVACYPOLICY: `${GlobalVariable.BASE_URL}privacyPolicy`,
    TERMSCONDITION: `${GlobalVariable.BASE_URL}termsCondition`,
    ABOUTUS: `${GlobalVariable.BASE_URL}aboutUs`,
    VARIANT_NAME: `${GlobalVariable.BASE_URL}variantName`,
    VARIANT_VALUE: `${GlobalVariable.BASE_URL}variantValue`,

    // Chat endpoints
    CHAT: `${GlobalVariable.BASE_URL}chat`,
    CHAT_SESSION: `${GlobalVariable.BASE_URL}chat/session`,
    CHAT_REQUEST_ADMIN: `${GlobalVariable.BASE_URL}chat/request-admin`,
    CHAT_ADMIN_SESSIONS: `${GlobalVariable.BASE_URL}chat/admin/sessions`,

});

export const StorageConst = Object.freeze({
    TOKEN: 'accessToken',
    CURRENT_USER: 'currentUser',
    COMPANY_DETAILS: 'companyDetails',
    COMPANY_LOGO: 'appBranding',
});
