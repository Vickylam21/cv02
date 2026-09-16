const projectGrid = document.querySelector('#project-grid');
const filters = document.querySelector('#filters');
const dialog = document.querySelector('#project-dialog');
const dialogContent = document.querySelector('#dialog-content');

function renderFilters() {
	const categories = ['All', ...new Set(portfolioData.projects.map(project => project.category))];
	filters.innerHTML = categories.map((category, index) => `<button class="filter-button ${index === 0 ? 'active' : ''}" data-filter="${category}">${category}</button>`).join('');
	filters.addEventListener('click', event => {
		if (!event.target.matches('.filter-button')) return;
		document.querySelectorAll('.filter-button').forEach(button => button.classList.remove('active'));
		event.target.classList.add('active');
		renderProjects(event.target.dataset.filter);
	});
}

function renderProjects(filter = 'All') {
	const projects = filter === 'All' ? portfolioData.projects : portfolioData.projects.filter(project => project.category === filter);
	projectGrid.innerHTML = projects.map((project, index) => `<article class="project-card" data-index="${portfolioData.projects.indexOf(project)}"><div class="project-thumb" style="background:var(--${project.color})"><img src="${project.image}" alt="${project.title}" loading="lazy"><span class="project-number">0${index + 1} / ${project.category.toUpperCase()}</span></div><div class="project-info"><div><h3>${project.title}</h3><p>${project.description} · ${project.year}</p></div><span class="arrow">↗</span></div></article>`).join('');
	projectGrid.querySelectorAll('.project-card').forEach(card => card.addEventListener('click', () => openProject(Number(card.dataset.index))));
}

function openProject(index) {
	const project = portfolioData.projects[index];
	dialogContent.innerHTML = `<div class="dialog-body"><img src="${project.image}" alt="${project.title}"><p class="eyebrow">${project.category.toUpperCase()} / ${project.year}</p><h2>${project.title}</h2><p>${project.detail}</p></div>`;
	dialog.showModal();
}

function renderExperience() { document.querySelector('#experience-list').innerHTML = portfolioData.experience.map(item => `<div class="experience-row"><span class="period">${item.period}</span><h3>${item.company}</h3><p>${item.location}</p></div>`).join(''); }
function renderNotes() { document.querySelector('#notes-grid').innerHTML = portfolioData.notes.map(note => `<article class="note-card"><span class="note-meta">${note.date} / FIELD NOTES</span><h3>${note.title}</h3><a href="mailto:linyang3639@163.com?subject=${encodeURIComponent(note.title)}">阅读这篇 ↗</a></article>`).join(''); }

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
renderFilters(); renderProjects(); renderExperience(); renderNotes();
