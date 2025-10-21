class WebTuTuBenchmark {
    constructor() {
        this.isTesting = false;
        this.startTime = 0;
        this.results = {
            cpu: 0,
            gpu: 0,
            memory: 0,
            ux: 0
        };
        
        this.init();
    }

    init() {
        this.detectDeviceInfo();
        this.bindEvents();
        
        // Ініціалізація модулів тестування
        this.cpuTester = new CpuTest();
        this.gpuTester = new GpuTest();
        this.memoryTester = new MemoryTest();
        this.uxTester = new UxTest();
    }

    detectDeviceInfo() {
        // CPU ядра
        const cores = navigator.hardwareConcurrency || 'Невідомо';
        document.getElementById('infoCpu').textContent = `${cores} ядер`;

        // Пам'ять
        const memory = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Невідомо';
        document.getElementById('infoMemory').textContent = memory;

        // Браузер
        const browser = this.detectBrowser();
        document.getElementById('infoBrowser').textContent = browser;

        // Платформа
        document.getElementById('infoPlatform').textContent = navigator.platform;
    }

    detectBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Інший браузер';
    }

    bindEvents() {
        document.getElementById('startTest').addEventListener('click', () => {
            this.startFullTest();
        });

        document.getElementById('retryBtn').addEventListener('click', () => {
            this.resetTest();
        });

        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareResults();
        });
    }

    async startFullTest() {
        if (this.isTesting) return;
        
        this.isTesting = true;
        this.startTime = performance.now();
        document.getElementById('startTest').disabled = true;
        document.getElementById('resultsSection').style.display = 'none';

        try {
            // Послідовне виконання тестів
            await this.runCpuTest();
            await this.runGpuTest();
            await this.runMemoryTest();
            await this.runUxTest();
            
            this.showFinalResults();
        } catch (error) {
            console.error('Помилка тестування:', error);
            alert('Сталася помилка під час тестування. Спробуйте ще раз.');
        } finally {
            this.isTesting = false;
            document.getElementById('startTest').disabled = false;
        }
    }

    async runCpuTest() {
        this.updateTestStatus('cpu', 'testing', 'Тестуємо...');
        this.updateProgress('progressCpu', 10);
        
        document.getElementById('detailCpu').textContent = 'Однопотокові операції...';
        const singleThreadScore = await this.cpuTester.testSingleThread();
        this.updateProgress('progressCpu', 40);

        document.getElementById('detailCpu').textContent = 'Багатопотоковість...';
        const multiThreadScore = await this.cpuTester.testMultiThread();
        this.updateProgress('progressCpu', 70);

        document.getElementById('detailCpu').textContent = 'Математичні операції...';
        const mathScore = await this.cpuTester.testMathOperations();
        this.updateProgress('progressCpu', 100);

        this.results.cpu = Math.round((singleThreadScore + multiThreadScore + mathScore) / 3);
        document.getElementById('scoreCpu').textContent = this.results.cpu.toLocaleString();
        this.updateTestStatus('cpu', 'complete', 'Завершено');
    }

    async runGpuTest() {
        this.updateTestStatus('gpu', 'testing', 'Тестуємо...');
        this.updateProgress('progressGpu', 10);
        
        document.getElementById('detailGpu').textContent = '3D рендеринг...';
        const renderScore = await this.gpuTester.test3DRendering();
        this.updateProgress('progressGpu', 40);

        document.getElementById('detailGpu').textContent = 'Шейдери...';
        const shaderScore = await this.gpuTester.testShaders();
        this.updateProgress('progressGpu', 70);

        document.getElementById('detailGpu').textContent = 'Текстури...';
        const textureScore = await this.gpuTester.testTextures();
        this.updateProgress('progressGpu', 100);

        this.results.gpu = Math.round((renderScore + shaderScore + textureScore) / 3);
        document.getElementById('scoreGpu').textContent = this.results.gpu.toLocaleString();
        this.updateTestStatus('gpu', 'complete', 'Завершено');
    }

    async runMemoryTest() {
        this.updateTestStatus('memory', 'testing', 'Тестуємо...');
        this.updateProgress('progressMemory', 10);
        
        document.getElementById('detailMemory').textContent = 'Швидкість читання...';
        const readScore = await this.memoryTester.testReadSpeed();
        this.updateProgress('progressMemory', 40);

        document.getElementById('detailMemory').textContent = 'Швидкість запису...';
        const writeScore = await this.memoryTester.testWriteSpeed();
        this.updateProgress('progressMemory', 70);

        document.getElementById('detailMemory').textContent = 'Латентність...';
        const latencyScore = await this.memoryTester.testLatency();
        this.updateProgress('progressMemory', 100);

        this.results.memory = Math.round((readScore + writeScore + latencyScore) / 3);
        document.getElementById('scoreMemory').textContent = this.results.memory.toLocaleString();
        this.updateTestStatus('memory', 'complete', 'Завершено');
    }

    async runUxTest() {
        this.updateTestStatus('ux', 'testing', 'Тестуємо...');
        this.updateProgress('progressUx', 10);
        
        document.getElementById('detailUx').textContent = 'Інтерфейс...';
        const interfaceScore = await this.uxTester.testInterface();
        this.updateProgress('progressUx', 40);

        document.getElementById('detailUx').textContent = 'Анімації...';
        const animationScore = await this.uxTester.testAnimations();
        this.updateProgress('progressUx', 70);

        document.getElementById('detailUx').textContent = 'Відгук...';
        const responseScore = await this.uxTester.testResponsiveness();
        this.updateProgress('progressUx', 100);

        this.results.ux = Math.round((interfaceScore + animationScore + responseScore) / 3);
        document.getElementById('scoreUx').textContent = this.results.ux.toLocaleString();
        this.updateTestStatus('ux', 'complete', 'Завершено');
    }

    showFinalResults() {
        const totalScore = this.results.cpu + this.results.gpu + this.results.memory + this.results.ux;
        const testTime = ((performance.now() - this.startTime) / 1000).toFixed(1);

        // Оновлення UI
        document.getElementById('finalScore').textContent = totalScore.toLocaleString();
        document.getElementById('breakdownCpu').textContent = this.results.cpu.toLocaleString();
        document.getElementById('breakdownGpu').textContent = this.results.gpu.toLocaleString();
        document.getElementById('breakdownMemory').textContent = this.results.memory.toLocaleString();
        document.getElementById('breakdownUx').textContent = this.results.ux.toLocaleString();

        // Визначення рейтингу
        const ranking = this.calculateRanking(totalScore);
        document.getElementById('ranking').textContent = ranking;

        // Побудова графіка
        this.buildComparisonChart(totalScore);

        // Показати результати
        document.getElementById('resultsSection').style.display = 'block';
        
        // Прокрутка до результатів
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }

    calculateRanking(totalScore) {
        if (totalScore >= 300000) return "🏆 Топ-рівень (Флагман)";
        if (totalScore >= 200000) return "🔥 Відмінно (Високий клас)";
        if (totalScore >= 100000) return "👍 Добре (Середній клас)";
        if (totalScore >= 50000) return "💫 Задовільно (Бюджетний)";
        return "⚡ Базовий рівень";
    }

    buildComparisonChart(userScore) {
        const chart = document.getElementById('comparisonChart');
        chart.innerHTML = '';

        const comparisons = [
            { label: 'Ваш результат', score: userScore },
            { label: 'Бюджетний', score: 50000 },
            { label: 'Середній', score: 100000 },
            { label: 'Флагман', score: 300000 }
        ];

        const maxScore = Math.max(...comparisons.map(c => c.score));
        
        comparisons.forEach(comp => {
            const barHeight = (comp.score / maxScore) * 150;
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = `${barHeight}px`;
            
            const label = document.createElement('div');
            label.className = 'chart-label';
            label.textContent = comp.label;
            
            bar.appendChild(label);
            chart.appendChild(bar);
        });
    }

    updateTestStatus(test, status, text) {
        const element = document.getElementById(`status${test.charAt(0).toUpperCase() + test.slice(1)}`);
        element.className = `status-badge status-${status}`;
        element.textContent = text;
    }

    updateProgress(elementId, percent) {
        document.getElementById(elementId).style.width = percent + '%';
    }

    resetTest() {
        this.results = { cpu: 0, gpu: 0, memory: 0, ux: 0 };
        
        // Скидання всіх прогресових барів
        ['Cpu', 'Gpu', 'Memory', 'Ux'].forEach(test => {
            this.updateProgress(`progress${test}`, 0);
            this.updateTestStatus(test.toLowerCase(), 'waiting', 'Очікує');
            document.getElementById(`score${test}`).textContent = '0';
            document.getElementById(`detail${test}`).textContent = 'Очікує запуску';
        });

        document.getElementById('resultsSection').style.display = 'none';
    }

    shareResults() {
        const totalScore = this.results.cpu + this.results.gpu + this.results.memory + this.results.ux;
        const resultsText = `
📱 WebTuTu Benchmark Results:

⚡ CPU: ${this.results.cpu.toLocaleString()} балів
🎮 GPU: ${this.results.gpu.toLocaleString()} балів
💾 Memory: ${this.results.memory.toLocaleString()} балів
📊 UX: ${this.results.ux.toLocaleString()} балів
🏆 Total: ${totalScore.toLocaleString()} балів

Тестовано на: ${navigator.platform}
Браузер: ${this.detectBrowser()}
        `.trim();

        if (navigator.share) {
            navigator.share({
                title: 'Мої результати WebTuTu Benchmark',
                text: resultsText
            });
        } else {
            navigator.clipboard.writeText(resultsText).then(() => {
                alert('Результати скопійовано в буфер обміну!');
            });
        }
    }
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    window.webtutu = new WebTuTuBenchmark();
});
