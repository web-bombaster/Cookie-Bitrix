<?php
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

use Bitrix\Main\Page\Asset;
use Bitrix\Main\Application;

// Настройки панели cookie (можно изменить при необходимости)
$cookieSettings = [
    'show_panel' => true,
    'policy_url' => '/privacy-policy/',
    'expire_days' => 365,
];

// Проверяем, нужно ли показывать панель
if (!$cookieSettings['show_panel']) {
    return;
}

// Подключаем стили и скрипты
$templatePath = "/local/include/cookie_panel";
Asset::getInstance()->addCss($templatePath . "/styles.css");
Asset::getInstance()->addJs($templatePath . "/init.js");
Asset::getInstance()->addJs($templatePath . "/script.js");
Asset::getInstance()->addJs($templatePath . "/privacy_consent_logger.js");
?>
<!--noindex-->
<div class="cookies <? echo CookieConsent::hasConsent() ? "toggle" : ""; ?>">
    <form class="cookies__wrapper">
        <div class="cookies__info">
            <p class="cookies__title">Мы используем файлы cookie</p>
            <div class="cookies__descr">
                <p>Наш сайт использует файлы cookie для аналитики и персонализации. Продолжая использовать сайт после ознакомления с этим сообщением и предоставления
                    своего
                    выбора, вы соглашаетесь с нашей <a href="https://baikalvl.ru/privacy-policy/">Политикой обработки персональных данных</a></p>
            </div>

        </div>

        <div class="cookies__settings">
            <div class="cookies__top">
                <p class="cookies__title">Настройка cookie</p>
                <div class="cookies__back">
                    <svg class="cookies__arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9.75722 19.5156C10.089 19.8635 10.0795 20.418 9.73606 20.7541C9.39258 21.0902 8.84516 21.0806 8.51337 20.7327L4 16L8.51337 11.2673C8.84516 10.9194 9.39258 10.9098 9.73606 11.2459C10.0795 11.582 10.089 12.1365 9.75722 12.4844L7.35819 15L13.5 15C15.9853 15 18 12.9853 18 10.5C18 8.01472 15.9853 6 13.5 6L11 6C10.4477 6 10 5.55228 10 5C10 4.44772 10.4477 4 11 4L13.5 4C17.0899 4 20 6.91015 20 10.5C20 14.0899 17.0899 17 13.5 17L7.35818 17L9.75722 19.5156Z"
                            fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            <div class="cookies__descr">
                <p>
                    Технические cookie нужны для стабильной работы. Аналитические и другие cookie помогают нам делать сайт лучше для вас: понимать, что вам интересно, и улучшать навигацию.
                    Эти данные анонимны. Разрешая их, вы вносите свой вклад в развитие нашего сайта. Подробности в <a href="https://baikalvl.ru/privacy-policy/">Политике обработки персональных данных</a>.
                </p>
            </div>
        </div>

        <div class="cookies__acc cookies-acc">
            <div class="cookies-acc__item">
                <div class="cookies-acc__top">
                    <p class="cookies-acc__title">Технические Cookie</p>
                    <label class="cookies-acc__label">
                        <input class="cookies-acc__checkbox" type="checkbox" name="technicalCookies" checked disabled>
                        <span class="cookies-acc__switch"></span>
                    </label>
                </div>
                <div class="cookies-acc__descr">
                    <p>Эти файлы cookie необходимы для правильной работы сайта и его основных функций (например, навигация, сохранение сессии, работа форм). Без них
                        сайт не сможет
                        функционировать должным образом. Они не собирают информацию для маркетинга или отслеживания.
                        Этот тип cookie нельзя отключить.</p>
                </div>
            </div>
            <div class="cookies-acc__item">
                <div class="cookies-acc__top">
                    <p class="cookies-acc__title">Аналитические/Рекламные cookie</p>
                    <label class="cookies-acc__label">
                        <input class="cookies-acc__checkbox" type="checkbox" name="analyticalCookies" <? echo (CookieConsent::isAnalyticalAllowed() ? "checked" : ""); ?>>
                        <span class="cookies-acc__switch"></span>
                    </label>
                </div>
                <div class="cookies-acc__descr">
                    <p>Эти файлы cookie позволяют нам собирать информацию о том, как посетители используют наш сайт (например, какие страницы посещают чаще, сколько
                        времени проводят на сайте,
                        возникают ли ошибки). Эта информация собирается в агрегированном или обезличенном виде и используется для анализа и улучшения работы сайта.
                        Данные обрабатываются
                        Яндекс.Метрикой согласно ее политике конфиденциальности (см. сайт Яндекса). Эти cookie активны только с вашего согласия.</p>
                </div>
            </div>
            <div class="cookies-acc__item">
                <div class="cookies-acc__top">
                    <p class="cookies-acc__title">Функциональные (остальные) cookie</p>
                    <label class="cookies-acc__label">
                        <input class="cookies-acc__checkbox" type="checkbox" name="functionalCookies" <? echo (CookieConsent::isFunctionalAllowed() ? "checked" : ""); ?>>
                        <span class="cookies-acc__switch"></span>
                    </label>
                </div>
                <div class="cookies-acc__descr">
                    <p>Эти файлы cookie позволяют сайту запоминать сделанный вами выбор и предоставлять расширенные функции для вашего удобства. Они также могут
                        использоваться для обеспечения
                        работы встроенных на сайт сервисов (например, видеоплееров от Vimeo, виджетов социальных сетей VK), которые улучшают ваш опыт взаимодействия с
                        сайтом. Эти сервисы могут
                        устанавливать свои cookie для корректной работы и запоминания предпочтений. Эти cookie активны только с вашего согласия.</p>
                </div>
            </div>
        </div>

        <div class="cookies__btns">
            <button class="cookies__btn cookies__btn--fill all">Разрешить все</button>
            <div class="cookies__btn settings">Настройка</div>
            <button class="cookies__btn cookies__btn--fill selected toggle">Разрешить выбранные</button>
        </div>

    </form>
</div>
<!--/noindex-->