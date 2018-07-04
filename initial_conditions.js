function loadInitialProgramInfo(gl) {
  // Vertex shader
  const vsSource = `#version 300 es
    in vec4 aVertexPosition;
    in vec2 aTextureCoord;

    out vec2 vTextureCoord;

    void main(void) {
      gl_Position = aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

  // Fragment shader
  const fsSource = `#version 300 es
    precision mediump float;
    in vec2 vTextureCoord;

    out vec4 outColour;

    void main(void) {
      float r = sqrt(pow(vTextureCoord[0] - 0.5, 2.0) + pow(vTextureCoord[1] - 0.5, 2.0));
      outColour = vec4(0.5-pow(r,2.0), 0.0, 0.0, 1.0);
    }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
  };

  return programInfo;
}

function loadInitialConditions(gl, fb) {
  // Load & use program
  var programInfo = loadInitialProgramInfo(gl);
  gl.useProgram(programInfo.program);
  // Load & use vertex attrib
  var vao = setupVAO(gl, programInfo);
  gl.bindVertexArray(vao);
  // Bind correct framebuffer
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  // Finally draw
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.0, 0.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const offset = 0;
  const vertexCount = 4;
  gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
}
