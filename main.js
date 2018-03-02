function main() {
  const canvas = document.querySelector("#glCanvas");
  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  // Load screen rendering info
  const screenProgramInfo = loadScreenProgramInfo(gl);

  // Load texture
  const texture = loadTexture(gl, canvas.width, canvas.height);

  var buffers = initBuffers(gl);

  loadInitialConditions(gl, buffers, texture);

  drawToScreen(gl, screenProgramInfo, buffers, texture);
}

main();
