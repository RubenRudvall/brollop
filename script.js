/* ==========================================================================
   HANNA & RUBEN BRÖLLOP - KLASSISK ANRIK & INTERAKTIVT SKRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // =====================================================================
    // 1. ANRIK NAVIGATION, STICKY SCROLL EFFECT & MOBILMENY
    // =====================================================================

    const mainNav = document.getElementById('mainNav');
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navLinks = document.getElementById('navLinks');

    function updateNavOnScroll() {
        if (!mainNav) return;
        
        // När man scrollat mer än 60px ner från toppen
        if (window.scrollY > 60) {
            mainNav.classList.add('nav-scrolled');
        } else {
            mainNav.classList.remove('nav-scrolled');
        }
    }

    window.addEventListener('scroll', updateNavOnScroll);
    updateNavOnScroll(); // Kör vid inladdning

    // Mobilmeny växling
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('is-active');
            navLinks.classList.toggle('mobile-nav-active');
        });
    }

    // Smidig scroll för alla # länkar samt automatisk stängning av mobilmeny
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            // Stäng mobilmeny vid klick
            if (mobileToggle && navLinks) {
                mobileToggle.classList.remove('is-active');
                navLinks.classList.remove('mobile-nav-active');
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = mainNav ? mainNav.offsetHeight : 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // =====================================================================
    // 2. NEDRÄKNINGSKLOCKA TILL BRÖLLOPSDAGEN (7 AUGUSTI 2027 KL 15:00)
    // =====================================================================

    const weddingDate = new Date('2027-08-07T15:00:00+02:00').getTime();

    const daysEl = document.getElementById('cntDays');
    const hoursEl = document.getElementById('cntHours');
    const minutesEl = document.getElementById('cntMinutes');
    const secondsEl = document.getElementById('cntSeconds');
    const countdownWrapper = document.getElementById('countdownContainer');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            if (countdownWrapper) {
                countdownWrapper.innerHTML = '<div class="countdown-done">💍 BRÖLLOPET ÄR HÄR! VÄLKOMNA! 💍</div>';
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = days;
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    if (daysEl) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }


    // =====================================================================
    // 3. INTERAKTIV GÄST-CHECKLISTA
    // =====================================================================

    const checkBoxes = document.querySelectorAll('.survival-check');
    const progressBarFill = document.getElementById('survivalProgress');
    const progressStatusText = document.getElementById('survivalStatus');

    function updateChecklistProgress() {
        if (!checkBoxes.length || !progressBarFill || !progressStatusText) return;

        const total = checkBoxes.length;
        const checkedCount = Array.from(checkBoxes).filter(cb => cb.checked).length;
        const percentage = Math.round((checkedCount / total) * 100);

        progressBarFill.style.width = percentage + '%';

        if (checkedCount === total) {
            progressStatusText.innerHTML = '🎉 <strong>Du är 100% redo för århundradets bröllop!</strong>';
            progressStatusText.style.color = '#2b7a4b';
        } else {
            progressStatusText.textContent = `${checkedCount} av ${total} punkter avklarade (${percentage}%)`;
            progressStatusText.style.color = 'var(--brass-dark)';
        }
    }

    checkBoxes.forEach(cb => {
        cb.addEventListener('change', updateChecklistProgress);
    });

});
