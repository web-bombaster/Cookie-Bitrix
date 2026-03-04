<?php
/**
 * Пример использования CookieConsent для управления аналитикой
 * Этот файл можно подключить в header.php или footer.php
 */

if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

// Яндекс.Метрика (показывается только если разрешена аналитика)
echo CookieConsent::renderAnalytics('
<!-- Yandex.Metrika counter -->
<script type="text/javascript">
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/watch.js", "ym");

   ym(12345678, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/12345678" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
');

// Google Analytics (показывается только если разрешена аналитика)
echo CookieConsent::renderAnalytics('
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag("js", new Date());

  gtag("config", "GA_MEASUREMENT_ID");
</script>
<!-- End Google Analytics -->
');

// Функциональные виджеты (показываются только если разрешены функциональные cookie)
echo CookieConsent::renderFunctional('
<!-- VK Widget -->
<script type="text/javascript" src="https://vk.com/js/api/openapi.js?169"></script>
<script type="text/javascript">
  VK.init({apiId: API_ID, onlyWidgets: true});
</script>
');

// Пример условного отображения в шаблоне
if (CookieConsent::isAnalyticalAllowed()) {
    // Подключаем дополнительные аналитические скрипты
    echo '<script>console.log("Analytics allowed");</script>';
}

if (CookieConsent::isFunctionalAllowed()) {
    // Подключаем функциональные виджеты
    echo '<script>console.log("Functional cookies allowed");</script>';
}
?>
