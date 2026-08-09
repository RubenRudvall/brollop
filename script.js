/* ==========================================================================
   1800-s VINTAGE WEDDING WEBSITE - INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Live Countdown Timer (Target Date: 7 Augusti 2027 kl 15:00)
    const targetDate = new Date('August 7, 2027 15:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
            document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
            document.getElementById('cdMinutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('cdSeconds').textContent = String(seconds).padStart(2, '0');
        } else {
            document.getElementById('countdownWrapper').innerHTML = '<div style="font-family: var(--font-heading-serif); font-size: 1.5rem; color: var(--color-sage-dark);">Idag firar vi bröllop!</div>';
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);


    // 2. Audio Control Toggle
    const audioToggleBtn = document.getElementById('audioToggleBtn');
    const bgMusic = document.getElementById('bgMusic');
    const audioStatusText = document.getElementById('audioStatusText');
    let isPlaying = false;

    if (audioToggleBtn && bgMusic) {
        audioToggleBtn.addEventListener('click', () => {
            if (!isPlaying) {
                bgMusic.play().then(() => {
                    isPlaying = true;
                    audioStatusText.textContent = 'På (Spelar Pianoslinga)';
                    audioToggleBtn.style.background = 'var(--color-sage-primary)';
                }).catch(err => {
                    console.log('Audio playback prevented by browser:', err);
                    alert('Klicka för att godkänna musikuppspelning i din webbläsare.');
                });
            } else {
                bgMusic.pause();
                isPlaying = false;
                audioStatusText.textContent = 'Av';
                audioToggleBtn.style.background = 'var(--color-sage-dark)';
            }
        });
    }


    // 3. Navigation Bar Scroll & Mobile Menu Toggle
    const mainNav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }


    // 4. Wax Seal Interactive Click Effect
    const waxSeal = document.getElementById('waxSeal');
    if (waxSeal) {
        waxSeal.addEventListener('click', () => {
            waxSeal.style.transform = 'translateX(-50%) scale(1.25) rotate(5deg)';
            setTimeout(() => {
                waxSeal.style.transform = 'translateX(-50%) scale(1)';
            }, 300);
        });
    }


    // 5. Scroll Fade-In Intersection Observer
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        scrollObserver.observe(el);
    });


    // 6. Accordion (FAQ) Functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const isActive = accordionItem.classList.contains('active');

            // Close all items
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });

            // Toggle clicked item
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });


    // 7. RSVP Form Interactive Logic & Local Storage Persistence
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpConfirmation = document.getElementById('rsvpConfirmation');
    const summaryDetails = document.getElementById('summaryDetails');
    const resetRsvpBtn = document.getElementById('resetRsvpBtn');
    const partySizeSelect = document.getElementById('partySize');
    const plusOneGroup = document.getElementById('plusOneGroup');

    // Toggle Plus One Name field
    if (partySizeSelect && plusOneGroup) {
        partySizeSelect.addEventListener('change', () => {
            if (partySizeSelect.value === '2') {
                plusOneGroup.style.display = 'block';
            } else {
                plusOneGroup.style.display = 'none';
            }
        });
    }

    // Load saved RSVP if exists
    const savedRsvp = localStorage.getItem('wedding_rsvp_data');
    if (savedRsvp) {
        const data = JSON.parse(savedRsvp);
        showRsvpSummary(data);
    }

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById('guestName').value.trim(),
                email: document.getElementById('guestEmail').value.trim(),
                attendance: document.querySelector('input[name="attendance"]:checked').value,
                partySize: document.getElementById('partySize').value,
                plusOneName: document.getElementById('plusOneName').value.trim(),
                dietary: document.getElementById('dietary').value.trim(),
                songRequest: document.getElementById('songRequest').value.trim(),
                message: document.getElementById('messageText').value.trim(),
                submittedAt: new Date().toLocaleDateString('sv-SE')
            };

            // Save to localStorage
            localStorage.setItem('wedding_rsvp_data', JSON.stringify(formData));

            // Show Confirmation Summary
            showRsvpSummary(formData);
        });
    }

    function showRsvpSummary(data) {
        const isAttending = data.attendance === 'ja';
        
        summaryDetails.innerHTML = `
            <p style="margin-bottom: 6px;"><strong>Namn:</strong> ${escapeHtml(data.name)} (${escapeHtml(data.email)})</p>
            <p style="margin-bottom: 6px;"><strong>Deltagande:</strong> ${isAttending ? '<span style="color: var(--color-sage-primary); font-weight: 600;">Ja, kommer med glädje!</span>' : '<span style="color: var(--color-wax-red); font-weight: 600;">Nej, har tyvärr förhinder</span>'}</p>
            ${isAttending && data.partySize === '2' ? `<p style="margin-bottom: 6px;"><strong>Medföljande:</strong> ${escapeHtml(data.plusOneName || 'Ej angivet')}</p>` : ''}
            ${data.dietary ? `<p style="margin-bottom: 6px;"><strong>Specialkost/Allergier:</strong> ${escapeHtml(data.dietary)}</p>` : ''}
            ${data.songRequest ? `<p style="margin-bottom: 6px;"><strong>Önskelåt:</strong> ${escapeHtml(data.songRequest)}</p>` : ''}
            ${data.message ? `<p style="margin-bottom: 6px;"><strong>Hälsning:</strong> "<em>${escapeHtml(data.message)}</em>"</p>` : ''}
            <p style="font-size: 0.8rem; color: var(--color-text-light); margin-top: 10px;">Registrerat datum: ${data.submittedAt}</p>
        `;

        rsvpForm.classList.add('hidden');
        rsvpConfirmation.classList.remove('hidden');
    }

    if (resetRsvpBtn) {
        resetRsvpBtn.addEventListener('click', () => {
            rsvpConfirmation.classList.add('hidden');
            rsvpForm.classList.remove('hidden');
        });
    }


    // 8. Digital Guestbook Handling
    const guestbookForm = document.getElementById('guestbookForm');
    const entriesList = document.getElementById('entriesList');

    // Load saved guestbook entries
    const savedEntries = JSON.parse(localStorage.getItem('wedding_guestbook_entries') || '[]');
    savedEntries.forEach(entry => {
        appendGuestbookEntry(entry.author, entry.message, entry.date, false);
    });

    if (guestbookForm) {
        guestbookForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const author = document.getElementById('gbAuthor').value.trim();
            const message = document.getElementById('gbMessage').value.trim();
            const dateStr = 'Alldeles nyss';

            if (author && message) {
                appendGuestbookEntry(author, message, dateStr, true);

                // Save entry to localStorage
                savedEntries.unshift({ author, message, date: dateStr });
                localStorage.setItem('wedding_guestbook_entries', JSON.stringify(savedEntries));

                // Reset form
                guestbookForm.reset();
            }
        });
    }

    function appendGuestbookEntry(author, message, date, animate = true) {
        const item = document.createElement('div');
        item.className = 'gb-entry-item';
        if (animate) {
            item.style.animation = 'fadeInUp 0.5s ease forward';
        }

        item.innerHTML = `
            <div class="gb-entry-header">
                <strong class="gb-author"><i class="fa-solid fa-heart"></i> ${escapeHtml(author)}</strong>
                <span class="gb-date">${escapeHtml(date)}</span>
            </div>
            <p class="gb-text">"${escapeHtml(message)}"</p>
        `;

        entriesList.insertBefore(item, entriesList.firstChild);
    }

    // Helper: Utility to escape HTML strings
    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

});
