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
      gl_FragColor = texture2D(uSampler, vec2(vTextureCoord[0]+0.1*sin(time), vTextureCoord[1]+0.1*cos(time)));
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

function loop(gl, framebuffers, textures, screenInfo, simInfo, boundaryInfo, simVars) {
  var count = simVars.count;
  var time = simVars.time;

  gl.useProgram(simInfo.program);
  gl.bindVertexArray(simInfo.vao);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[(1 + count) % 2]);
  bindTextureAsSampler(gl, simInfo, textures[(0 + count) % 2]);

  gl.uniform1f(simInfo.uniformLocations.time, time/1000);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  applyBoundaryConditions(gl, framebuffers[(1 + count) % 2], textures[0 + (count % 2)], simInfo, boundaryInfo);

  drawToScreen(gl, screenInfo, textures[count%2]);

  simVars.timePrev = time;
  simVars.count++;

  setTimeout(function () {
    window.requestAnimationFrame(function (tFrame) {
      simVars.time = tFrame;
      loop(gl, framebuffers, textures, screenInfo, simInfo, boundaryInfo, simVars);
    });
  }, 1000/30);
}

function runSimulation(gl, framebuffers, textures, screenInfo) {
  const simInfo = loadSimInfo(gl);
  const boundaryInfo = loadBoundaryInfo(gl);

  var simVars = {
    time: 0,
    timePrev: 0,
    count: 0,
  };

  loop(gl, framebuffers, textures, screenInfo, simInfo, boundaryInfo, simVars)
}
