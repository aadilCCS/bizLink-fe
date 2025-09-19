
declare const require: any;

export const environment = {
    production: false,
    appVersion: require('../../package.json').version,

    API_URL: 'http://localhost:8000/v1/',
    GOOGLE_KEY: '918738585769-3kedsedav5g2hbk669o7g2m14n7q59ad.apps.googleusercontent.com',
    recaptcha: {
        siteKey: '6LdQfBArAAAAAPvXmmM7f0-77xg4DnIibT_qJ7Mm'
    }
};