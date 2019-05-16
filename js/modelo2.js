      //variables globales
      var fecha_viaje="";
      var num_adultos="";
      var num_menores="";
      var edades=[];
      var num_noches="";
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
            //-----------------------------------------------Edades-------------------------------------------------------------------------------
            edades=identificarEdades(texto_dictado);
            //-----------------------------------------------Noches-------------------------------------------------------------------------------
            num_noches=identificarOcupacion("noches","noche",texto_dictado);

            //console.log(edades);
            //-----------------------------------------------FECHA DE VIAJE-------------------------------------------------------------------------------
            //fecha_viaje=identificarFecha(texto_dictado);


            $('#capture').text("Hablar");
            $('#capture').val("true");
            $('#status').text("Inactivo");
            console.log('Termine de Escuchar .......');
            console.log('adultos='+num_adultos);
            console.log('menores='+num_menores);

            let k=0;
            while(k<edades.length)
            {
              console.log('menor '+(k+1)+'='+edades[k]+' Años');
              k++;
            }
            console.log('noches='+num_noches);
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
      *Metodo para Identificar la Fecha de Viaje
      *recibe como parametro el texto dictado
      *
      */
      function identificarFecha(texto_dictado)
      {
          //si no se dicto nada no ejecutar codigo
          if(texto_dictado==""){ return ""; }

          if(texto_dictado.indexOf("enero")!=-1)  {  comienzaEn=texto_dictado.indexOf("enero");  }
          else if(texto_dictado.indexOf("febrero")!=-1){  comienzaEn=texto_dictado.indexOf("febrero");}
          else if(texto_dictado.indexOf("marzo")!=-1){  comienzaEn=texto_dictado.indexOf("marzo");}
          else if(texto_dictado.indexOf("abril")!=-1){  comienzaEn=texto_dictado.indexOf("abril");}
          else if(texto_dictado.indexOf("mayo")!=-1){  comienzaEn=texto_dictado.indexOf("mayo");}
          else if(texto_dictado.indexOf("junio")!=-1){  comienzaEn=texto_dictado.indexOf("junio");}
          else if(texto_dictado.indexOf("julio")!=-1){  comienzaEn=texto_dictado.indexOf("julio");}
          else if(texto_dictado.indexOf("agosto")!=-1){  comienzaEn=texto_dictado.indexOf("agosto");}
          else if(texto_dictado.indexOf("septiembre")!=-1){  comienzaEn=texto_dictado.indexOf("septiembre");}
          else if(texto_dictado.indexOf("octubre")!=-1){  comienzaEn=texto_dictado.indexOf("octubre");}
          else if(texto_dictado.indexOf("noviembre")!=-1){  comienzaEn=texto_dictado.indexOf("noviembre");}
          else if(texto_dictado.indexOf("diciembre")!=-1){  comienzaEn=texto_dictado.indexOf("diciembre");}

          console.log('fecha comienza en  '+comienzaEn);

      }



      /*
      *Metodo para Identificar las Edades de Los menores
      *recibe como parametro el texto dictado
      */
      function identificarEdades(texto_dictado)
      {
        //si no se dicto nada no ejecutar codigo
        edades=[];
        if(texto_dictado==""){ return edades; }

        //buscar coincidencia de Edades
        if(texto_dictado.indexOf("años")!=-1){
            comienzaEn=texto_dictado.indexOf("años");
        }
        else if(texto_dictado.indexOf("año")!=-1){
            comienzaEn=texto_dictado.indexOf("año");
        }
        else{  comienzaEn=-1;  }


        //si encuentra la cadena
        if(comienzaEn!=-1)
        {
          //empezar a recorrer apartir de la posicion que empieza la palabra clave en sentido inverso
           espacios=0;
           var pos=0;//manejar pociciones de las edades
           edades[0]="";
           for(var i=(comienzaEn-1);i>=0;i--)
           {
             if(texto_dictado[i]=="y"){ pos++; edades[pos]="";/*se crea la edad del menor*/  }
             if(texto_dictado[i]==" "){ espacios++;  }
             else
             { //si no hay espacios alamcenar
               //console.log('entre pos='+pos);
                if(texto_dictado[i]!="y" && !isNaN(texto_dictado[i]) )
                {
                  edades[pos]+=texto_dictado[i];
                  console.log('pos= '+pos+' edades[pos] ='+edades[pos]+' text '+texto_dictado[i]);
                }
              }
             if(texto_dictado[i]!="y" && isNaN(texto_dictado[i]) ){break;}//cuando encuentre dos espacios que representan el corte de cadena deja de concatenar a el numero de adultos
           }

           let tam_edades=edades.length;
           let invertida=[];
           for(var j=0;j<tam_edades;j++)
           {
             console.log(edades[j]+'tam='+edades[j].length);
             //invertir la cadena

             let x=(edades[j].length)-1;
             invertida[j]="";
             while (x>=0) {
               invertida[j]+=edades[j][x];
               x--;
             }
           }
           return invertida;
        }
        else
        {
          return edades;
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
            case "una":
              return 1;
            break;
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
