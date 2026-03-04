<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Application;
use Bitrix\Main\Context;

/**
 * Класс для работы с cookie согласием
 */
class CookieConsent
{
    /**
     * Проверяет, дал ли пользователь согласие на использование cookie
     * По умолчанию возвращает true если нет явного отказа
     * @return bool
     */
    public static function hasConsent()
    {
        $cookieConsent = $_COOKIE["cookieConsent"] ?? null;
        
        // Если cookie нет, возвращаем false чтобы показать панель
        // Если есть и равно true, значит пользователь дал согласие
        return $cookieConsent === "true";
    }

    /**
     * Проверяет, разрешены ли аналитические cookie
     * По умолчанию true, если пользователь не настраивал
     * @return bool
     */
    public static function isAnalyticalAllowed()
    {
        $settings = self::getSettings();

        return $settings['analytics'] === true;
    }

    /**
     * Проверяет, разрешены ли функциональные cookie
     * По умолчанию true, если пользователь не настраивал
     * @return bool
     */
    public static function isFunctionalAllowed()
    {
       $settings = self::getSettings();
        
        return $settings['marketing'] === true;
    }

    /**
     * Получает все настройки cookie
     * По умолчанию все включены
     * @return array
     */
    public static function getSettings()
    {
        $settings = $_COOKIE["cookieSettings"] ?? null;
        
        $defaultSettings = [
            'technical' => true,
            'analytics' => true,
            'marketing' => true
        ];
        
        if (!$settings) {
            return $defaultSettings;
        }
        
        $decoded = json_decode($settings, true);
        return is_array($decoded) ? array_merge($defaultSettings, $decoded) : $defaultSettings;
    }

    /**
     * Получает дату согласия
     * @return string|null
     */
    public static function getConsentDate()
    {
        return $_COOKIE["cookieConsentDate"] ?? null;
    }

    /**
     * Проверяет, не истекло ли согласие (по умолчанию 365 дней)
     * @param int $expireDays Количество дней, после которых согласие считается истекшим
     * @return bool
     */
    public static function isConsentValid($expireDays = 365)
    {
        if (!self::hasConsent()) {
            return false;
        }

        $consentDate = self::getConsentDate();
        if (!$consentDate) {
            return false;
        }

        $consentTime = strtotime($consentDate);
        $now = time();
        $daysDiff = ($now - $consentTime) / (24 * 60 * 60);

        return $daysDiff <= $expireDays;
    }

    /**
     * Включает код аналитики только если разрешено
     * По умолчанию разрешено, если пользователь явно не запретил
     * @param string $code HTML/JS код аналитики
     * @return string
     */
    public static function renderAnalytics($code)
    {
        if (self::isAnalyticalAllowed()) {
            return $code;
        }
        return '';
    }

    /**
     * Включает функциональный код только если разрешено
     * По умолчанию разрешено, если пользователь явно не запретил
     * @param string $code HTML/JS код
     * @return string
     */
    public static function renderFunctional($code)
    {
        if (self::isFunctionalAllowed()) {
            return $code;
        }
        return '';
    }
}
