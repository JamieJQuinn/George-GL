var Nt = 2;

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

  // Load buffers for rendering surfaces
  const buffers = initBuffers(gl);

  // Load textures
  var textures = [loadTexture(gl, canvas.width, canvas.height),
                  loadTexture(gl, canvas.width, canvas.height)];

  const fb = gl.createFramebuffer();

  loadInitialConditions(gl, buffers, fb, textures[0]);
  var simProgramInfo = loadSimProgramInfo(gl);

  // Load blocker
  var sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);

  var current = 1;

  for(var i=0; i<Nt; ++i) {
    bindTextureAsFramebuffer(gl, fb, textures[current]);
    drawScene(gl, simProgramInfo, buffers, textures[(current+1)%2]);
    var status = gl.clientWaitSync(sync, 0, 0);
    if (!status) {
      console.log("uh oh");
    }
    current += 1;
  }

  drawToScreen(gl, screenProgramInfo, buffers, textures[current]);
}

main();
