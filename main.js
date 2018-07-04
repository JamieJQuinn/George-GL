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
  var screenVAO = setupVAO(gl, screenProgramInfo);

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

  loadInitialConditions(gl, framebuffers[0], textures[0]);
  //loadInitialConditions(gl, null, textures[0]);

  // Draw to Screen
  gl.useProgram(screenProgramInfo.program);
  gl.bindVertexArray(screenVAO);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  bindTextureAsSampler(gl, screenProgramInfo, textures[0]);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.0, 0.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const offset = 0;
  const vertexCount = 4;
  gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);




  //drawToScreen(gl, screenProgramInfo, buffers, textures[0]);
  //var simProgramInfo = loadSimProgramInfo(gl);

  //window.requestAnimationFrame(function () {
    //draw(gl, fb, textures, buffers, simProgramInfo, screenProgramInfo);
  //});

}

main();
