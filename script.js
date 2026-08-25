/* ==========================================================================
   THE WEDDING NEWS – INTERACTIVE SCRIPT (CROSSWORD & RSVP)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // =====================================================================
    // 1. INTERAKTIVT KORSORD (THE WEDDING CROSSWORD)
    // =====================================================================

    const gridContainer = document.getElementById('crosswordGrid');
    const checkBtn = document.getElementById('checkCrosswordBtn');
    const resetBtn = document.getElementById('resetCrosswordBtn');
    const feedbackText = document.getElementById('crosswordFeedback');

    const gridSize = 11; // 11x11 rutnät

    /**
     * Korsordslayout:
     * 1 Vågrätt: RUBEN (rad 1, kol 0-4)
     * 2 Lodrätt: HANNA (rad 0-4, kol 4) -> Intersekterar med RUBEN på 'N' vid (1,4)
     * 3 Vågrätt: GDANSK (rad 4, kol 2-7) -> Intersekterar med HANNA på 'A' vid (4,4)
     * 4 Vågrätt: TIO (rad 7, kol 3-5)
     * 5 Lodrätt: GUSTAFSBERG (rad 0-10, kol 8)
     */
    const crosswordData = [
        // Rad 0
        ['', '', '', '', { letter: 'H', num: 2 }, '', '', '', { letter: 'G', num: 5 }, '', ''],
        // Rad 1
        [{ letter: 'R', num: 1 }, { letter: 'U' }, { letter: 'B' }, { letter: 'E' }, { letter: 'N' }, '', '', '', { letter: 'U' }, '', ''],
        // Rad 2
        ['', '', '', '', { letter: 'N' }, '', '', '', { letter: 'S' }, '', ''],
        // Rad 3
        ['', '', '', '', { letter: 'N' }, '', '', '', { letter: 'T' }, '', ''],
        // Rad 4
        ['', '', { letter: 'G', num: 3 }, { letter: 'D' }, { letter: 'A' }, { letter: 'N' }, { letter: 'S' }, { letter: 'K' }, { letter: 'A' }, '', ''],
        // Rad 5
        ['', '', '', '', '', '', '', '', { letter: 'F' }, '', ''],
        // Rad 6
        ['', '', '', '', '', '', '', '', { letter: 'S' }, '', ''],
        // Rad 7
        ['', '', '', { letter: 'T', num: 4 }, { letter: 'I' }, { letter: 'O' }, '', '', { letter: 'B' }, '', ''],
        // Rad 8
        ['', '', '', '', '', '', '', '', { letter: 'E' }, '', ''],
        // Rad 9
        ['', '', '', '', '', '', '', '', { letter: 'R' }, '', ''],
        // Rad 10
        ['', '', '', '', '', '', '', '', { letter: 'G' }, '', '']
    ];

    function buildCrossword() {
        if (!gridContainer) return;
        gridContainer.innerHTML = '';

        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cellData = crosswordData[r][c];
                const cell = document.createElement('div');
                cell.classList.add('cw-cell');

                if (cellData === '') {
                    cell.classList.add('blocked');
                } else {
                    if (cellData.num) {
                        const numSpan = document.createElement('span');
                        numSpan.classList.add('cw-number');
                        numSpan.textContent = cellData.num;
                        cell.appendChild(numSpan);
                    }

                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.classList.add('cw-input');
                    input.dataset.row = r;
                    input.dataset.col = c;
                    input.dataset.solution = cellData.letter;

                    // Auto-hopp till nästa ruta vid inmatning
                    input.addEventListener('input', (e) => {
                        input.value = input.value.toUpperCase();
                        input.classList.remove('correct', 'incorrect');
                        if (input.value.length === 1) {
                            focusNextInput(r, c);
                        }
                    });

                    // Backspace för att backa
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Backspace' && input.value === '') {
                            focusPrevInput(r, c);
                        }
                    });

                    cell.appendChild(input);
                }

                gridContainer.appendChild(cell);
            }
        }
    }

    function focusNextInput(r, c) {
        const inputs = Array.from(gridContainer.querySelectorAll('.cw-input'));
        const currentIndex = inputs.findIndex(i => parseInt(i.dataset.row) === r && parseInt(i.dataset.col) === c);
        if (currentIndex !== -1 && currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        }
    }

    function focusPrevInput(r, c) {
        const inputs = Array.from(gridContainer.querySelectorAll('.cw-input'));
        const currentIndex = inputs.findIndex(i => parseInt(i.dataset.row) === r && parseInt(i.dataset.col) === c);
        if (currentIndex > 0) {
            inputs[currentIndex - 1].focus();
        }
    }

    if (checkBtn) {
        checkBtn.addEventListener('click', () => {
            const inputs = gridContainer.querySelectorAll('.cw-input');
            let correctCount = 0;
            let totalCount = inputs.length;

            inputs.forEach(input => {
                const val = input.value.trim().toUpperCase();
                const expected = input.dataset.solution.toUpperCase();

                if (val === expected) {
                    input.classList.add('correct');
                    input.classList.remove('incorrect');
                    correctCount++;
                } else if (val !== '') {
                    input.classList.add('incorrect');
                    input.classList.remove('correct');
                } else {
                    input.classList.remove('correct', 'incorrect');
                }
            });

            if (correctCount === totalCount) {
                feedbackText.style.color = '#2E7D32';
                feedbackText.textContent = '🎉 Strålande! Alla ord är helt korrekta!';
            } else {
                feedbackText.style.color = '#111111';
                feedbackText.textContent = `Du har ${correctCount} av ${totalCount} rätta bokstäver. Fortsätt kämpa!`;
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const inputs = gridContainer.querySelectorAll('.cw-input');
            inputs.forEach(input => {
                input.value = '';
                input.classList.remove('correct', 'incorrect');
            });
            if (feedbackText) feedbackText.textContent = '';
        });
    }

    buildCrossword();


    // =====================================================================
    // 2. INTERAKTIVT OSA-FORMULÄR (RSVP)
    // =====================================================================

    const rsvpForm = document.getElementById('gazetteRsvpForm');
    const rsvpDoneCard = document.getElementById('rsvpDoneCard');
    const rsvpSummaryBox = document.getElementById('rsvpSummaryBox');
    const rsvpResetBtn = document.getElementById('rsvpResetBtn');
    const partySizeSelect = document.getElementById('rsvpPartySize');
    const plusOneWrapper = document.getElementById('rsvpPlusOneWrapper');

    // Toggle Plus One
    if (partySizeSelect && plusOneWrapper) {
        partySizeSelect.addEventListener('change', () => {
            if (partySizeSelect.value === '2') {
                plusOneWrapper.style.display = 'block';
            } else {
                plusOneWrapper.style.display = 'none';
            }
        });
    }

    // Ladda sparat svar
    const savedRsvp = localStorage.getItem('wedding_news_rsvp_data');
    if (savedRsvp) {
        try {
            const data = JSON.parse(savedRsvp);
            showRsvpSummary(data);
        } catch (e) {
            console.error('Error parsing RSVP data:', e);
        }
    }

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const attendanceInput = document.querySelector('input[name="attendance"]:checked');
            const data = {
                name: document.getElementById('rsvpName').value.trim(),
                email: document.getElementById('rsvpEmail').value.trim(),
                attendance: attendanceInput ? attendanceInput.value : 'ja',
                partySize: document.getElementById('rsvpPartySize').value,
                plusOneName: document.getElementById('rsvpPlusOne').value.trim(),
                dietary: document.getElementById('rsvpDietary').value.trim(),
                message: document.getElementById('rsvpSongMessage').value.trim(),
                timestamp: new Date().toLocaleDateString('sv-SE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            localStorage.setItem('wedding_news_rsvp_data', JSON.stringify(data));
            showRsvpSummary(data);
        });
    }

    function showRsvpSummary(data) {
        if (!rsvpSummaryBox || !rsvpForm || !rsvpDoneCard) return;

        const isAttending = data.attendance === 'ja';

        rsvpSummaryBox.innerHTML = `
            <p style="margin-bottom: 5px;"><strong>Namn:</strong> ${escapeHtml(data.name)} (${escapeHtml(data.email)})</p>
            <p style="margin-bottom: 5px;"><strong>Deltagande:</strong> ${isAttending ? '<strong style="color: #2E7D32;">Ja, kommer med stor glädje!</strong>' : '<span style="color: #666;">Har tyvärr förhinder</span>'}</p>
            ${isAttending && data.partySize === '2' ? `<p style="margin-bottom: 5px;"><strong>Medföljande:</strong> ${escapeHtml(data.plusOneName || 'Ej specificerat')}</p>` : ''}
            ${data.dietary ? `<p style="margin-bottom: 5px;"><strong>Specialkost/Allergier:</strong> ${escapeHtml(data.dietary)}</p>` : ''}
            ${data.message ? `<p style="margin-bottom: 5px;"><strong>Hälsning/Låt:</strong> ”<em>${escapeHtml(data.message)}</em>”</p>` : ''}
            <p style="font-size: 0.72rem; color: #888; border-top: 1px dashed #ccc; padding-top: 5px; margin-top: 8px;">Mottaget: ${data.timestamp}</p>
        `;

        rsvpForm.style.display = 'none';
        rsvpDoneCard.style.display = 'block';
    }

    if (rsvpResetBtn) {
        rsvpResetBtn.addEventListener('click', () => {
            if (rsvpForm && rsvpDoneCard) {
                rsvpDoneCard.style.display = 'none';
                rsvpForm.style.display = 'flex';
            }
        });
    }


    // =====================================================================
    // 3. UTILITY FUNCTIONS
    // =====================================================================

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
