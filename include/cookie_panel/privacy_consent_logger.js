/**
 * Система логирования согласий на обработку персональных данных
 * @version 2.0.0 - Адаптировано для Bitrix веб-форм
 */

class PrivacyConsentLogger {
    constructor() {
        this.apiUrl = '/bitrix/components/pixelplus/privacy.consent/ajax.php';
        this.init();
    }

    init() {
        // Глобально слушаем события submit на всех формах
        document.addEventListener('submit', (event) => {
            this.handleFormSubmit(event, event.target);
        });
    }

    /**
     * Находит чекбокс согласия на обработку ПД в форме
     */
    findPrivacyCheckbox(form) {
        // Приоритетные селекторы для ваших форм
        const selectors = [
            'input[name="privacy_agreement"]',  // Основной чекбокс согласия
            'input[name*="privacy"]',
            'input[name*="agreement"]',
            'input[name*="consent"]',
            'input[name*="personal"]',
            'input[name*="policy"]',
            'input[id*="privacy"]',
            'input[id*="agreement"]',
            'input[id*="consent"]',
            'input.footer-info__checkbox-input',  // Специфичный класс вашей формы
            'input[type="checkbox"][required]'
        ];

        for (const selector of selectors) {
            const checkbox = form.querySelector(selector);
            if (checkbox && checkbox.type === 'checkbox') {
                console.log('Найден чекбокс согласия:', selector, checkbox);
                return checkbox;
            }
        }

        return null;
    }

    /**
     * Обработчик отправки формы
     */
    async handleFormSubmit(event, form) {
        // Проверяем, что это Bitrix веб-форма
        if (!this.isBitrixForm(form)) {
            return;
        }

        const privacyCheckbox = this.findPrivacyCheckbox(form);

        console.log('Обработка Bitrix формы:', form.name || form.id, 'Чекбокс согласия:', privacyCheckbox);
        
        // Проверяем, что чекбокс согласия отмечен
        if (!privacyCheckbox || !privacyCheckbox.checked) {
            console.log('Согласие не дано или чекбокс не найден - пропускаем логирование');
            return;
        }

        const formData = this.extractFormData(form);

        console.log('Извлеченные данные формы:', formData);
        
        // Проверяем, есть ли email или телефон в форме
        if (!formData.email && !formData.phone) {
            console.log('Нет контактных данных - пропускаем логирование');
            return;
        }

        try {
            const result = await this.logConsent(formData);
            console.log('Согласие успешно зарегистрировано:', result);
        } catch (error) {
            console.warn('Ошибка при логировании согласия на обработку ПД:', error);
            // Не блокируем отправку формы при ошибке логирования
        }
    }

    /**
     * Проверяет, является ли форма Bitrix веб-формой
     */
    isBitrixForm(form) {
        // Проверяем наличие специфичных для Bitrix полей
        const bitrixIndicators = [
            'input[name="WEB_FORM_ID"]',
            'input[name="bxajaxid"]',
            'input[name="AJAX_CALL"]',
            'input[name="sessid"]',
            'input[name^="form_text_"]',
            'input[name^="form_dropdown_"]',
            'input[name^="form_file_"]'
        ];

        return bitrixIndicators.some(selector => form.querySelector(selector) !== null);
    }

    /**
     * Извлекает данные из Bitrix формы
     */
    extractFormData(form) {
        const formData = new FormData(form);
        const data = {
            email: '',
            phone: '',
            form_name: this.getFormName(form),
            url: window.location.href
        };

        console.log('Извлечение данных из Bitrix формы. Все поля:', Array.from(formData.entries()));

        // Специальные поля для Bitrix форм - ищем поля с префиксом form_text_
        const allFields = Array.from(formData.entries());
        
        // Ищем email в полях формы
        for (const [fieldName, value] of allFields) {
            if (value && typeof value === 'string') {
                // Проверяем, является ли значение email
                if (this.isValidEmail(value)) {
                    data.email = value;
                    console.log('Найден email в поле:', fieldName, '=', value);
                    break;
                }
            }
        }

        // Ищем телефон в полях формы
        for (const [fieldName, value] of allFields) {
            if (value && typeof value === 'string') {
                // Проверяем, является ли значение телефоном
                if (this.isValidPhone(value)) {
                    data.phone = value;
                    console.log('Найден телефон в поле:', fieldName, '=', value);
                    break;
                }
            }
        }

        // Дополнительно проверяем стандартные имена полей
        const emailFields = ['email', 'mail', 'e-mail', 'user_email', 'contact_email'];
        const phoneFields = ['phone', 'tel', 'telephone', 'mobile', 'user_phone', 'contact_phone'];

        // Если email не найден, ищем по стандартным именам
        if (!data.email) {
            for (const field of emailFields) {
                const value = formData.get(field);
                if (value && this.isValidEmail(value)) {
                    data.email = value;
                    break;
                }
            }
        }

        // Если телефон не найден, ищем по стандартным именам
        if (!data.phone) {
            for (const field of phoneFields) {
                const value = formData.get(field);
                if (value && this.isValidPhone(value)) {
                    data.phone = value;
                    break;
                }
            }
        }

        console.log('Финальные извлеченные данные:', data);
        return data;
    }

    /**
     * Получает название Bitrix формы
     */
    getFormName(form) {
        // Сначала проверяем WEB_FORM_ID (специфично для Bitrix)
        const webFormId = form.querySelector('input[name="WEB_FORM_ID"]');
        if (webFormId && webFormId.value) {
            return `Веб-форма #${webFormId.value}`;
        }

        // Проверяем атрибут name формы (например, SIMPLE_FORM_4)
        if (form.name) {
            // Делаем название более читаемым
            if (form.name.startsWith('SIMPLE_FORM_')) {
                const formNumber = form.name.replace('SIMPLE_FORM_', '');
                return `Простая форма #${formNumber}`;
            }
            return form.name;
        }

        // Проверяем ID формы
        if (form.id) return form.id;

        // Ищем заголовок формы в родительских элементах
        const title = form.querySelector('.form-footer__title, .form-title, h1, h2, h3, h4, h5, h6, .title');
        if (title) {
            const titleText = title.textContent.trim();
            if (titleText) return titleText;
        }

        // Ищем заголовок в родительском элементе
        const parentTitle = form.closest('.form-footer')?.querySelector('.form-footer__title');
        if (parentTitle) {
            const titleText = parentTitle.textContent.trim();
            if (titleText) return titleText;
        }
        
        // Ищем кнопку отправки
        const submitButton = form.querySelector('input[type="submit"], button[type="submit"], button:not([type]), .footer-info__button');
        if (submitButton) {
            const buttonText = submitButton.value || submitButton.textContent || submitButton.getAttribute('placeholder');
            if (buttonText && buttonText.trim()) {
                return `Форма "${buttonText.trim()}"`;
            }
        }

        // Проверяем первый класс CSS
        if (form.className) {
            const firstClass = form.className.split(' ')[0];
            if (firstClass) return firstClass;
        }
        
        return 'Bitrix веб-форма';
    }

    /**
     * Валидация email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Валидация телефона (адаптировано для международных номеров)
     */
    isValidPhone(phone) {
        if (!phone || typeof phone !== 'string') return false;
        
        // Очищаем телефон от всех символов кроме цифр и +
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        
        // Проверяем различные форматы телефонов
        // Международный формат: +7XXXXXXXXXX, +48XXXXXXXXX и т.д.
        // Российский формат: 8XXXXXXXXXX
        // Минимум 10 цифр, максимум 15
        if (cleanPhone.length < 10 || cleanPhone.length > 15) {
            return false;
        }
        
        // Проверяем что это похоже на телефон
        const phonePatterns = [
            /^\+\d{10,14}$/,     // +7xxxxxxxxxx
            /^8\d{10}$/,         // 8xxxxxxxxxx (Россия)
            /^\d{10,11}$/        // простые номера
        ];
        
        return phonePatterns.some(pattern => pattern.test(cleanPhone));
    }

    /**
     * Отправляет согласие на сервер
     */
    async logConsent(data) {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: new URLSearchParams(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Неизвестная ошибка');
        }

        return result;
    }

    /**
     * Ручная регистрация согласия (для использования в кастомных формах)
     */
    async registerConsent(email, phone, formName) {
        const data = {
            email: email || '',
            phone: phone || '',
            form_name: formName || 'Ручная регистрация',
            url: window.location.href
        };

        return await this.logConsent(data);
    }
}

// Инициализируем систему логирования
const privacyConsentLogger = new PrivacyConsentLogger();

// Экспортируем для использования в других скриптах
window.PrivacyConsentLogger = PrivacyConsentLogger;
window.privacyConsentLogger = privacyConsentLogger;
