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

    const float PI = 3.1415926535897932384626433832795;

    float ux = 0.5;
    float uy = 0.5;
    float ink = 0.5;
    float alpha = 0.0;

    void main(void) {
      vec2 pos = vTextureCoord.xy;
      if(pos.x > 0.25 && pos.x < 0.75 && pos.y > 0.25 && pos.y < 0.75) {
        ux = 0.8;
        uy = 0.8;
        ink = 0.8;
      }
      outColour = vec4(ux, uy, ink, alpha);
    }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const info = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
  };

  setupVAO(gl, info);

  return info;
}

function loadInitialConditions(gl, fb) {
  // Load & use program
  var info = loadInitialProgramInfo(gl);
  gl.useProgram(info.program);
  // Load & use vertex attrib
  gl.bindVertexArray(info.vao);
  // Bind correct framebuffer
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  // Finally draw
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
