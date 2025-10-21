class CpuTest {
    constructor() {
        this.worker = null;
    }

    async testSingleThread() {
        const startTime = performance.now();
        
        // Інтенсивні математичні обчислення
        let result = 0;
        for (let i = 0; i < 5000000; i++) {
            result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
        }
        
        const duration = performance.now() - startTime;
        return Math.max(1000, 50000 - duration * 10);
    }

    async testMultiThread() {
        if (!window.Worker) {
            return this.testSingleThread(); // Fallback
        }

        return new Promise((resolve) => {
            const workerCode = `
                self.onmessage = function() {
                    let result = 0;
                    for (let i = 0; i < 2000000; i++) {
                        result += Math.sqrt(i) * Math.random();
                    }
                    postMessage(result);
                }
            `;
            
            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));
            const startTime = performance.now();
            
            worker.onmessage = function() {
                const duration = performance.now() - startTime;
                worker.terminate();
                resolve(Math.max(1000, 40000 - duration * 8));
            };
            
            worker.postMessage('start');
        });
    }

    async testMathOperations() {
        const startTime = performance.now();
        
        // Різноманітні математичні операції
        let results = [];
        for (let i = 0; i < 1000000; i++) {
            const a = Math.random();
            const b = Math.random();
            results.push(
                a + b,
                a - b,
                a * b,
                a / (b || 1),
                Math.pow(a, b),
                Math.log(Math.abs(a) + 1)
            );
        }
        
        const duration = performance.now() - startTime;
        return Math.max(1000, 30000 - duration * 6);
    }
}
