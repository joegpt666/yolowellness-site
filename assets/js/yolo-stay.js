(() => {
    const showcase = document.querySelector('[data-room-switcher]');
    const tablist = document.querySelector('.room-tabs');
    if (!showcase || !tablist) return;

    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    if (!tabs.length || panels.some(panel => !panel)) return;

    function select(index, moveFocus = false) {
        tabs.forEach((tab, position) => {
            const active = position === index;
            tab.setAttribute('aria-selected', String(active));
            tab.tabIndex = active ? 0 : -1;
            panels[position].hidden = !active;
            panels[position].classList.remove('motion-reveal', 'is-visible');
        });
        if (moveFocus) tabs[index].focus();
    }

    tabs.forEach((tab, index) => {
        panels[index].setAttribute('role', 'tabpanel');
        panels[index].setAttribute('aria-labelledby', tab.id);
        panels[index].tabIndex = 0;
        tab.addEventListener('click', () => select(index));
        tab.addEventListener('keydown', event => {
            let next;
            if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
            if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
            if (event.key === 'Home') next = 0;
            if (event.key === 'End') next = tabs.length - 1;
            if (next === undefined) return;
            event.preventDefault();
            select(next, true);
        });
    });

    showcase.classList.add('is-enhanced');
    tablist.hidden = false;
    select(0);
})();
