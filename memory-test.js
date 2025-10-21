class MemoryTest {
    constructor() {
        this.bufferSize = 1000000; // 1 мільйон елементів
    }

    async testReadSpeed() {
        const startTime = performance.now();
        
        // Створення великого масиву
        const largeArray = new Array(this.bufferSize);
        for (let i = 0; i < this.bufferSize; i++) {
            largeArray[i] = Math.random();
        }
        
        // Тест швидкості читання
        let sum = 0;
        for (let i = 0; i < this.bufferSize; i += 100) {
            sum += largeArray[i];
        }
        
        const duration = performance.now() - startTime;
        return Math.max(1000, 40000 - duration * 8);
    }

    async testWriteSpeed() {
        const startTime = performance.now();
        
        // Тест швидкості запису
        const array = new Array(this.bufferSize);
        for (let i = 0; i < this.bufferSize; i++) {
            array[i] = {
                id: i,
                value: Math.random(),
                timestamp: Date.now(),
                data: new Array(10).fill(0).map(() => Math.random())
            };
        }
        
        const duration = performance.now() - startTime;
        return Math.max(1000, 35000 - duration * 7);
    }

    async testLatency() {
        const startTime = performance.now();
        
        // Тест латентності пам'яті
        const operations = 500000;
        const object = {};
        
        for (let i = 0; i < operations; i++) {
            object[`key${i}`] = i;
            const value = object[`key${i}`];
            delete object[`key${i}`];
        }
        
        const duration = performance.now() - startTime;
        return Math.max(1000, 30000 - duration * 6);
    }

    async testMemoryAllocation() {
        const startTime = performance.now();
        
        // Тест виділення пам'яті
        const chunks = [];
        for (let i = 0; i < 1000; i++) {
            chunks.push(new Float64Array(10000)); // 80KB кожен
        }
        
        // Примусове звільнення пам'яті
        chunks.length = 0;
        if (global.gc) {
            global.gc();
        }
        
        const duration = performance.now() - startTime;
        return Math.max(1000, 25000 - duration * 5);
    }
}
