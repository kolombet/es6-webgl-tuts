"use strict";

window.addEventListener("load", () => new WebGL());

class WebGL {
    constructor() {
        this.translate = [.5, .5, 0];

        const canvas = document.getElementById("glcanvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        this.gl = gl;

        const vertexShaderSource = `
            attribute vec4 a_Position;
            uniform vec4 u_Translation;
            void main() {
                gl_Position = a_Position + u_Translation;
            }
        `

        const fragmentShaderSource = `
            precision mediump float;
            uniform vec4 u_FragColor; 
            void main() {
                gl_FragColor = u_FragColor;
            }
        `

        // upload and compile the vertex shader
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);

        // upload and compile the fragment shader
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);

        // link the vertex shader and fragment shader together into a shader program
        this.shader = gl.createProgram();
        gl.attachShader(this.shader, vertexShader);
        gl.attachShader(this.shader, fragmentShader);
        gl.linkProgram(this.shader);

        gl.useProgram(this.shader);

        this.draw();

        this.tick = 0;
    }
    
    draw() {
        this.tick++;
        var s = Math.sin(this.tick/100);
        this.translate[0] = s - .5;

        const a_Position = this.gl.getAttribLocation(this.shader, 'a_Position');
        const u_FragColor = this.gl.getUniformLocation(this.shader, 'u_FragColor');
        const u_Translation = this.gl.getUniformLocation(this.shader, 'u_Translation');

        if (u_FragColor < 0) {
            console.log('error');
            return;
        }
        this.gl.vertexAttrib3f(a_Position, s, 0.0, 0.0);
        this.gl.uniform4f(u_FragColor, 1.0, s, 0.0, 1.0);
        this.gl.uniform4f(u_Translation, this.translate[0], this.translate[1], this.translate[2], 0.0);

        // var n = 1;
        var n = this.initVertexBuffers(); 
        if (n < 0) {  
             console.log('Failed to set the positions of the vertices'); 
             return;
        } 


        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, n);
        window.requestAnimationFrame(this.draw.bind(this));
    }

    initVertexBuffers() {
        const vertices = new Float32Array([
            0.0, 0.5, -0.5, -0.5, 0.5, -0.5
        ]);
        var n = 3;

        const vertexBuffer = this.gl.createBuffer();
        if (!vertexBuffer) { console.log('failed vb'); return -1;}

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        const a_Position = this.gl.getAttribLocation(this.shader, 'a_Position');
        this.gl.vertexAttribPointer(a_Position, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(a_Position);
        return n;
    }
}
