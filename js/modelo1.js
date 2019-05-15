

//console.log(document.readyState); //Mostrar el estado
/*verificar qeue el dom este listo*/
document.onreadystatechange = () =>{
  if (document.readyState === 'complete')
  {
    // document ready
    console.log("Empezar");
    //document.getElementById("video1").src += "&autoplay=1";

    if(annyang)
    {
      console.log("soporta la libreria");
      var comandos=
      {
        "hola":function(){alert('hola');},
        "reproducir": playVideo,
        "pausar":pauseVideo,
      }
    }


    annyang.addCommands(comandos);//ejecutar comandos
    annyang.setLanguage("es-Mx");
    annyang.start();


    //var myVideo = document.getElementById("miVideo");
    function playVideo(){
        console.log("reproduciendo");
        let ruta=document.getElementById("video1").src;//obtener ruta actual
        if(ruta.length==67){
          document.getElementById("video1").src += "&autoplay=1";
        }
        //console.log(ruta.length);
    }


    function pauseVideo(){
        let ruta=document.getElementById("video1").src;
        if(ruta.length==78){ //si se esta reproduciendo
              console.log("Pausando");
              ruta=ruta.slice(0, -11);
              document.getElementById("video1").src = ruta;
        }else
          {
            console.log("ya esta Pausando");
          }


        //console.log(ruta);

    }


  }
};
