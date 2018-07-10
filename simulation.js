function loadSimInfo(gl) {
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
    precision highp float;
    in vec2 vTextureCoord;

    uniform sampler2D uSampler;
    uniform float time;
    uniform float dt;
    uniform vec2 rdxy;

    out vec4 outColour;

    void main(void) {
      vec2 u = texture(uSampler, vTextureCoord).xy;
      float ink = texture(uSampler, vTextureCoord).z;
      float inkmx = texture(uSampler, vec2(vTextureCoord.x - 1.0/rdxy.x, vTextureCoord.y)).z;
      float alpha = texture(uSampler, vTextureCoord).w;
      ink = ink - u.x * dt * rdxy.x * (ink - inkmx);
      //ink = ink - 0.9 * (ink - inkmx);
      //ink = ink - (ink - inkmx);
      outColour = vec4(u, ink, alpha);
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
      dt: gl.getUniformLocation(shaderProgram, 'dt'),
      rdxy: gl.getUniformLocation(shaderProgram, 'rdxy'),
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
  gl.uniform1f(simInfo.uniformLocations.dt, 0.9/gl.canvas.width);
  gl.uniform2f(simInfo.uniformLocations.rdxy, gl.canvas.width, gl.canvas.height);

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
