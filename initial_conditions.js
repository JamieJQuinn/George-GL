function loadInitialConditions(gl, buffers, texture) {
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

    void main(void) {
      float r = sqrt(pow(vTextureCoord[0] - 0.5, 2.0) + pow(vTextureCoord[1] - 0.5, 2.0));
      gl_FragColor = vec4(0.5-pow(r,2.0), 0.0, 0.0, 1.0);
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

  // Create and bind the framebuffer
  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

  // attach the texture as the first color attachment
  const attachmentPoint = gl.COLOR_ATTACHMENT0;
  const level = 0;
  gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, level);

  drawScene(gl, programInfo, buffers);
}
