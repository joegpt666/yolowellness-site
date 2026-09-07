(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || !('IntersectionObserver' in window)) return;

    const targets = document.querySelectorAll([
        '.intro-copy', '.house-photo', '.section-heading', '.room-card',
        '.experience-image', '.experience-copy', '.perk', '.review-grid blockquote',
        '.story-copy', '.people-photo', '.people-copy', '.values-grid article',
        '.split-feature > *', '.gallery-feature > *', '.gallery-item',
        '.contact-overview article', '.contact-copy', '.contact-form',
        '.room-detail-card', '.rooms-booking-panel', '.map-section'
    ].join(', '));
    let observer;

    function show(element, delay = 0) {
        element.style.setProperty('--reveal-delay', `${delay}ms`);
        element.classList.add('is-visible');
        if (observer) observer.unobserve(element);
    }

    function showEverything() {
        if (observer) observer.disconnect();
        targets.forEach(element => {
            element.classList.remove('motion-reveal', 'is-visible');
            element.style.removeProperty('--reveal-delay');
        });
        document.querySelectorAll('.motion-intro').forEach(element => {
            element.classList.remove('motion-intro');
            element.style.removeProperty('--entrance-delay');
        });
    }

    try {
        observer = new IntersectionObserver(entries => {
            entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
                show(entry.target, Math.min(index, 2) * 65);
            });
        }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

        // Leave content already on screen visible, including restored scroll positions.
        targets.forEach(element => {
            if (element.getBoundingClientRect().top < window.innerHeight) return;
            element.classList.add('motion-reveal');
            observer.observe(element);
        });

        if (!window.location.hash && window.scrollY < 24) {
            document.querySelectorAll(
                '.hero-content > *, .page-hero-copy > *, .rooms-hero-copy > *'
            ).forEach((element, index) => {
                element.style.setProperty('--entrance-delay', `${Math.min(index, 4) * 75}ms`);
                element.classList.add('motion-intro');
            });
        }

        document.addEventListener('focusin', event => {
            const target = event.target.closest('.motion-reveal');
            if (target) show(target);
        });
        preference.addEventListener('change', event => {
            if (event.matches) showEverything();
        });
        window.addEventListener('pageshow', event => {
            if (event.persisted) showEverything();
        });
        window.addEventListener('beforeprint', showEverything);
    } catch {
        // Motion is optional; a failed setup must never leave content hidden.
        showEverything();
    }
})();
