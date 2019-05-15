<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" type="text/css" href='css/estilo.css'/>

    <script>
    var PermisoVoz=0;
    if (!'speechSynthesis' in window)
    {
        alert("Lo siento, tu navegador no soporta esta tecnología");
    }
    else
    {
        PermisoVoz=1;
        //console.log("Chingon, si puedes usar la tecnologia");
        //Establecer el Idioma
        //var myLang = speechSynthesisUtteranceInstance.lang;
        //speechSynthesisUtteranceInstance.lang = 'es-ES';
    }

    if(PermisoVoz==1)
    {
      var speechSynthesisUtterance = new SpeechSynthesisUtterance('hola, Imacop te da la Bienvenida, en que te podemos ayudar');
      speechSynthesisUtterance.lang = 'es-Es';//Definir el Idioma
      speechSynthesisUtterance.pitch = 1;//Definir el Tono de la Voz 0 a 2
      speechSynthesisUtterance.rate = 1;//Definir la Velocidad del Parlante 0.1 a 10
      window.speechSynthesis.speak(speechSynthesisUtterance);
    }


    function hablar()
    {
      //si es apto para Usar la Tecnologia
      if(PermisoVoz==1)
      {
        var mensaje=document.getElementById('mensaje').value;
        var speechSynthesisUtterance = new SpeechSynthesisUtterance(mensaje);
        window.speechSynthesis.speak(speechSynthesisUtterance);
      }
    }



    setTimeout(escuchar,3000);//ejecutar  reconocimiento de voz despues de qeu termine de habalr la vienvenida


    /*
    *Verificar si soporta el Reconocimiento de Voz
    */
    function escuchar()
    {
      var rec;
      var usuario_Dice="";
      if (('webkitSpeechRecognition' in window))
      {
        console.log('Soporta el Reconocimientopp');

        rec = new webkitSpeechRecognition();
        //rec.interimResults = true;
        rec.lang = "es-Mx";
        rec.continuous = true;
        rec.interim = true;
        rec.addEventListener("result",iniciar);


        /*rec.onstart = function() {
          console.log('Empezando a Escuchar');
        }*/

        rec.start();

        function iniciar(event)
        {
          for (var i = event.resultIndex; i < event.results.length; i++)
          {
                 usuario_Dice=event.results[i][0].transcript;
                 document.getElementById('mensaje').value =usuario_Dice;
                 //recognition.stop();
          }
          //si no tiene resultados de voz


          //empezar clasificacion de Opciones
          switch (usuario_Dice) {
              case "Cancún":
                alert('Seleccionaste Cancun');
              /*  var mensaje=document.getElementById('Seleccionaste Cancún').value;
                var speechSynthesisUtterance = new SpeechSynthesisUtterance(mensaje);
                window.speechSynthesis.speak(speechSynthesisUtterance);*/
              break;
              case "Riviera Nayarit":
                alert('Seleccionaste Riviera Nayarit');
              break;
              case "Acapulco":
                alert('Seleccionaste Acapulco');
              break;
              case "Puerto Vallarta":
                alert('Seleccionaste Puerto Vallarta');
              break;
              default:
                return "Puerto Vallarta";
              break;
          }

        }
      }//validacion de soporte de tecnologia
    }



    </script>
  </head>


  <body>
    Escribe tu mensaje:<br>
		<input id="mensaje" cols="30" rows="5"/>
		<br><br>
		<input type='button' onclick='hablar()' id="hablar" value='Decir'/>
  </body>
</html>
