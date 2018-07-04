var current = 1;
var time = 0;

function draw(gl, fb, textures, buffers, simProgramInfo, screenProgramInfo) {
  bindTextureAsFramebuffer(gl, fb, textures[current]);
  drawScene(gl, simProgramInfo, buffers, textures[(current+1)%2], function () {
    gl.uniform1f(simProgramInfo.uniformLocations.time, time);
  });
  current += 1;
  time += 1;
  if(time < 10) {
    window.requestAnimationFrame(function () {
      draw(gl, fb, textures, buffers, simProgramInfo, screenProgramInfo);
    });
  }
}

function main() {
  const canvas = document.querySelector("#glCanvas");
  // Initialize the GL context
  const gl = canvas.getContext("webgl2");

  // Only continue if WebGL is available and working
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  // Load screen rendering info
  const screenProgramInfo = loadScreenProgramInfo(gl);
  const screenVAO = setupVAO(gl, screenProgramInfo);

  // Load texture-to-texture (i.e. simulation) rendering info
  const simProgramInfo = loadSimProgramInfo(gl);
  const simVAO = setupVAO(gl, simProgramInfo);

  // Load textures
  var textures = [];
  var framebuffers = [];

  for (var ii = 0; ii < 2; ++ii) {
    var texture = loadTexture(gl, canvas.width, canvas.height);
    textures.push(texture);

    // Create a framebuffer
    var fbo = gl.createFramebuffer();
    framebuffers.push(fbo);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    // Attach a texture to it.
    var attachmentPoint = gl.COLOR_ATTACHMENT0;
    gl.framebufferTexture2D(
            gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, 0
    );
  }

  loadInitialConditions(gl, framebuffers[0]);
  //loadInitialConditions(gl, null);

  gl.useProgram(simProgramInfo.program);
  gl.bindVertexArray(simVAO);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[1]);
  bindTextureAsSampler(gl, simProgramInfo, textures[0]);

  gl.uniform1f(simProgramInfo.uniformLocations.time, 0.5);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.0, 0.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const offset = 0;
  const vertexCount = 4;
  gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);

  drawToScreen(gl, screenProgramInfo, screenVAO, textures[1]);
}

main();
