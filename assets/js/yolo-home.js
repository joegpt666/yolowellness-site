(() => {
    const nav = document.querySelector('[data-nav]');
    const toggle = document.querySelector('[data-nav-toggle]');
    const form = document.getElementById('bookingForm');
    const arrival = document.getElementById('arrival-date');
    const departure = document.getElementById('departure-date');

    function closeMenu() {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
    }

    toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', event => {
        if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && nav.classList.contains('is-open')) {
            closeMenu();
            toggle.focus();
        }
    });
    document.addEventListener('click', event => {
        if (!event.target.closest('[data-header]')) closeMenu();
    });
    window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function nextDate(value) {
        const [year, month, day] = value.split('-').map(Number);
        return formatDate(new Date(year, month - 1, day + 1));
    }

    function updateDeparture() {
        arrival.setCustomValidity('');
        if (!arrival.value) return;
        departure.min = nextDate(arrival.value);
        if (!departure.value || departure.value <= arrival.value) departure.value = departure.min;
        departure.setCustomValidity('');
    }

    function refreshMinimum() {
        arrival.min = formatDate(new Date());
        if (!arrival.value || arrival.value < arrival.min) arrival.value = arrival.min;
        updateDeparture();
    }

    refreshMinimum();
    arrival.addEventListener('change', updateDeparture);
    departure.addEventListener('change', () => departure.setCustomValidity(''));
    window.addEventListener('pageshow', refreshMinimum);

    form.addEventListener('submit', event => {
        event.preventDefault();
        arrival.min = formatDate(new Date());
        if (!arrival.value || arrival.value < arrival.min) {
            arrival.setCustomValidity('Please select today or a later date.');
        }
        if (!departure.value || departure.value <= arrival.value) {
            departure.setCustomValidity('Please select a check-out date after check-in.');
        }
        if (!form.reportValidity()) return;

        const url = new URL(form.action);
        url.search = new URLSearchParams({
            locale: 'en', currency: 'THB',
            'items[0][adults]': document.getElementById('guests').value || '2',
            'items[0][children]': '0', 'items[0][infants]': '0',
            checkInDate: arrival.value, checkOutDate: departure.value, trackPage: 'yes'
        }).toString();
        window.open(url.toString(), '_blank', 'noopener,noreferrer');
    });
})();
