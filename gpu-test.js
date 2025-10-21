class GpuTest {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.gl = this.canvas.getContext('webgl2') || 
                  this.canvas.getContext('webgl') || 
                  this.canvas.getContext('experimental-webgl');
    }

    async test3DRendering() {
        if (!this.gl) return 15000;

        const startTime = performance.now();
        
        try {
            // Простий 3D рендеринг
            const vertices = new Float32Array([
                -0.5, -0.5, 0.0,
                 0.5, -0.5, 0.0,
                 0.0,  0.5, 0.0
            ]);

            const vertexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

            // Виконання 1000 малювань
            for (let i = 0; i < 1000; i++) {
                this.gl.clear(this.gl.COLOR_BUFFER_BIT);
                this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
            }

            const duration = performance.now() - startTime;
            return Math.max(5000, 50000 - duration * 20);
        } catch (error) {
            return 10000;
        }
    }

    async testShaders() {
        if (!this.gl) return 12000;

        const startTime = performance.now();
        
        try {
            const vertexShaderSource = `
                attribute vec2 position;
                void main() {
                    gl_Position = vec4(position, 0.0, 1.0);
                }
            `;

            const fragmentShaderSource = `
                precision mediump float;
                uniform float time;
                void main() {
                    gl_FragColor = vec4(
                        sin(time + gl_FragCoord.x * 0.01),
                        cos(time + gl_FragCoord.y * 0.01),
                        sin(time * 2.0),
                        1.0
                    );
                }
            `;

            // Компіляція шейдерів
            const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexShaderSource);
            const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
            
            const program = this.gl.createProgram();
            this.gl.attachShader(program, vertexShader);
            this.gl.attachShader(program, fragmentShader);
            this.gl.linkProgram(program);
            this.gl.useProgram(program);

            const duration = performance.now() - startTime;
            return Math.max(5000, 30000 - duration * 15);
        } catch (error) {
            return 8000;
        }
    }

    async testTextures() {
        if (!this.gl) return 10000;

        const startTime = performance.now();
        
        try {
            // Створення текстури
            const texture = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            
            const level = 0;
            const internalFormat = this.gl.RGBA;
            const width = 512;
            const height = 512;
            const border = 0;
            const format = this.gl.RGBA;
            const type = this.gl.UNSIGNED_BYTE;
            
            // Генерація пікселів для текстури
            const pixels = new Uint8Array(width * height * 4);
            for (let i = 0; i < pixels.length; i++) {
                pixels[i] = Math.random() * 255;
            }
            
            this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat, 
                             width, height, border, format, type, pixels);

            const duration = performance.now() - startTime;
            return Math.max(5000, 25000 - duration * 12);
        } catch (error) {
            return 7000;
        }
    }

    compileShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error('Помилка компіляції шейдера: ' + this.gl.getShaderInfoLog(shader));
        }
        
        return shader;
    }
}
