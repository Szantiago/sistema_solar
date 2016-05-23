window.onload = function()
{
	$.getJSON('js/planetas.json', function (dato) {

	var ancho = window.innerWidth;
	var alto = window.innerHeight;
	var lienzo = new THREE.WebGLRenderer({alpha: true});
	var showDataNombre = $('#nombre');
	var showDataDescripcion = $('#text1');

	lienzo.setSize(ancho, alto);
	document.body.appendChild(lienzo.domElement);
	var escena = new THREE.Scene,tamanoRef = 60;

	var crearPlaneta = function(data)
	{
		var geometria = new THREE.SphereGeometry(data.tamano,data.tamano,data.tamano);
		var textura = THREE.ImageUtils.loadTexture(data.imagen);
		var material = new THREE.MeshBasicMaterial({opacity: 1 ,map: textura });
		return new THREE.Mesh(geometria, material);
	};

	var camara = new THREE.PerspectiveCamera(50,(ancho / alto),0.1, 10000);

	var planetPivot =[],
	lunaPivot = [],
	tierra,
	jupiter;

	for(var j = 0 ; j < dato.lunas.length; j++){
		dato.lunas[j].objeto = crearPlaneta({
								tamano 	: dato.lunas[j].tamano,
								imagen	: dato.lunas[j].imagen
							});
		dato.lunas[j].objeto.position.x =dato.lunas[j].x1;
		lunaPivot.push( new THREE.Object3D());
		lunaPivot[j].add(dato.lunas[j].objeto)
	}

for (var i = 0; i < dato.planets.length; i++) {

	dato.planets[i].objeto =	crearPlaneta({
										tamano:tamanoRef*(dato.planets[i].tamano/100),
										imagen:dato.planets[i].imagen});
	planetPivot.push( new THREE.Object3D());
	dato.planets[i].objeto.position.x = dato.planets[i].x1;
	escena.add(dato.planets[i].objeto);
	tierra=dato.planets[3].objeto;
	//jupiter=dato.planets[5].objeto;
}
tierra.add(lunaPivot[0]);
/*for (var j = 1; j <= 4; j++) {
	jupiter.add(lunaPivot[j]);
}
*/


var p=0;
var tam = dato.planets.length;


$('#siguiente').click(function () {
	if( p >=Number(tam-1))
	{
		p=0;
	}else
	{
		p++;
	}
	showDataNombre.text(mayus((dato.planets[p].nombre).toLowerCase()));
	showDataDescripcion.text(mayus((dato.planets[p].descripcion)));
	if(p<5)
	{
		if(p===0){
			camara.position.y =60;
			camara.position.z =180;
			camara.position.x = (dato.planets[p].x1)+410 ;
		}else {
			camara.position.y =130;
			camara.position.z =50;
			camara.position.x = dato.planets[p].x1;
		}
	} else
	{
		camara.position.y =130;
		camara.position.z =180;
		camara.position.x = dato.planets[p].x1;
	}
	camara.lookAt(dato.planets[p].objeto.position);

});


$('#anterior').click(function () {
	if( p <=0)
	{
		p=Number(tam-1);
	}else {
		p--;
	}
	showDataNombre.text(mayus((dato.planets[p].nombre).toLowerCase()));
	showDataDescripcion.text(mayus((dato.planets[p].descripcion)));
	if(p<5)
	{
		if(p===0){
			camara.position.y =60;
			camara.position.z =180;
			camara.position.x = (dato.planets[p].x1)+410 ;
		}else {
			camara.position.y =130;
			camara.position.z =50;
			camara.position.x = dato.planets[p].x1;
		}
	} else
	{
		camara.position.y =130;
		camara.position.z =180;
		camara.position.x = dato.planets[p].x1;
	}
		camara.lookAt(dato.planets[p].objeto.position);
});

showDataNombre.text(mayus((dato.planets[p].nombre).toLowerCase()));
showDataDescripcion.text(mayus((dato.planets[p].descripcion)));

camara.position.y =60;
camara.position.z =180;
camara.position.x = (dato.planets[p].x1)+410 ;
camara.lookAt(dato.planets[p].objeto.position);

	escena.add(camara);

	function renderizar()
	{
		lienzo.render(escena, camara);
		requestAnimationFrame(renderizar);
	}
	renderizar();


	function mayus(string){
  	return string.charAt(0).toUpperCase() + string.slice(1);
	}
	});
};
