"use strict";

window.addEventListener("load", () => new WebGL());

class WebGL {
    constructor() {
        this.translate = [.5, .5, 0];
        this.angle = 90.0;

        const canvas = document.getElementById("glcanvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        this.gl = gl;

        const vertexShaderSource = `
            attribute vec4 a_Position;
            uniform mat4 u_xformMatrix;
            void main() {
                gl_Position = u_xformMatrix * a_Position;
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
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        
        this.a_Position = this.gl.getAttribLocation(this.shader, 'a_Position');
        this.u_FragColor = this.gl.getUniformLocation(this.shader, 'u_FragColor');
        this.u_xformMatrix = this.gl.getUniformLocation(this.shader, 'u_xformMatrix');
        this.xformMatrix = new Matrix4();
        this.vertexBuffers = this.initVertexBuffers();

        this.tick = 0;

        this.draw();
    }
    
    draw() {
        this.tick++;
        var s = Math.sin(this.tick/100);
        this.xformMatrix.setRotate(this.angle*s, 0, 0, 1);
        this.xformMatrix.translate(0.35, 0, 0);

        this.gl.vertexAttrib3f(this.a_Position, s, 0.0, 0.0);
        this.gl.uniform4f(this.u_FragColor, 1.0, s, 0.0, 1.0);
        this.gl.uniformMatrix4fv(this.u_xformMatrix, false, this.xformMatrix.elements);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertexBuffers);
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
