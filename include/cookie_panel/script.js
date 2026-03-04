document.addEventListener("DOMContentLoaded", function () {

	// Cookie управление
	const CookieManager = {
		// Устанавливаем cookie с настройками
		setCookie: function(name, value, days) {
			const expires = new Date();
			expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
			document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
		},

		// Получаем cookie
		getCookie: function(name) {
			const nameEQ = name + "=";
			const ca = document.cookie.split(';');
			for(let i = 0; i < ca.length; i++) {
				let c = ca[i];
				while (c.charAt(0) === ' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
			}
			return null;
		},

		// Получаем текущие настройки cookie
		getCurrentSettings: function() {
			const technicalCheckbox = document.querySelector('input[name="technicalCookies"]');
			const analyticalCheckbox = document.querySelector('input[name="analyticalCookies"]');
			const functionalCheckbox = document.querySelector('input[name="functionalCookies"]');

			return {
				essential: technicalCheckbox ? technicalCheckbox.checked : true,
				analytics: analyticalCheckbox ? analyticalCheckbox.checked : true,
				marketing: functionalCheckbox ? functionalCheckbox.checked : true,
				version: '1.0',
				timestamp: new Date().toISOString()
			};
		},

		// Отправляем настройки на сервер
		sendConsentToServer: function(settings) {
			const data = {
				consent: settings,
				userAgent: navigator.userAgent,
				url: window.location.href
			};

			fetch('/bitrix/components/pixelplus/cookie.consent/ajax.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Requested-With': 'XMLHttpRequest'
				},
				body: JSON.stringify(data)
			})
			.then(response => response.json())
			.then(data => {
				console.log('Cookie consent saved:', data);
			})
			.catch(error => {
				console.error('Error saving cookie consent:', error);
			});
		},

		// Сохраняем согласие
		saveConsent: function(settings) {
			// Сохраняем в cookie
			this.setCookie('cookieConsent', 'true', 365);
			this.setCookie('cookieSettings', JSON.stringify(settings), 365);
			this.setCookie('cookieConsentDate', new Date().toISOString(), 365);
			
			// Отправляем на сервер
			this.sendConsentToServer(settings);
			
			// Скрываем панель
			const cookiePanel = document.querySelector('.cookies');
			if (cookiePanel) {
				cookiePanel.classList.add('toggle');
			}
		}
	};

	// При клике на элемент переключаем, удаляем или добавляем класс для другого эелемента.
	// Параметры:
	// actionElement - класс элемета для клика,
	// targetElement - класс изменяемого элемента,
	// tagetClass - с каким классом выполняется действие, toggle по-умолчанию
	// targetAction - какое действие выполняем (toggle, remove, add), toggle по-умолчанию
	const classToggle = function (
		actionElement,
		targetElement,
		tagetClass = "toggle",
		targetAction = "toggle"
	) {
		if (document.querySelector(actionElement)) {
			const actionBtn = document.querySelectorAll(actionElement);
			const actionTarget = document.querySelectorAll(targetElement);
			actionBtn.forEach(function (element, index) {
				element.addEventListener("click", function (e) {
					e.preventDefault();
					if (targetAction === "toggle") {
						if (actionTarget[index].classList.contains(tagetClass)) {
							actionTarget[index].classList.remove(tagetClass);
						} else {
							actionTarget[index].classList.add(tagetClass);
						}
					}
					if (targetAction === "remove") {
						actionTarget[index].classList.remove(tagetClass);
					}
					if (targetAction === "add") {
						actionTarget[index].classList.add(tagetClass);
					}
				});
			});
		}
	};

	classToggle(".cookies__btn.settings", ".cookies__info", "toggle", "add");
	classToggle(".cookies__btn.settings", ".cookies__settings", "active", "add");
	classToggle(".cookies__btn.settings", ".cookies-acc", "active", "add");
	classToggle(".cookies__btn.settings", ".cookies__btn.all", "toggle", "add");
	classToggle(".cookies__btn.settings", ".cookies__btn.settings", "toggle", "add");
	classToggle(".cookies__btn.settings", ".cookies__btn.selected", "toggle", "remove");

	classToggle(".cookies__back", ".cookies__info", "toggle", "remove");
	classToggle(".cookies__back", ".cookies__settings", "active", "remove");
	classToggle(".cookies__back", ".cookies-acc", "active", "remove");
	classToggle(".cookies__back", ".cookies__btn.all", "toggle", "remove");
	classToggle(".cookies__back", ".cookies__btn.settings", "toggle", "remove");
	classToggle(".cookies__back", ".cookies__btn.selected", "toggle", "add");

	classToggle(".cookies-acc__title", ".cookies-acc__item");

	// Обработчик для кнопки "Разрешить все"
	const acceptAllBtn = document.querySelector('.cookies__btn.all');
	if (acceptAllBtn) {
		acceptAllBtn.addEventListener('click', function(e) {
			e.preventDefault();
			
			// Устанавливаем все чекбоксы в состояние "включено"
			const analyticalCheckbox = document.querySelector('input[name="analyticalCookies"]');
			const functionalCheckbox = document.querySelector('input[name="functionalCookies"]');
			
			if (analyticalCheckbox) analyticalCheckbox.checked = true;
			if (functionalCheckbox) functionalCheckbox.checked = true;
			
			// Сохраняем настройки
			const settings = CookieManager.getCurrentSettings();
			CookieManager.saveConsent(settings);
		});
	}

	// Обработчик для кнопки "Разрешить выбранные"
	const acceptSelectedBtn = document.querySelector('.cookies__btn.selected');
	if (acceptSelectedBtn) {
		acceptSelectedBtn.addEventListener('click', function(e) {
			e.preventDefault();
			
			// Сохраняем текущие настройки чекбоксов
			const settings = CookieManager.getCurrentSettings();
			CookieManager.saveConsent(settings);
		});
	}

	// Добавляем обработчики изменения чекбоксов
	const checkboxes = document.querySelectorAll('.cookies-acc__checkbox');
	checkboxes.forEach(function(checkbox) {
		// Исключаем технические cookie (они не могут быть отключены)
		if (checkbox.name !== 'technicalCookies') {
			checkbox.addEventListener('change', function() {
				// Если пользователь уже дал согласие, то отправляем обновленные настройки
				if (CookieManager.getCookie('cookieConsent') === 'true') {
					const settings = CookieManager.getCurrentSettings();
					// Обновляем cookie с новыми настройками
					CookieManager.setCookie('cookieSettings', JSON.stringify(settings), 365);
					// Отправляем на сервер
					CookieManager.sendConsentToServer(settings);
				}
			});
		}
	});

});