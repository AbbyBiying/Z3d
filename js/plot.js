// to do:
// axis labels
// size data (DONE)
// classification data
// coloring for size data (DONE)
// plot size (DONE)
// create canvas (DONE)
// return element (DONE)
// speed improvement?
// inline orbit controls? (DONE)

var plot3d = function(arrX, arrY,arrZ,config) {

  if (typeof config === 'undefined') config = {};

  var arrSort = function(arr){
    var newArr = arr.slice().sort(function(a,b){
      return a-b;
    });
    return newArr;
  };

  //axis boundaries
  var xMax = arrSort(arrX)[arrX.length - 1];
  var xMin = arrSort(arrX)[0];
  var yMax = arrSort(arrY)[arrY.length - 1];
  var yMin = arrSort(arrY)[0];
  var zMax = arrSort(arrZ)[arrZ.length - 1];
  var zMin = arrSort(arrZ)[0];

  //size boundaries
  if (typeof config.size !== 'undefined'){
    var sizeMax = arrSort(config.size)[arrX.length - 1];
    var sizeMin = arrSort(config.size)[0];
  }

  // Create Scene
  var scene = new THREE.Scene();

  // ambient light stuff
  var light = new THREE.AmbientLight( 0x333333 );
  scene.add( light );

  // spotlight stuff
  var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 100, 1000, 100 );
  spotLight.castShadow = true;
  spotLight.shadowMapWidth = 1024;
  spotLight.shadowMapHeight = 1024;
  spotLight.shadowCameraNear = 500;
  spotLight.shadowCameraFar = 4000;
  spotLight.shadowCameraFov = 30;
  scene.add( spotLight );

  //camera stuff
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.x = 1.25 * Math.max(xMax, -xMin);
  camera.position.y = 1.25 * Math.max(yMax, -yMin);
  camera.position.z = 1.25 * Math.max(zMax, -zMin);

//renderer stuff
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xffffff);
  renderer.setSize( window.innerWidth, window.innerHeight );
  //document.body.appendChild(renderer.domElement);


//determine the renderer.domElement size and DOM element
  if (typeof config.elementID === 'undefined'){
    document.body.appendChild(renderer.domElement);
  }
  else{
    document.getElementById(config.elementID).appendChild(renderer.domElement);
  }

  renderer.domElement.style.width = (typeof config.width === 'undefined') ? '500px' : String(config.width)+'px';
  renderer.domElement.style.height = (typeof config.height === 'undefined') ? '500px' : String(config.height)+'px';


  //orbit controls
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render );

  //zoom stuff
  function animate(){
    requestAnimationFrame(animate);
    controls.update();
  }
  animate();

  // generate points
  var colorObj = (typeof config.size === 'undefined') ? {color:0x000000} : {color:0x999999};

  function point(a,b,c,d){
    var geometry = new THREE.SphereGeometry(d,15,15);
    var material = new THREE.MeshLambertMaterial(colorObj );
    console.log(material);
    var sphere = new THREE.Mesh(geometry, material);
    sphere.overdraw = true;
    sphere.position.x = a;
    sphere.position.y = b;
    sphere.position.z = c;
    return sphere;
  }

  arrX.forEach(function(thing,i){
    if (typeof config.size !== 'undefined'){
      var size = 0.075 + (config.size[i] - sizeMin)/(sizeMax - sizeMin)*0.5;
    }
    else{
      var size = 0.075;
    }
    scene.add(point(arrX[i],arrY[i],arrZ[i],size));
  });
  //end of point generation


  //axes building
  var matPos = new THREE.LineBasicMaterial({
    color: 0x000000
  });

   var matNeg = new THREE.LineBasicMaterial({
    color: 0x999999
  });

  var liner = function(x,y,z,material){
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(x, y, z));

    var line = new THREE.Line(geometry, material);
    return line;
  };

  //draw positive axes
  if(xMax > 0) scene.add(liner(xMax,0,0,matPos));
  if(yMax > 0) scene.add(liner(0,yMax,0,matPos));
  if(zMax > 0) scene.add(liner(0,0,zMax,matPos));

  //draw negative axes
  if(xMin < 0) scene.add(liner(xMin,0,0,matNeg));
  if(yMin < 0) scene.add(liner(0,yMin,0,matNeg));
  if(zMin < 0) scene.add(liner(0,0,zMin,matNeg));

  // axis labels (not complete)
  var xParam = {
    size: 10,
  }
  var xLab = new THREE.TextGeometry('test',xParam);
  //scene.add(xLab);



  //end of axes


  //render function
  function render(){
    requestAnimationFrame(render);
    renderer.render(scene,camera);
  }
  render();

  //function should return the DOM element containing the plot
  return renderer.domElement;
};

