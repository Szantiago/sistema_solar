window.onload = function()
{
	$.getJSON('js/planetas.json', function (dato) {

			var ancho = window.innerWidth;
			var alto = window.innerHeight;
			var lienzo = new THREE.WebGLRenderer({alpha: true});
			var lunaPivot = [], // guarda las lunas para agregarlas a los planetas
					tierra, // guarda el planeta tierra
					jupiter, // guarda el planeta jupiter
					saturno; // guarda el planeta saturno
			var showDataNombre = $('#nombre'); //Variable para mostrar el nombre del planteta
			var showDataDescripcion = $('#text1'); // Variable para mostrar la descripcion del planeta
			var p=0; // Variable para ubicar el planeta al clickear los botones
			var tam = dato.planets.length;

			lienzo.setSize(ancho, alto);
			document.body.appendChild(lienzo.domElement);
			var escena = new THREE.Scene,tamanoRef = 60;

//Funcion para crear planetas
			var crearPlaneta = function(data)
			{
				var geometria = new THREE.SphereGeometry(data.tamano,data.tamano,data.tamano);
				var textura = THREE.ImageUtils.loadTexture(data.imagen);
				var material = new THREE.MeshBasicMaterial({opacity: 1 ,map: textura });
				return new THREE.Mesh(geometria, material);
			};

			var camara = new THREE.PerspectiveCamera(50,(ancho / alto),0.1, 10000);

// crear las lunas
			for(var j = 0 ; j < dato.lunas.length; j++)
			{
				dato.lunas[j].objeto = crearPlaneta({
										tamano 	: dato.lunas[j].tamano,
										imagen	: dato.lunas[j].imagen
									});
				dato.lunas[j].objeto.position.x =dato.lunas[j].x1;
				lunaPivot.push( new THREE.Object3D());
				lunaPivot[j].add(dato.lunas[j].objeto); //guarda las lunas en el array lunapivot para unirla al planeta despues
			}

//crear planetas
		for (var i = 0; i < dato.planets.length; i++)
		{
			dato.planets[i].objeto =	crearPlaneta({
											tamano:tamanoRef*(dato.planets[i].tamano/100),
											imagen:dato.planets[i].imagen});
			dato.planets[i].objeto.position.x = dato.planets[i].x1;
			escena.add(dato.planets[i].objeto);
			tierra=dato.planets[3].objeto;
			jupiter=dato.planets[5].objeto;
			saturno=dato.planets[6].objeto;
		}
		tierra.add(lunaPivot[0]); //Une a la tierra con su respectiva luna

		for (var j = 1; j <= 4; j++) {
			jupiter.add(lunaPivot[j]); //Une a jupiter con sus respectivas lunas
		}

		for (var j = 5; j < dato.lunas.length; j++) {
			saturno.add(lunaPivot[j]); //Une a saturno con sus respectivas lunas
		}

//evento del boton siguiente
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
				}else
				{
					camara.position.y =120;
					camara.position.z =150;
					camara.position.x = dato.planets[p].x1;
				}
			}else
			{
				if(p===5 || p===6)
				{
					camara.position.y =850;
					camara.position.z =550;
					camara.position.x = dato.planets[p].x1;
				}else
				{
					camara.position.y =150;
					camara.position.z =100;
					camara.position.x = dato.planets[p].x1;
				}
			}
			camara.lookAt(dato.planets[p].objeto.position);
		});

//evento del boton anterior
		$('#anterior').click(function () {
			if( p <=0)
			{
				p=Number(tam-1);
			}else
			{
				p--;
			}
			showDataNombre.text(mayus((dato.planets[p].nombre).toLowerCase()));
			showDataDescripcion.text(mayus((dato.planets[p].descripcion)));
			if(p<5)
			{
				if(p===0)
				{
					camara.position.y =60;
					camara.position.z =180;
					camara.position.x = (dato.planets[p].x1)+410 ;
				}else
				{
					camara.position.y =120;
					camara.position.z =150;
					camara.position.x = dato.planets[p].x1;
				}
			}else
			{
				if(p==5 || p==6)
				{
					camara.position.y =850;
					camara.position.z =580;
					camara.position.x = dato.planets[p].x1;
				}else
				{
					camara.position.y =150;
					camara.position.z =150;
					camara.position.x = dato.planets[p].x1;
				}
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
			for (var i = 0; i < dato.planets.length; i++) {
				dato.planets[i].objeto.rotation.y += 0.04; //rotacion de los planetas
			}
			for (var j = 0; j < dato.lunas.length; j++) {
				lunaPivot[j].rotation.y += dato.lunas[j].traslacion; //traslacion de las lunas
			}
			lienzo.render(escena, camara);
			requestAnimationFrame(renderizar);
		}
		renderizar();

//funcion para pasar la primer letra de los textos a mayuscula
		function mayus(string){
  		return string.charAt(0).toUpperCase() + string.slice(1);
		}

	});
};
