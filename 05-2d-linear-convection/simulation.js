// Setup simulation program
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
    uniform vec2 dxy;

    out vec4 outColour;

    void main(void) {
      float dt = 0.4*dxy.x;
      float cx = 0.7;
      float cy = 0.5;

      // Get variables
      float ink = texture(uSampler, vTextureCoord).z;
      float inkmx = texture(uSampler, vec2(vTextureCoord.x - dxy.x, vTextureCoord.y        )).z;
      float inkmy = texture(uSampler, vec2(vTextureCoord.x,         vTextureCoord.y - dxy.y)).z;

      // Perform numerical calculation
      ink = ink - cx * (ink - inkmx)*dt/dxy.x - cy * (ink - inkmy)*dt/dxy.y;

      // Output results
      float alpha = texture(uSampler, vTextureCoord).w;
      outColour = vec4(cx, cy, ink, alpha);
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
      dxy: gl.getUniformLocation(shaderProgram, 'dxy'),
    },
  };

  setupVAO(gl, info);

  return info;
}

// Main rendering/simulation loop
function loop(gl, framebuffers, textures, screenInfo, simInfo, boundaryInfo, simVars) {
  var count = simVars.count;
  var time = simVars.time;

  // Setup GL rendering
  gl.useProgram(simInfo.program);
  gl.bindVertexArray(simInfo.vao);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[(1 + count) % 2]);
  bindTextureAsSampler(gl, simInfo, textures[(0 + count) % 2]);

  // Load in uniforms
  gl.uniform1f(simInfo.uniformLocations.time, time/1000);
  gl.uniform2f(simInfo.uniformLocations.dxy, 1.0/gl.canvas.width, 1.0/gl.canvas.height);

  // Run one cycle of simulation
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  applyBoundaryConditions(gl, framebuffers[(1 + count) % 2], textures[0 + (count % 2)], simInfo, boundaryInfo);

  drawToScreen(gl, screenInfo, textures[count%2]);

  simVars.timePrev = time;
  simVars.count++;
  var fps = 60;

  setTimeout(function () {
    window.requestAnimationFrame(function (tFrame) {
      simVars.time = tFrame;
      loop(gl, framebuffers, textures, screenInfo, simInfo, boundaryInfo, simVars);
    });
  }, 1000/fps);
}

function startSimulation (gl) {
  surfaces = createRenderingSurfaces(gl);

  loadInitialConditions(gl, surfaces.framebuffers[0]);

  const simInfo = loadSimInfo(gl);
  const boundaryInfo = loadBoundaryInfo(gl);
  const screenInfo = loadScreenInfo(gl);

  var simVars = {
    time: 0,
    timePrev: 0,
    count: 0,
  };

  loop(gl, surfaces.framebuffers, surfaces.textures, screenInfo, simInfo, boundaryInfo, simVars)
}
