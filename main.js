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

  // Load buffers for rendering surfaces
  const buffers = initBuffers(gl);

  // Load textures
  var textures = [loadTexture(gl, canvas.width, canvas.height),
                  loadTexture(gl, canvas.width, canvas.height)];

  const fb = gl.createFramebuffer();

  loadInitialConditions(gl, buffers, fb, textures[0]);
  //var simProgramInfo = loadSimProgramInfo(gl);

  //window.requestAnimationFrame(function () {
    //draw(gl, fb, textures, buffers, simProgramInfo, screenProgramInfo);
  //});

  drawToScreen(gl, screenProgramInfo, buffers, textures[current]);
}

main();
