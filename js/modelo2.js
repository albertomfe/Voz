      //variables globales
      var num_adultos="";
      var num_menores="";
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
           num_adultos=num_menores=cadenaInvertida=texto_dictado="";
           espacios=tam_cadena=comienzaEn=0;

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
            num_adultos=identificarOcupacion("adultos","adulto",texto_dictado);
            //-----------------------------------------------MENORES-------------------------------------------------------------------------------
            num_menores=identificarOcupacion("menores","menor",texto_dictado);


            $('#capture').text("Hablar");
            $('#capture').val("true");
            $('#status').text("Inactivo");
            console.log('Termine de Escuchar .......');
            console.log('adultos='+num_adultos);
            console.log('menores='+num_menores);
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
      *Metodo para separar las Ocupaciones
      *recibe como parametro el texto clave en plural y singular y el texto dictado por el Usuario
      */
      function identificarOcupacion(claveP,claveS,texto_dictado)
      {
          //si no se dicto nada no ejecutar codigo
          if(texto_dictado==""){ return 0; }

          var ocupacion="";
          //texto dictado  Evaluar y buscar el texto Indicado
          if(texto_dictado.indexOf(claveP)!=-1){
              comienzaEn=texto_dictado.indexOf(claveP);
          }
          else if(texto_dictado.indexOf(claveS)!=-1){
              comienzaEn=texto_dictado.indexOf(claveS);
          }
          else{
            comienzaEn=-1;//no se encuentra la palabra clave
          }

          //si encuentra la cadena
          if(comienzaEn!=-1)
          {
             //console.log("encontre la clave"+claveP);
             //empezar a recorrer apartir de la posicion que empieza la palabra clave en sentido inverso
              espacios=0;
              for(var i=(comienzaEn-1);i>=0;i--){
                if(texto_dictado[i]==" "){ espacios++; }
                else{ //si no hay espacios alamcenar
                      ocupacion+=texto_dictado[i];
                    }
                if(espacios>=2){break;}//cuando encuentre dos espacios que representan el corte de cadena deja de concatenar a el numero de adultos
              }

              //si contiene datos la variable de numero de adultos
              if(ocupacion!=""){
                var x=ocupacion.length;
                cadenaInvertida="";
                //console.log('n adulots== '+num_adultos);  console.log('n letras= '+x);
                while (x>=0) {
                  cadenaInvertida +=ocupacion.charAt(x);
                  x--;
                }
                cadenaInvertida=identificarCantidadNumerica(cadenaInvertida);//convertir el texto a Numero
                //ocupacion=cadenaInvertida;

                //si no es numerico
                if(isNaN(cadenaInvertida)){
                  cadenaInvertida=0;
                }

                return cadenaInvertida;//retornar el valor numerico
              }
          }
          else{
            //console.log("no se encontro la clave");
            //si no se encuentra el texto Solicitado retornar cero
            return 0;
          }
      }
      //-----------------------------------------------------------------------------------------------------------------------



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
