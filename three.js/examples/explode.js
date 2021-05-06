var uvOffsetArray;
var baseS, baseT;
var sprite;

function buildSprite(texMat, markerGroup) {
	const size = 2.0;

	// old school ...
	let vertices = [-size/2, -size/2, 0, size/2, -size/2, 0,
                    size/2, size/2, 0, -size/2, size/2, 0];
	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
		
	let indices = [0,1,2, 0,2,3];
	geometry.setIndex(indices);

	let uvs = []
	uvs.push (0,0.75, 0.125,0.75, 0.125,1, 0,1);  // LL of first frame: [0, 0.75]
    geometry.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

	geometry.computeBoundingSphere();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    sprite = new THREE.Mesh(geometry, texMat);
    markerGroup.add(sprite);
}

function initSprite(markerGroup) {
  setUpOffsetArray();

  // instantiate a loader
  var loader = new THREE.TextureLoader();
  loader.setCrossOrigin ('');
  // load a resource
  loader.load(
    // resource URL
    'https://i.imgur.com/6ePTx6p.png',

    // Function when resource is loaded
    function(texture) {
      // Plane with default texture coordinates [0,1]x[0,1]
      var texMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true, // cutout texture: set transparent: true
        side: THREE.DoubleSide
      });
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      buildSprite(texMat, markerGroup);
    },
    // Function called when download progresses
    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Function called when download errors
    function(xhr) {
      console.log('An error happened');
    }
  );

}


// slightly different
// this is an OFFSET array
// how the array going to increment in this state 
// initial uv (of lower left corner) is (0, 0.75)
function setUpOffsetArray() {
  uvOffsetArray = [];
  var rowCount = 4; // 4x8 sprites
  var colCount = 8;
  for (var i = 0; i < rowCount; i++) {
    var row = [];
    for (var j = 0; j < colCount; j++)
      row.push(new THREE.Vector2(j * 0.125, - 0.25 * i));
    uvOffsetArray.push(row);
  }
}

function _spriteAnimate() {
 let msg = `[${baseS}] [${baseT}]`
 console.log (msg);
  
  sprite.material.map.offset.copy (uvOffsetArray[baseS][baseT]);  
  baseT = (baseT + 1) % 8;
  if (baseT === 0) {
    baseS = (baseS + 1) % 4;
  }
  
  if (baseS !== 3 || baseT !== 7) // NOT (baseS = 3 ^ baseT = 7)
  	setTimeout (_spriteAnimate, 100); // proceed to next frame
  else {
  	sprite.material.map.offset.copy (uvOffsetArray[0][0]);  // back to first frame
  }
}

// trigger the animation
function spriteAnimate() {
  if (sprite === undefined) {
  	console.log ('return in spriteAnimate')
  	return;
  }
  
  baseS = baseT = 0;
  setTimeout (_spriteAnimate, 100);
}

