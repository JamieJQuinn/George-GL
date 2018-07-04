function loadBoundaryInfo(gl) {
  // Vertex shader
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

  // Fragment shader
  const fsSource = `
    precision highp float;
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;
    uniform float time;

    void main(void) {
      //gl_FragColor = texture2D(uSampler, vTextureCoord);
      //gl_FragColor = texture2D(uSampler, vec2(vTextureCoord[0]+sin(time), vTextureCoord[1]));
      gl_FragColor = vec4(0,1,1,1);
    }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const info = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };

  info.vao = gl.createVertexArray();
  gl.bindVertexArray(info.vao);

  const num = 2;  // pull out 2 values per iteration
  const type = gl.FLOAT;    // the data in the buffer is 32bit floats
  const normalize = false;  // don't normalize
  const stride = 0;         // how many bytes to get from one set of values to the next
                            // 0 = use type and numComponents above
  const offset = 0;         // how many bytes inside the buffer to start from

  // Create and bind position buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
     1.0,  1.0,
    -1.0,  1.0,
    -1.0, -1.0,
     1.0, -1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(positions),
                gl.STATIC_DRAW);

  gl.vertexAttribPointer(
    info.attribLocations.vertexPosition, num, type, normalize, stride, offset);
  gl.enableVertexAttribArray(info.attribLocations.vertexPosition);

  if(info.attribLocations.textureCoord != -1) {
    // Create and bind texture buffer
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    const textureCoordinates = [
      // Main Square
      1.0,  1.0,
      0.0,  1.0,
      0.0,  0.0,
      1.0,  0.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                  gl.STATIC_DRAW);
    gl.vertexAttribPointer(
      info.attribLocations.textureCoord, num, type, normalize, stride, offset);
    gl.enableVertexAttribArray(info.attribLocations.textureCoord);
  }

  return info;
}

function applyBoundaryConditions(gl, fb, texture, simInfo, boundaryInfo) {
  gl.useProgram(boundaryInfo.program);
  gl.bindVertexArray(boundaryInfo.vao);
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  bindTextureAsSampler(gl, boundaryInfo, texture);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  const offset = 0;
  const vertexCount = 4;
  gl.drawArrays(gl.LINE_LOOP, offset, vertexCount);
}
