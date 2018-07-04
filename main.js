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
  const screenInfo = loadScreenInfo(gl);

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

  runSimulation(gl, framebuffers, textures, screenInfo);

  drawToScreen(gl, screenInfo, textures[1]);
}

main();
