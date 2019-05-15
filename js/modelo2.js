      //variables globales
      var num_adultos="";
      var cadenaInvertida="";
      var espacios=0;
      var tam_cadena=0;
      var texto_dictado="";

    $( document ).ready(function()
    {

    console.log('Starting SpeechRecognition library.');
    var speech = new Speech();

        //empezar a reconocer voz
        speech.recognition.onstart = function()
        {   //inicializar variablesS cuando empiece hablar
           num_adultos=cadenaInvertida=texto_dictado="";
           espacios=tam_cadena=0;

            $('#capture').text("Parar");
            $('#capture').val("false");
            $('#status').text("Escuchando .......");
        }

        //Partaste de Hablar
        speech.recognition.onend = function()
        {
            //cuando termine de hablar evaluar
            texto_dictado=texto_dictado.toLowerCase();//convertir a minusculas
            tam_cadena=texto_dictado.length;
            $('#output').text(texto_dictado);

            //-----------------------------------------------ADULTOS-------------------------------------------------------------------------------
            //texto dictado buscar el texto adultoso adulto
            if(texto_dictado.indexOf("adultos")!=-1){
                var adultoEmpiezaEn=texto_dictado.indexOf("adultos");
            }
            if(texto_dictado.indexOf("adulto")!=-1){
                var adultoEmpiezaEn=texto_dictado.indexOf("adulto");
            }

            //si encuentra la cadena
            if(adultoEmpiezaEn!=-1)
            {
               //empezar a recorrer un for alrevez apartir de la posicion que empiez ala palabra adultos
                adultos="";
                espacios=0;
                for(var i=(adultoEmpiezaEn-1);i>=0;i--){
                  if(texto_dictado[i]==" "){ espacios++; }
                  else{ //si no hay espacios alamcenar
                        num_adultos+=texto_dictado[i];
                      }
                  if(espacios>=2){break;}//cuando encuentre dos espacios que representan el corte de cadena deja de concatenar a el numero de adultos
                  //console.log("caracter= "+texto_dictado[i]);
                  //console.log("espacios= "+espacios);
                }

                //si contiene datos la variable de numero de adultos
                if(num_adultos!=""){
                  var x=num_adultos.length;
                  cadenaInvertida="";
                  //console.log('n adulots== '+num_adultos);  console.log('n letras= '+x);
                  while (x>=0) {
                    cadenaInvertida +=num_adultos.charAt(x);
                    x--;
                  }
                  cadenaInvertida=identificarCantidadNumerica(cadenaInvertida);//convertir el texto a Numero
                  num_adultos=cadenaInvertida;
                }
            }


          //-----------------------------------------------MENORES-------------------------------------------------------------------------------
          if(texto_dictado.indexOf("menores")!=-1){
              var adultoEmpiezaEn=texto_dictado.indexOf("menores");
          }
          if(texto_dictado.indexOf("menor")!=-1){
              var adultoEmpiezaEn=texto_dictado.indexOf("menor");
          }


            $('#capture').text("Hablar");
            $('#capture').val("true");
            $('#status').text("Inactivo");
            console.log('Termine de Escuchar .......');
            console.log('adultos='+num_adultos);
        }

        //Precionar el Boton
        $('#capture').click(function(){
        if ($('#capture').val() == "true") {
          speech.startCapture();
        }
        else {
          speech.stopCapture();
        }
        });

      });





      //funcion de habla
      function Speech()
      {
        if ('webkitSpeechRecognition' in window)
        {
          // creating voice capture object
          this.recognition = new webkitSpeechRecognition();
          // settings
          this.recognition.continuous = false; // stop automatically
          this.recognition.interimResults = true;
          this.recognition.lang = "es-Mx";//definir el lenguaje

          //inicializar el metodo de reconocimiento de voz
          this.startCapture = function() {
            this.recognition.start();
          }

          //almacenar el texto dictado
          this.recognition.onresult = function(event)
          {
            texto_dictado=event.results[0][0].transcript;//reconociendo el texto y alamcenarlo en la variable texto
          }

          //pausar el metodo de reconocimiento de voz
          this.stopCapture = function() {
            this.recognition.stop();
          }

          //capturar errores
          this.recognition.onerror = function(event) {
            console.log(event.error);
          }

          console.log("webkitSpeechRecognition is available.");
        } else {
          console.log("webkitSpeechRecognition is not available.");
        }
      }


      /*
      *Identificar el caracter numerico del texto enviado
      *recibe como parametro el texto con el numero en letras
      *retorna el digito numerico
      */
      function identificarCantidadNumerica(texto)
      {
          switch(texto)
          {
            case "un":
              return 1;
            break;
            case "dos":
              return 2;
            break;
            case "tres":
              return 3;
            break;
            case "cuatro":
              return 4;
            break;
            case "cinco":
              return 5;
            break;
            case "seis":
              return 6;
            break;
            case "siete":
              return 7;
            break;
            case "ocho":
              return 8;
            break;
            case "nueve":
              return 9;
            break;
            case "diez":
              return 10;
            break;
            default:
              return texto;
            break;
          }
      }
