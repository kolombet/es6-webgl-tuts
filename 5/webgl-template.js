"use strict";

window.addEventListener("load", () => new WebGL());

/**
 * Textures
 */

class WebGL {
    constructor() {
        this.translate = [.5, .5, 0];
        this.angle = 90.0;
        this.veticesCount = 4;
        this.xformMatrix = new Matrix4();
        this.tick = 0;

        const canvas = document.getElementById("glcanvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        this.gl = gl;

        console.log("init shader");
        this.initShader();

        this.a_Position = this.gl.getAttribLocation(this.shader, 'a_Position');
        if (!this.a_Position) {
            console.log('Failed to get the storage location of u_Sampler');
            return false;
        }
        this.u_Sampler = this.gl.getUniformLocation(this.shader, 'u_Sampler');
        if (!this.u_Sampler) {
            console.log('Failed to get the storage location of u_Sampler');
            return false;
        }
        
        console.log("init vertext buffers");
        this.initVertexBuffers();
        console.log("init textures");
        this.initTextures();
        console.log("draw");
        this.draw();
    }

    initShader() {
        var gl = this.gl;

        const vertexShaderSource = `
            attribute vec4 a_Position;
            attribute vec2 a_TexCoord;
            varying vec2 v_TexCoord;
            void main() {
                gl_Position = a_Position;
                v_TexCoord = a_TexCoord;
            }
        `

        const fragmentShaderSource = `
            precision mediump float;
            uniform sampler2D u_Sampler;
            varying vec2 v_TexCoord;
            void main() {
                gl_FragColor = texture2D(u_Sampler, v_TexCoord);
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
    }
    
    draw() {
        // this.tick++;
        // var s = Math.sin(this.tick/100);
        // this.xformMatrix.setRotate(this.angle*s, 0, 0, 1);
        // this.xformMatrix.translate(0.35, 0, 0);

        // this.gl.vertexAttrib3f(this.a_Position, s, 0.0, 0.0);

        // this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        // this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.verticesCount);
        window.requestAnimationFrame(this.draw.bind(this));
    }

    initVertexBuffers() {
        const verticesTexCoords = new Float32Array([
            -0.5,  0.5, 0.0, 1.0,
            -0.5, -0.5, 0.0, 0.0,
             0.5, -0.5, 1.0, 0.0,
             0.5, -0.5, 1.0, 0.0
        ]);

        const vertexTexCoordBuffer = this.gl.createBuffer();
        if (!vertexTexCoordBuffer) { 
            console.log('failed vb'); 
            return;
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexTexCoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, verticesTexCoords, this.gl.STATIC_DRAW);

        const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

        const a_Position = this.gl.getAttribLocation(this.shader, 'a_Position');
        if (a_Position < 0) { 
            console.log('a_Position error'); 
            return;
        }
        this.gl.vertexAttribPointer(a_Position, 2, this.gl.FLOAT, false, FSIZE*4, 0);
        this.gl.enableVertexAttribArray(a_Position);

        const a_TexCoord = this.gl.getAttribLocation(this.shader, 'a_TexCoord');
        if (a_TexCoord < 0) {
            console.log('a_TexCoord error');
            return;
        }

        this.gl.vertexAttribPointer(a_TexCoord, 2, this.gl.FLOAT, false, FSIZE*4, FSIZE*2);
        this.gl.enableVertexAttribArray(a_TexCoord);
    }

    initTextures() {
        var image = new Image();
        image.onload = () => this.loadTexture(image);
        image.src = 'apple.png';
    }

    loadTexture(image) {
        let gl = this.gl;

        let texture = this.gl.createTexture();
        if (!texture) {
            console.log('Failed to create the texture object');
            return false;
        }

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

        gl.uniform1f(this.u_Sampler, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGE_STRIP, 0, this.n);
    }
}
