class UxTest {
    constructor() {
        this.testElements = [];
    }

    async testInterface() {
        const startTime = performance.now();
        
        // Тест швидкості рендерингу DOM
        const container = document.createElement('div');
        container.style.display = 'none';
        
        for (let i = 0; i < 1000; i++) {
            const element = document.createElement('div');
            element.className = 'test-element';
            element.textContent = `Element ${i}`;
            element.style.cssText = `
                padding: 5px;
                margin: 2px;
                background: #${Math.floor(Math.random()*16777215).toString(16)};
            `;
            container.appendChild(element);
        }
        
        document.body.appendChild(container);
        const domDuration = performance.now() - startTime;
        
        // Очищення
        document.body.removeChild(container);
        
        return Math.max(1000, 20000 - domDuration * 4);
    }

    async testAnimations() {
        const startTime = performance.now();
        
        return new Promise((resolve) => {
            const testElement = document.createElement('div');
            testElement.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 50px;
                height: 50px;
                background: var(--primary);
                transition: all 0.1s linear;
            `;
            document.body.appendChild(testElement);

            let frameCount = 0;
            const start = performance.now();
            
            function animate() {
                frameCount++;
                testElement.style.transform = `translateX(${Math.sin(frameCount * 0.1) * 100}px)`;
                
                if (frameCount < 120) { // 2 секунди при 60fps
                    requestAnimationFrame(animate);
                } else {
                    const end = performance.now();
                    document.body.removeChild(testElement);
                    
                    const fps = frameCount / ((end - start) / 1000);
                    const score = Math.max(1000, Math.min(20000, fps * 300));
                    resolve(score);
                }
            }
            
            animate();
        });
    }

    async testResponsiveness() {
        const startTime = performance.now();
        
        // Тест обробки подій
        let eventCount = 0;
        const maxEvents = 1000;
        
        return new Promise((resolve) => {
            function handleEvent() {
                eventCount++;
                if (eventCount >= maxEvents) {
                    const duration = performance.now() - startTime;
                    document.removeEventListener('click', handleEvent);
                    resolve(Math.max(1000, 15000 - duration * 3));
                }
            }
            
            document.addEventListener('click', handleEvent);
            
            // Імітація кліків
            let simulatedClicks = 0;
            function simulateClick() {
                if (simulatedClicks < maxEvents) {
                    handleEvent();
                    simulatedClicks++;
                    setTimeout(simulateClick, 0);
                }
            }
            
            simulateClick();
        });
    }

    async testScrollPerformance() {
        const startTime = performance.now();
        
        return new Promise((resolve) => {
            const testElement = document.createElement('div');
            testElement.style.cssText = `
                height: 2000px;
                background: linear-gradient(to bottom, red, blue);
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
            `;
            document.body.appendChild(testElement);

            let scrollFrames = 0;
            const scrollDuration = 1000; // 1 секунда
            const startScroll = performance.now();
            
            function scrollTest() {
                scrollFrames++;
                const progress = (performance.now() - startScroll) / scrollDuration;
                
                if (progress < 1) {
                    window.scrollTo(0, progress * 1000);
                    requestAnimationFrame(scrollTest);
                } else {
                    document.body.removeChild(testElement);
                    window.scrollTo(0, 0);
                    
                    const duration = performance.now() - startTime;
                    const score = Math.max(1000, 18000 - duration * 3.5);
                    resolve(score);
                }
            }
            
            scrollTest();
        });
    }
}
