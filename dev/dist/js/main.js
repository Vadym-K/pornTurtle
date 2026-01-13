document.addEventListener('DOMContentLoaded', () => {
	langToggle();
	initThemeSwitcher();
	initMobileMenu();
});

function langToggle() {
	const langWraps = document.querySelectorAll('.lang-wrap');
    const langBtns = document.querySelectorAll('.lang-btn');

	if (!langBtns.length) return;

	langBtns.forEach(btn => {
		btn.addEventListener('click', function (e) {
			e.stopPropagation();

			const parent = this.closest('.lang-wrap');
			if (!parent) return;

			parent.classList.toggle('active');
		});
	});

	document.addEventListener('click', function (e) {
	    langWraps.forEach(wrap => {
			if (!wrap.contains(e.target)) {
				wrap.classList.remove('active');
			}
	    });
	});
}

function initThemeSwitcher() {
	const body = document.body;
	const lightBtn = document.querySelector('.theme-light');
	const darkBtn = document.querySelector('.theme-dark');
	const STORAGE_KEY = 'theme';

	if (!lightBtn || !darkBtn) return;

	function setTheme(theme) {
		body.classList.remove('dark', 'light');
		body.classList.add(theme);
		localStorage.setItem(STORAGE_KEY, theme);
	}

	const savedTheme = localStorage.getItem(STORAGE_KEY);
	setTheme(savedTheme || 'dark');

	lightBtn.addEventListener('click', function () {
		setTheme('light');
	});

	darkBtn.addEventListener('click', function () {
		setTheme('dark');
	});
}

function initMobileMenu() {
	const burger = document.querySelector('.burger');
	const mobSearch = document.querySelector('.mob-search');
	const header = document.querySelector('.header');
	const body = document.querySelector('body');

	if (!burger || !mobSearch || !header) return;

	const toggleNoScroll = (isMenuOpen) => {
		if (isMenuOpen) {
			body.classList.add('no-scroll');
		} else {
			body.classList.remove('no-scroll');
		}
	};

	burger.addEventListener('click', () => {
		const isMenuOpen = !header.classList.contains('open-menu');
		header.classList.toggle('open-menu', isMenuOpen);
		header.classList.remove('open-search');
		toggleNoScroll(isMenuOpen);
	});

	mobSearch.addEventListener('click', () => {
		const isSearchOpen = !header.classList.contains('open-search');
		header.classList.toggle('open-search', isSearchOpen);
		header.classList.remove('open-menu');
		toggleNoScroll(isSearchOpen);
	});
}
