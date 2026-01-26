document.addEventListener('DOMContentLoaded', () => {
	langToggle();
	initThemeSwitcher();
	initMobileMenu();
	initHeaderScroll('.header', 'header-scrolled', '.main');
	initLinkHoverInfo();
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

	window.addEventListener('resize', () => {
		if (window.innerWidth > 911) {
			header.classList.remove('open-menu', 'open-search');
			body.classList.remove('no-scroll');
		}
	});
}

function initHeaderScroll(headerSelector, activeClass, mainSelector, minWidth = 911) {
	const header = document.querySelector(headerSelector);
	const main = document.querySelector(mainSelector);

	if (!header || !main) return;

	let isActive = false;
	let lastScrollY = window.scrollY;
	const OFFSET = 50;

	function updateLayout() {
		const currentScrollY = window.scrollY;
		const isScrollingUp = currentScrollY < lastScrollY;

		if (window.innerWidth < minWidth) {
			isActive = false;
			header.classList.remove(activeClass);
			main.style.paddingTop = '';
			lastScrollY = currentScrollY;
			return;
		}

		if (
			window.innerWidth >= minWidth &&
			currentScrollY > OFFSET &&
			!isActive
		) {
			isActive = true;
			header.classList.add(activeClass);

			const headerHeight = header.offsetHeight;
			main.style.paddingTop = `${headerHeight + 130}px`;
		}

		if (
			isActive &&
			isScrollingUp &&
			currentScrollY <= OFFSET
		) {
			isActive = false;
			header.classList.remove(activeClass);
			main.style.paddingTop = '';
		}

		lastScrollY = currentScrollY;
	}

	window.addEventListener('scroll', updateLayout);
	window.addEventListener('resize', updateLayout);

	updateLayout();
}

function initLinkHoverInfo() {
	const MIN_WIDTH = 1025;
	const infoBlock = document.querySelector('.js-info');
	const header = document.querySelector('.header');

	if (!infoBlock) return;

	const infoImg = infoBlock.querySelector('.js-info-img');
	const infoTitle = infoBlock.querySelector('.js-info-title');
	const infoText = infoBlock.querySelector('.js-info-text');
	const ratingValueEl = infoBlock.querySelector('.js-info-rating');
	const ratingIconsWrap = infoBlock.querySelector('.js-rating');

	const LIKE_SRC = 'images/like.svg';
	const DISLIKE_SRC = 'images/dislike.svg';
	const MAX_RATING = 5;

	function isDesktop() {
		return window.innerWidth >= MIN_WIDTH;
	}

	function updateRating(rating) {
		const value = Math.max(0, Math.min(+rating || 0, MAX_RATING));

		if (ratingValueEl) {
			ratingValueEl.textContent = value;
		}

		if (ratingIconsWrap) {
			const icons = ratingIconsWrap.querySelectorAll('.js-rating .rate');

			icons.forEach((img, index) => {
				img.src = index < value ? LIKE_SRC : DISLIKE_SRC;
				img.alt = index < value ? 'Like' : 'Dislike';
			});
		}
	}

	function resetInfo() {
		infoBlock.classList.remove('active');
		if (header) header.classList.remove('header-hover');

		if (infoTitle) infoTitle.textContent = '';
		if (infoText) infoText.textContent = '';

		if (infoImg) {
			infoImg.classList.remove('active');
			infoImg.src = '';
			infoImg.alt = '';
		}

		if (ratingValueEl) ratingValueEl.textContent = '';
		if (ratingIconsWrap) {
			ratingIconsWrap.querySelectorAll('.js-rating .rate').forEach(img => {
				img.src = '';
				img.alt = '';
			});
		}
	}

	document.addEventListener('mouseover', (e) => {
		if (!isDesktop()) return;

		const link = e.target.closest('.js-link-hover');
		if (!link) return;

		infoBlock.classList.add('active');
		if (header) header.classList.add('header-hover');

		const titleEl = link.querySelector('.js-link-hover .text-name');
		const imgEl = link.querySelector('img');
		const rating = link.dataset.rating;

		const catBody = link.closest('.cat-body');
		const catText = catBody?.querySelector('.cat-text');

		if (titleEl && infoTitle) infoTitle.textContent = titleEl.textContent;
		if (imgEl && infoImg) {
			infoImg.classList.remove('active');

			infoImg.onload = () => {
				infoImg.classList.add('active');
			};

			infoImg.src = imgEl.src;
			infoImg.alt = imgEl.alt || '';
		}

		if (rating) updateRating(rating);
		if (infoText && catText) infoText.textContent = catText.textContent;
	});

	document.addEventListener('mouseout', (e) => {
		if (!isDesktop()) return;

		const link = e.target.closest('.js-link-hover');
		if (!link) return;

		if (!link.contains(e.relatedTarget)) {
			resetInfo();
		}
	});

	window.addEventListener('resize', () => {
		if (!isDesktop()) resetInfo();
	});
}