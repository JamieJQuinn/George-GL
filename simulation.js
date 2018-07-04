function loadSimInfo(gl) {
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
      gl_FragColor = texture2D(uSampler, vec2(vTextureCoord[0]+sin(time), vTextureCoord[1]));
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
      time: gl.getUniformLocation(shaderProgram, 'time'),
    },
  };

  setupVAO(gl, info);

  return info;
}

function loop(gl, framebuffers, textures, screenInfo, simInfo, simVars) {
  var count = simVars.count;
  var time = simVars.time;

  gl.useProgram(simInfo.program);
  gl.bindVertexArray(simInfo.vao);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[1 + (count % 2)]);
  bindTextureAsSampler(gl, simInfo, textures[0 + (count % 2)]);

  gl.uniform1f(simInfo.uniformLocations.time, time/1000);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.0, 0.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const offset = 0;
  const vertexCount = 4;
  gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);

  //drawToScreen(gl, screenInfo, textures[count]);

  simVars.timePrev = time;
  simVars.count++;

  window.requestAnimationFrame(function (tFrame) {
    simVars.time = tFrame;
    loop(gl, framebuffers, textures, screenInfo, simInfo, simVars);
  });
}

function runSimulation(gl, framebuffers, textures, screenInfo) {
  const simInfo = loadSimInfo(gl);

  var simVars = {
    time: 0,
    timePrev: 0,
    count: 0,
  };

  loop(gl, framebuffers, textures, screenInfo, simInfo, simVars)
}
