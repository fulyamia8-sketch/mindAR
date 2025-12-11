// import KULLANMA
const status = (msg) => {
  let el = document.getElementById('status');
  if (!el) {
    el = document.createElement('div');
    el.id = 'status';
    el.style.cssText =
      'position:fixed;left:8px;top:8px;background:rgba(0,0,0,.7);color:#fff;padding:8px 10px;border-radius:8px;font:14px system-ui;z-index:9999';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  console.log('[DEBUG]', msg);
};

async function run () {
  try {
    status('Checking camera permission…');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status('ERROR: getUserMedia not available.');
      return;
    }

    status('Loading targets: ./assets/targets.mind');

    // CDN ile global isim:
    const mindar = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './assets/targets.mind'
    });

    const { renderer, scene, camera } = mindar;

    const hemi = new THREE.HemisphereLight(0xffffff, 0x222222, 1);
    scene.add(hemi);

    const anchor = mindar.addAnchor(0);
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.2),
      new THREE.MeshNormalMaterial()
    );
    cube.position.y = 0.1;
    anchor.group.add(cube);

    anchor.onTargetFound = () => status('Marker FOUND ✅');
    anchor.onTargetLost  = () => status('Marker LOST');

    status('Requesting camera…');
    await mindar.start();
    status('Camera started. Point at marker.');

    renderer.setAnimationLoop(() => renderer.render(scene, camera));
  } catch (e) {
    console.error(e);
    status('ERROR: ' + (e?.message || e));
  }
}
run();
