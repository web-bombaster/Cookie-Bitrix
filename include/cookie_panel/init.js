// Инициализация cookie по умолчанию
(function() {
    'use strict';
    
    // Функция для получения cookie
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    // Функция для установки cookie
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
    }
    
    // Проверяем, есть ли уже согласие на cookie
    const hasConsent = getCookie('cookieConsent');
    
    // Если согласия нет, устанавливаем настройки по умолчанию (все включены)
    // но не устанавливаем cookieConsent чтобы панель показалась
    if (!hasConsent) {
        const defaultSettings = {
            essential: true,
            analytics: true,
            marketing: true,
            version: '1.0'
        };
        
        // Устанавливаем настройки по умолчанию
        setCookie('cookieSettings', JSON.stringify(defaultSettings), 365);
    }
    
})();
