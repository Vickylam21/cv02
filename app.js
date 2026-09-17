const bookshelf = document.querySelector('#bookshelf');
const bookDialog = document.querySelector('#project-dialog');
const dialogContent = document.querySelector('#dialog-content');
let activeBook = null;
let activePage = 0;

const books = [
	{key:'projects', label:'01 / SELECTED WORK', title:'一些值得介绍的项目', shortTitle:'项目集', color:'coral', pages:portfolioData.projects},
	{key:'experience', label:'02 / EXPERIENCE', title:'走过的路', shortTitle:'经历册', color:'blue', pages:portfolioData.experience},
	{key:'notes', label:'03 / NOTES & THOUGHTS', title:'偶尔写点东西', shortTitle:'随想录', color:'lime', pages:portfolioData.notes}
];

function renderBookshelf() {
	bookshelf.innerHTML = books.map((book, index) => `<button class="book" data-book="${index}" style="--book-color:var(--${book.color})"><span class="book-spine">${book.label}</span><span class="book-cover"><span class="book-index">${String(index + 1).padStart(2, '0')}</span><strong>${book.shortTitle}</strong><span class="book-cover-line"></span><small>LIN YANG / 2026</small></span><span class="book-shadow"></span></button>`).join('');
	bookshelf.querySelectorAll('.book').forEach(book => book.addEventListener('click', () => openBook(Number(book.dataset.book))));
}

function pageMarkup(book, page, index) {
	if (book.key === 'projects') return `<div class="book-page-image"><img src="${page.image}" alt="${page.title}"></div><p class="eyebrow">${page.category.toUpperCase()} / ${page.year}</p><h2>${page.title}</h2><p>${page.detail}</p><span class="book-page-number">${String(index + 1).padStart(2, '0')} / ${book.pages.length.toString().padStart(2, '0')}</span>`;
	if (book.key === 'experience') return `<p class="eyebrow">${page.period}</p><h2>${page.company}</h2><p class="book-location">${page.location}</p><div class="page-rule"></div><p>持续学习，也持续交付。每一段经历都让我更接近“把复杂的事做得清楚”这件事。</p><span class="book-page-number">${String(index + 1).padStart(2, '0')} / ${book.pages.length.toString().padStart(2, '0')}</span>`;
	return `<p class="eyebrow">${page.date} / FIELD NOTES</p><h2>${page.title}</h2><div class="page-rule"></div><p>记录一个正在发生的念头，给日常留下一点可以回看的痕迹。</p><a class="text-link" href="mailto:linyang3639@163.com?subject=${encodeURIComponent(page.title)}">聊聊这篇 ↗</a><span class="book-page-number">${String(index + 1).padStart(2, '0')} / ${book.pages.length.toString().padStart(2, '0')}</span>`;
}

function openBook(bookIndex) {
	activeBook = books[bookIndex];
	activePage = 0;
	renderBookPage();
	bookDialog.showModal();
}

function renderBookPage() {
	const page = activeBook.pages[activePage];
	dialogContent.innerHTML = `<div class="book-reader"><div class="reader-topline"><span>${activeBook.label}</span><span>${activeBook.title}</span></div><div class="reader-page">${pageMarkup(activeBook, page, activePage)}</div><div class="reader-controls"><button class="reader-button" data-page="prev" ${activePage === 0 ? 'disabled' : ''}>← 上一页</button><span>翻页阅读</span><button class="reader-button" data-page="next" ${activePage === activeBook.pages.length - 1 ? 'disabled' : ''}>下一页 →</button></div></div>`;
	dialogContent.querySelector('[data-page="prev"]').addEventListener('click', () => { activePage -= 1; renderBookPage(); });
	dialogContent.querySelector('[data-page="next"]').addEventListener('click', () => { activePage += 1; renderBookPage(); });
}

if (bookDialog) {
	document.querySelector('.dialog-close').addEventListener('click', () => bookDialog.close());
	bookDialog.addEventListener('click', event => { if (event.target === bookDialog) bookDialog.close(); });
}
if (bookshelf) renderBookshelf();

const player = document.querySelector('.ipod-player');
const audio = document.querySelector('.ipod-audio');
const playButton = document.querySelector('.ipod-play');
const volumeButton = document.querySelector('.ipod-volume');
const progress = document.querySelector('.ipod-progress');

function updateProgress() {
	if (!audio.duration) return;
	progress.value = (audio.currentTime / audio.duration) * 100;
}

playButton.addEventListener('click', async () => {
	if (audio.paused) {
		try {
			await audio.play();
		} catch (error) {
			playButton.textContent = '▶';
			playButton.setAttribute('aria-label', '音乐暂时无法加载');
			return;
		}
		player.classList.add('is-playing');
		playButton.textContent = 'Ⅱ';
		playButton.setAttribute('aria-label', '暂停音乐');
	} else {
		audio.pause();
		player.classList.remove('is-playing');
		playButton.textContent = '▶';
		playButton.setAttribute('aria-label', '播放音乐');
	}
});

progress.addEventListener('input', () => {
	if (audio.duration) audio.currentTime = (progress.value / 100) * audio.duration;
});

volumeButton.addEventListener('click', () => {
	audio.muted = !audio.muted;
	volumeButton.textContent = audio.muted ? '×' : '◖';
	volumeButton.setAttribute('aria-label', audio.muted ? '恢复音量' : '静音');
});

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', () => {
	player.classList.remove('is-playing');
	playButton.textContent = '▶';
	playButton.setAttribute('aria-label', '播放音乐');
	progress.value = 0;
});

audio.addEventListener('error', () => {
	player.classList.remove('is-playing');
	playButton.textContent = '▶';
	playButton.setAttribute('aria-label', '音乐暂时无法加载');
});
