// ============================================
// APLICACIÓN DE EXAMEN INTERACTIVO
// Sistemas de Información I
// UPDS - Universidad Privada Domingo Savio
// Docente: Ing. M.Sc. Jimmy Nataniel Requena Llorentty
// ============================================

class ExamApp {
    constructor() {
        // Estado del estudiante
        this.student = {
            nombre: '',
            email: '',
            ci: ''
        };

        // Estado del examen
        this.currentQuestion = 0;
        this.answers = {};
        this.matchingState = {};
        this.startTime = null;
        this.timerInterval = null;
        this.timeRemaining = CONFIG.exam.duration * 60;
        this.selectedFile = null;

        // Elementos DOM
        this.screens = {
            intro: document.getElementById('intro-screen'),
            exam: document.getElementById('exam-screen'),
            results: document.getElementById('results-screen')
        };

        // Inicializar
        this.init();
    }

    init() {
        this.bindEvents();
        this.shuffleMatchingDefinitions();
    }

    bindEvents() {
        // Formulario de inicio
        document.getElementById('student-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.startExam();
        });

        // Navegación
        document.getElementById('btn-prev').addEventListener('click', () => this.prevQuestion());
        document.getElementById('btn-next').addEventListener('click', () => this.nextQuestion());
        document.getElementById('btn-finish').addEventListener('click', () => this.finishExam());

        // Resultados
        document.getElementById('btn-download-pdf').addEventListener('click', () => this.downloadPDF());
        document.getElementById('btn-upload-evidence').addEventListener('click', () => this.showUploadModal());

        // Modal de subida
        document.getElementById('modal-close').addEventListener('click', () => this.hideUploadModal());
        document.getElementById('upload-area').addEventListener('click', () => {
            document.getElementById('file-input').click();
        });
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFileSelect(e));
        document.getElementById('file-remove').addEventListener('click', () => this.removeFile());
        document.getElementById('btn-confirm-upload').addEventListener('click', () => this.uploadFile());

        // Drag and drop para archivos
        const uploadArea = document.getElementById('upload-area');
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            if (e.dataTransfer.files.length) this.handleFile(e.dataTransfer.files[0]);
        });

        // Cerrar modal con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hideUploadModal();
        });
    }

    // === PANTALLAS ===
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => screen.classList.remove('active'));
        this.screens[screenName].classList.add('active');
    }

    // === INICIO DEL EXAMEN ===
    startExam() {
        this.student.nombre = document.getElementById('nombre').value.trim();
        this.student.email = document.getElementById('email').value.trim();
        this.student.ci = document.getElementById('ci').value.trim();

        if (!this.student.nombre || !this.student.email || !this.student.ci) {
            this.showToast('Por favor complete todos los campos', 'error');
            return;
        }

        document.getElementById('student-name-display').textContent = this.student.nombre;
        this.startTime = new Date();
        this.startTimer();
        this.generateNavigation();
        this.showQuestion(0);
        this.showScreen('exam');
        this.showToast('¡Examen iniciado! Buena suerte 🍀', 'success');
    }

    // === TIMER ===
    startTimer() {
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            if (this.timeRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.showToast('¡Tiempo agotado!', 'warning');
                this.finishExam();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        document.getElementById('timer-display').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const timerEl = document.getElementById('timer');
        timerEl.classList.remove('warning', 'danger');
        if (this.timeRemaining <= 300) timerEl.classList.add('danger');
        else if (this.timeRemaining <= 600) timerEl.classList.add('warning');
    }

    // === NAVEGACIÓN ===
    generateNavigation() {
        const navGrid = document.getElementById('nav-grid');
        navGrid.innerHTML = '';
        QUESTIONS.forEach((q, index) => {
            const navItem = document.createElement('div');
            navItem.className = 'nav-item';
            navItem.textContent = index + 1;
            navItem.addEventListener('click', () => this.showQuestion(index));
            navGrid.appendChild(navItem);
        });
    }

    updateNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach((item, index) => {
            item.classList.remove('active', 'answered');
            if (index === this.currentQuestion) item.classList.add('active');
            if (this.answers[QUESTIONS[index].id] !== undefined) item.classList.add('answered');
        });

        const answered = Object.keys(this.answers).length;
        document.getElementById('progress-text').textContent = `${answered}/${QUESTIONS.length}`;
        document.getElementById('progress-fill').style.width = `${(answered / QUESTIONS.length) * 100}%`;
    }

    // === PREGUNTAS ===
    showQuestion(index) {
        this.currentQuestion = index;
        const question = QUESTIONS[index];
        const container = document.getElementById('question-container');

        let html = `
            <div class="question-header">
                <div class="question-meta">
                    <span class="question-section">Sección ${question.section}: ${question.sectionTitle}</span>
                    <span class="question-number">Pregunta ${index + 1} de ${QUESTIONS.length}</span>
                </div>
                <div class="question-points">
                    <span>⭐</span>
                    <span>${question.points} ${question.points === 1 ? 'punto' : 'puntos'}</span>
                </div>
            </div>
            <p class="question-text">${question.text.replace(/\n/g, '<br>')}</p>
        `;

        switch (question.type) {
            case 'multiple-choice': html += this.renderMultipleChoice(question); break;
            case 'development': html += this.renderDevelopment(question); break;
            case 'matching': html += this.renderMatching(question); break;
        }

        container.innerHTML = html;
        this.bindQuestionEvents(question);
        this.updateNavigation();
        this.updateButtons();
    }

    renderMultipleChoice(question) {
        const selectedAnswer = this.answers[question.id];
        return `
            <div class="choices-container">
                ${question.choices.map(choice => `
                    <div class="choice-option ${selectedAnswer === choice.id ? 'selected' : ''}" 
                         data-choice-id="${choice.id}">
                        <span class="choice-letter">${choice.id.toUpperCase()}</span>
                        <span class="choice-text">${choice.text}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderDevelopment(question) {
        const savedAnswer = this.answers[question.id] || '';
        return `
            <div class="development-container">
                <textarea class="development-textarea" 
                          id="dev-answer-${question.id}"
                          placeholder="${question.placeholder}"
                          rows="8">${savedAnswer}</textarea>
                <div class="char-counter">
                    <span id="char-count">${savedAnswer.length}</span> caracteres
                </div>
            </div>
        `;
    }

    renderMatching(question) {
        const shuffledDefs = this.shuffledDefinitions || question.matchingPairs.map(p => ({
            id: p.id, text: p.definition
        }));

        return `
            <div class="matching-instructions">
                <strong>Instrucciones:</strong> Haga clic en un concepto de la izquierda y luego en su definición correspondiente a la derecha. También puede arrastrar y soltar.
            </div>
            <div class="matching-container">
                <div class="matching-column concepts-column">
                    <div class="matching-title">📚 Conceptos</div>
                    ${question.matchingPairs.map(pair => {
                        const isMatched = this.matchingState[pair.id];
                        return `
                            <div class="matching-item concept-item ${isMatched ? 'matched' : ''}" 
                                 data-concept-id="${pair.id}" draggable="true">
                                ${pair.concept}
                                ${isMatched ? '<span class="match-indicator">✓</span>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="matching-arrows">
                    <span class="arrow-icon">→</span>
                    <span class="arrow-icon">→</span>
                    <span class="arrow-icon">→</span>
                    <span class="arrow-icon">→</span>
                </div>
                <div class="matching-column definitions-column">
                    <div class="matching-title">📖 Definiciones</div>
                    ${shuffledDefs.map(def => {
                        const matchedConcept = Object.entries(this.matchingState).find(([_, defId]) => defId === def.id);
                        const isMatched = !!matchedConcept;
                        return `
                            <div class="matching-item definition-item ${isMatched ? 'matched' : ''}" 
                                 data-definition-id="${def.id}">
                                ${def.text}
                                ${isMatched ? '<span class="match-indicator">✓</span>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    shuffleMatchingDefinitions() {
        const matchingQ = QUESTIONS.find(q => q.type === 'matching');
        if (matchingQ) {
            this.shuffledDefinitions = [...matchingQ.matchingPairs]
                .map(p => ({ id: p.id, text: p.definition }))
                .sort(() => Math.random() - 0.5);
        }
    }

    bindQuestionEvents(question) {
        switch (question.type) {
            case 'multiple-choice':
                document.querySelectorAll('.choice-option').forEach(option => {
                    option.addEventListener('click', () => {
                        this.selectChoice(question.id, option.dataset.choiceId);
                    });
                });
                break;
            case 'development':
                const textarea = document.getElementById(`dev-answer-${question.id}`);
                if (textarea) {
                    textarea.addEventListener('input', (e) => {
                        this.answers[question.id] = e.target.value;
                        document.getElementById('char-count').textContent = e.target.value.length;
                        this.updateNavigation();
                    });
                }
                break;
            case 'matching':
                this.bindMatchingEvents(question);
                break;
        }
    }

    selectChoice(questionId, choiceId) {
        this.answers[questionId] = choiceId;
        document.querySelectorAll('.choice-option').forEach(opt => {
            opt.classList.remove('selected');
            if (opt.dataset.choiceId === choiceId) opt.classList.add('selected');
        });
        this.updateNavigation();
    }

    // === MATCHING - DRAG AND DROP / CLICK ===
    bindMatchingEvents(question) {
        let selectedConcept = null;

        document.querySelectorAll('.concept-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.concept-item').forEach(c => c.classList.remove('selected'));
                item.classList.add('selected');
                selectedConcept = item.dataset.conceptId;
                document.querySelectorAll('.definition-item').forEach(d => d.classList.add('drop-zone'));
            });

            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.conceptId);
                item.classList.add('dragging');
                selectedConcept = item.dataset.conceptId;
                setTimeout(() => {
                    document.querySelectorAll('.definition-item').forEach(d => d.classList.add('drop-zone'));
                }, 0);
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                document.querySelectorAll('.definition-item').forEach(d => {
                    d.classList.remove('drop-zone', 'drag-over');
                });
            });
        });

        document.querySelectorAll('.definition-item').forEach(item => {
            item.addEventListener('click', () => {
                if (selectedConcept) {
                    this.makeMatch(selectedConcept, item.dataset.definitionId, question);
                    selectedConcept = null;
                    document.querySelectorAll('.concept-item').forEach(c => c.classList.remove('selected'));
                    document.querySelectorAll('.definition-item').forEach(d => d.classList.remove('drop-zone'));
                }
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                item.classList.add('drag-over');
            });

            item.addEventListener('dragleave', () => item.classList.remove('drag-over'));

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                const conceptId = e.dataTransfer.getData('text/plain');
                this.makeMatch(conceptId, item.dataset.definitionId, question);
                item.classList.remove('drag-over');
            });
        });
    }

    makeMatch(conceptId, definitionId, question) {
        const previousDef = this.matchingState[conceptId];
        if (previousDef) {
            const prevDefEl = document.querySelector(`[data-definition-id="${previousDef}"]`);
            if (prevDefEl) {
                prevDefEl.classList.remove('matched');
                const indicator = prevDefEl.querySelector('.match-indicator');
                if (indicator) indicator.remove();
            }
        }

        this.matchingState[conceptId] = definitionId;
        this.answers[question.id] = { ...this.matchingState };

        const conceptEl = document.querySelector(`[data-concept-id="${conceptId}"]`);
        if (conceptEl) {
            conceptEl.classList.add('matched');
            if (!conceptEl.querySelector('.match-indicator')) {
                conceptEl.innerHTML += '<span class="match-indicator">✓</span>';
            }
        }

        const defEl = document.querySelector(`[data-definition-id="${definitionId}"]`);
        if (defEl) {
            defEl.classList.add('matched');
            if (!defEl.querySelector('.match-indicator')) {
                defEl.innerHTML += '<span class="match-indicator">✓</span>';
            }
        }

        this.updateNavigation();
        this.showToast('¡Emparejamiento realizado!', 'success');
    }

    // === NAVEGACIÓN ENTRE PREGUNTAS ===
    prevQuestion() {
        if (this.currentQuestion > 0) this.showQuestion(this.currentQuestion - 1);
    }

    nextQuestion() {
        if (this.currentQuestion < QUESTIONS.length - 1) this.showQuestion(this.currentQuestion + 1);
    }

    updateButtons() {
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        const btnFinish = document.getElementById('btn-finish');

        btnPrev.disabled = this.currentQuestion === 0;
        
        if (this.currentQuestion === QUESTIONS.length - 1) {
            btnNext.style.display = 'none';
            btnFinish.style.display = 'flex';
        } else {
            btnNext.style.display = 'flex';
            btnFinish.style.display = 'none';
        }
    }

    // === FINALIZAR EXAMEN ===
    async finishExam() {
        const unanswered = QUESTIONS.filter(q => this.answers[q.id] === undefined).length;
        
        if (unanswered > 0) {
            const confirm = window.confirm(
                `Tienes ${unanswered} pregunta(s) sin responder.\n\n¿Deseas finalizar el examen de todas formas?`
            );
            if (!confirm) return;
        }

        clearInterval(this.timerInterval);
        const timeTaken = CONFIG.exam.duration * 60 - this.timeRemaining;
        const results = this.calculateResults();
        this.displayResults(results, timeTaken);
        await this.saveToSupabase(results);
        this.showScreen('results');
    }

    calculateResults() {
        let totalScore = 0;
        let correctCount = 0;
        const details = [];

        QUESTIONS.forEach(question => {
            const studentAnswer = this.answers[question.id];
            let earned = 0;
            let status = 'incorrect';

            switch (question.type) {
                case 'multiple-choice':
                    if (studentAnswer === question.correctAnswer) {
                        earned = question.points;
                        correctCount++;
                        status = 'correct';
                    }
                    break;
                case 'matching':
                    if (studentAnswer && question.matchingPairs) {
                        let correctMatches = 0;
                        question.matchingPairs.forEach(pair => {
                            if (studentAnswer[pair.id] === pair.id) correctMatches++;
                        });
                        earned = (correctMatches / question.matchingPairs.length) * question.points;
                        if (correctMatches === question.matchingPairs.length) {
                            status = 'correct';
                            correctCount++;
                        } else if (correctMatches > 0) {
                            status = 'partial';
                        }
                    }
                    break;
                case 'development':
                    if (studentAnswer && studentAnswer.trim().length > 20) {
                        earned = question.points * 0.5;
                        status = 'partial';
                    }
                    break;
            }

            totalScore += earned;
            details.push({ ...question, studentAnswer, earned: Math.round(earned * 10) / 10, status });
        });

        return {
            totalScore: Math.round(totalScore * 10) / 10,
            maxScore: TOTAL_POINTS,
            percentage: Math.round((totalScore / TOTAL_POINTS) * 100),
            correctCount,
            details
        };
    }

    displayResults(results, timeTaken) {
        document.getElementById('student-result-name').textContent = this.student.nombre;
        document.getElementById('score-value').textContent = results.totalScore;

        setTimeout(() => {
            const progress = document.getElementById('score-progress');
            const offset = 565 - (565 * results.percentage / 100);
            progress.style.strokeDashoffset = offset;
            if (results.percentage >= 70) progress.style.stroke = '#38a169';
            else if (results.percentage >= 50) progress.style.stroke = '#d69e2e';
            else progress.style.stroke = '#e53e3e';
        }, 100);

        document.getElementById('correct-count').textContent = results.correctCount;
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;
        document.getElementById('time-taken').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const detailsContainer = document.getElementById('results-details');
        detailsContainer.innerHTML = results.details.map((item, index) => {
            let answerText = '';
            if (item.type === 'multiple-choice') {
                const choice = item.choices?.find(c => c.id === item.studentAnswer);
                answerText = choice ? `Respuesta: ${choice.text}` : 'Sin respuesta';
            } else if (item.type === 'matching') {
                answerText = 'Emparejamiento realizado';
            } else {
                answerText = item.studentAnswer ? 
                    `Respuesta: ${item.studentAnswer.substring(0, 100)}...` : 'Sin respuesta';
            }

            return `
                <div class="result-item ${item.status}">
                    <span class="result-number">${index + 1}</span>
                    <div class="result-content">
                        <p class="result-question">${item.text.substring(0, 80)}${item.text.length > 80 ? '...' : ''}</p>
                        <p class="result-answer">${answerText}</p>
                    </div>
                    <span class="result-points">${item.earned}/${item.points}</span>
                </div>
            `;
        }).join('');
    }

    // === SUPABASE ===
    async saveToSupabase(results) {
        try {
            const response = await fetch(`${CONFIG.supabase.url}/rest/v1/exam_results`, {
                method: 'POST',
                headers: {
                    'apikey': CONFIG.supabase.anonKey,
                    'Authorization': `Bearer ${CONFIG.supabase.anonKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    nombre: this.student.nombre,
                    email: this.student.email,
                    ci: this.student.ci,
                    score: results.totalScore,
                    max_score: results.maxScore,
                    percentage: results.percentage,
                    answers: JSON.stringify(this.answers),
                    details: JSON.stringify(results.details),
                    created_at: new Date().toISOString()
                })
            });

            if (response.ok) {
                console.log('✅ Resultados guardados en Supabase');
                this.showToast('Resultados guardados correctamente', 'success');
            } else {
                throw new Error('Error al guardar');
            }
        } catch (error) {
            console.error('Error Supabase:', error);
            this.showToast('Error al guardar resultados. Los datos se mostrarán localmente.', 'warning');
        }
    }

    // === PDF ===
    downloadPDF() {
        const printContent = this.generatePrintContent();
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Examen - ${this.student.nombre}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                    .header { text-align: center; border-bottom: 3px solid #1a365d; padding-bottom: 20px; margin-bottom: 30px; }
                    .logo { font-size: 24px; font-weight: bold; color: #1a365d; }
                    .title { font-size: 20px; margin-top: 10px; }
                    .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
                    .info-label { font-size: 12px; color: #666; text-transform: uppercase; }
                    .info-value { font-size: 16px; font-weight: 600; }
                    .score-section { text-align: center; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
                    .score-value { font-size: 48px; font-weight: bold; }
                    .score-label { font-size: 14px; opacity: 0.9; }
                    .question-item { padding: 15px; border-left: 4px solid #e2e8f0; margin-bottom: 15px; background: #fafafa; }
                    .question-item.correct { border-color: #38a169; }
                    .question-item.incorrect { border-color: #e53e3e; }
                    .question-item.partial { border-color: #d69e2e; }
                    .q-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
                    .q-number { font-weight: bold; color: #1a365d; }
                    .q-points { font-weight: 600; }
                    .q-text { margin-bottom: 10px; }
                    .q-answer { font-size: 14px; color: #666; }
                    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                    @media print { body { padding: 20px; } .score-section { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                </style>
            </head>
            <body>${printContent}</body>
            </html>
        `);
        
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    }

    generatePrintContent() {
        const results = this.calculateResults();
        const now = new Date().toLocaleString('es-BO');

        return `
            <div class="header">
                <div class="logo">🎓 Universidad Privada Domingo Savio - UPDS</div>
                <div class="title">Examen: Sistemas de Información I</div>
            </div>
            <div class="student-info">
                <div><div class="info-label">Estudiante</div><div class="info-value">${this.student.nombre}</div></div>
                <div><div class="info-label">CI</div><div class="info-value">${this.student.ci}</div></div>
                <div><div class="info-label">Email</div><div class="info-value">${this.student.email}</div></div>
                <div><div class="info-label">Fecha</div><div class="info-value">${now}</div></div>
            </div>
            <div class="score-section">
                <div class="score-value">${results.totalScore} / ${results.maxScore}</div>
                <div class="score-label">PUNTAJE OBTENIDO (${results.percentage}%)</div>
            </div>
            <div class="questions-section">
                <h3 style="margin-bottom: 20px;">Detalle de Respuestas</h3>
                ${results.details.map((item, index) => {
                    let answerText = '';
                    if (item.type === 'multiple-choice') {
                        const choice = item.choices?.find(c => c.id === item.studentAnswer);
                        answerText = choice ? choice.text : 'Sin respuesta';
                    } else if (item.type === 'matching') {
                        answerText = 'Emparejamiento completado';
                    } else {
                        answerText = item.studentAnswer || 'Sin respuesta';
                    }
                    return `
                        <div class="question-item ${item.status}">
                            <div class="q-header">
                                <span class="q-number">Pregunta ${index + 1}</span>
                                <span class="q-points">${item.earned}/${item.points} pts</span>
                            </div>
                            <div class="q-text">${item.text}</div>
                            <div class="q-answer"><strong>Respuesta:</strong> ${answerText}</div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="footer">
                <p><strong>Docente:</strong> Ing. M.Sc. Jimmy Nataniel Requena Llorentty</p>
                <p>Universidad Privada Domingo Savio - Santa Cruz, Bolivia</p>
                <p style="margin-top: 10px; font-size: 10px;">Documento generado automáticamente el ${now}</p>
            </div>
        `;
    }

    // === UPLOAD ===
    showUploadModal() {
        document.getElementById('upload-modal').classList.add('active');
    }

    hideUploadModal() {
        document.getElementById('upload-modal').classList.remove('active');
        this.resetUploadState();
    }

    resetUploadState() {
        document.getElementById('selected-file').style.display = 'none';
        document.getElementById('upload-area').style.display = 'block';
        document.getElementById('upload-progress').style.display = 'none';
        document.getElementById('upload-success').style.display = 'none';
        document.getElementById('btn-confirm-upload').disabled = true;
        document.getElementById('file-input').value = '';
        this.selectedFile = null;
    }

    handleFileSelect(e) {
        if (e.target.files.length) this.handleFile(e.target.files[0]);
    }

    handleFile(file) {
        if (file.type !== 'application/pdf') {
            this.showToast('Solo se permiten archivos PDF', 'error');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            this.showToast('El archivo no debe superar 10MB', 'error');
            return;
        }

        this.selectedFile = file;
        document.getElementById('upload-area').style.display = 'none';
        document.getElementById('selected-file').style.display = 'flex';
        document.getElementById('file-name').textContent = file.name;
        document.getElementById('btn-confirm-upload').disabled = false;
    }

    removeFile() {
        this.resetUploadState();
    }

    async uploadFile() {
        if (!this.selectedFile) return;

        document.getElementById('selected-file').style.display = 'none';
        document.getElementById('upload-progress').style.display = 'block';
        document.getElementById('btn-confirm-upload').disabled = true;

        try {
            const base64 = await this.fileToBase64(this.selectedFile);
            let progress = 0;
            const progressFill = document.getElementById('upload-progress-fill');
            const progressInterval = setInterval(() => {
                progress += 10;
                progressFill.style.width = `${Math.min(progress, 90)}%`;
            }, 200);

            const response = await fetch(CONFIG.googleScriptUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    studentName: this.student.nombre,
                    studentCI: this.student.ci,
                    fileName: this.selectedFile.name,
                    fileData: base64
                })
            });

            clearInterval(progressInterval);
            progressFill.style.width = '100%';

            setTimeout(() => {
                document.getElementById('upload-progress').style.display = 'none';
                document.getElementById('upload-success').style.display = 'block';
                this.showToast('¡Archivo subido exitosamente!', 'success');
            }, 500);

        } catch (error) {
            console.error('Error upload:', error);
            document.getElementById('upload-progress').style.display = 'none';
            document.getElementById('upload-area').style.display = 'block';
            this.showToast('Error al subir el archivo. Intenta de nuevo.', 'error');
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // === TOAST NOTIFICATIONS ===
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icons = { success: '✅', error: '❌', warning: '⚠️' };
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
        `;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    window.examApp = new ExamApp();
});
