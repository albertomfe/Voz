      //variables globales
      var ano="";
      var mes="";
      var dia="";
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
            if(num_adultos!="" && num_adultos>0){
                  document.getElementById("c_adultos1").value=num_adultos;
            }
            //-----------------------------------------------MENORES-------------------------------------------------------------------------------
            num_menores=identificarOcupacion("menores","menor",texto_dictado);
            if(num_menores!="" && num_menores>0){
                  document.getElementById("c_menores1").value=num_menores;

                  //console.log('m='+num_menores);
                  if(num_menores>0 ){
                      crear_menores(1,num_menores);
                  }
            }
            //-----------------------------------------------Edades-------------------------------------------------------------------------------
            edades=identificarEdades(texto_dictado);
            //-----------------------------------------------Habitaciones-------------------------------------------------------------------------------
            num_habitaciones=identificarOcupacion("habitaciones","habitación",texto_dictado);
            if(num_habitaciones!="" && num_habitaciones>0){
                  document.getElementById("c_habitaciones").value=num_habitaciones;
                  //si se encuentra un numero definido
                  $("#div_habitaciones").empty();

                  for(let i=1;i<=num_habitaciones;i++)
                  {
                    $("#div_habitaciones").append(`
                      <div class='col-md-6' style='margin:0px; padding:0px;'>
                          <div class='form-group'>
                           <label for='adultos_0'>Adultos</label>
                           <input type='number' class='form-control' id='c_adultos`+i+`' placeholder='Adultos'>
                          </div>
                        </div>

                        <div class='col-md-6' style='margin:0px; padding:0px;'>
                          <div class='form-group'>
                           <label for='menores_0'>Menores</label>
                           <input type='number' class='form-control' id='c_menores`+i+`' placeholder='Menores'>
                          </div>
                        </div>

                        <div class='col-md-12' id='div_menores_`+i+`' style='margin:0px; padding:0px;'>

                        </div>
                    `);
                  }
            }
            //-----------------------------------------------Noches-------------------------------------------------------------------------------
            num_noches=identificarOcupacion("noches","noche",texto_dictado);
            if(num_noches!="" && num_noches>0){
              document.getElementById("c_noches").value=num_noches;
              calcular_noches();
            }
            //console.log(edades);
            //-----------------------------------------------FECHA DE VIAJE-------------------------------------------------------------------------------
            fecha_entrada=identificarFecha(texto_dictado);
            if(fecha_entrada!=""){
                document.getElementById("c_entrada").value=fecha_entrada;
                calcular_noches();
            }

            $('#capture').text("Hablar");
            $('#capture').val("true");
            $('#status').text("Inactivo");
            //console.log('Termine de Escuchar .......');
            //console.log('adultos='+num_adultos);
            //console.log('menores='+num_menores);

            let k=0;
            let campo=1;
            while(k<edades.length)
            {
              if ($('#c_'+(campo)+'_1').length) {
                    $('#c_'+(campo)+'_1').val(edades[k]);
              }
              //console.log('menor '+(campo)+'='+edades[k]+' Años');
              campo++;
              k++;
            }
            //console.log('noches='+num_noches);

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


        /*ancla*/
        //metodo de activacion por teclas
        function activar_microfono(event)
        {
          tecla = event.keyCode;
          if(tecla==77){
              speech.startCapture();//activar el Microfono
          }
          if(tecla==80){
              speech.stopCapture();//activar el Microfono
          }
        }
        window.onkeydown=activar_microfono;
        //--------------------------------->
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
          if(texto_dictado.indexOf("enero")!=-1)  {  comienzaEn=texto_dictado.indexOf("enero"); mes="01";  }
          else if(texto_dictado.indexOf("febrero")!=-1){  comienzaEn=texto_dictado.indexOf("febrero"); mes="02";}
          else if(texto_dictado.indexOf("marzo")!=-1){  comienzaEn=texto_dictado.indexOf("marzo"); mes="03"; }
          else if(texto_dictado.indexOf("abril")!=-1){  comienzaEn=texto_dictado.indexOf("abril"); mes="04"; }
          else if(texto_dictado.indexOf("mayo")!=-1){  comienzaEn=texto_dictado.indexOf("mayo"); mes="05"; }
          else if(texto_dictado.indexOf("junio")!=-1){  comienzaEn=texto_dictado.indexOf("junio"); mes="06"; }
          else if(texto_dictado.indexOf("julio")!=-1){  comienzaEn=texto_dictado.indexOf("julio"); mes="07"; }
          else if(texto_dictado.indexOf("agosto")!=-1){  comienzaEn=texto_dictado.indexOf("agosto"); mes="08"; }
          else if(texto_dictado.indexOf("septiembre")!=-1){  comienzaEn=texto_dictado.indexOf("septiembre"); mes="09"; }
          else if(texto_dictado.indexOf("octubre")!=-1){  comienzaEn=texto_dictado.indexOf("octubre"); mes="10"; }
          else if(texto_dictado.indexOf("noviembre")!=-1){  comienzaEn=texto_dictado.indexOf("noviembre"); mes="11";}
          else if(texto_dictado.indexOf("diciembre")!=-1){  comienzaEn=texto_dictado.indexOf("diciembre"); mes="12"; }
          else{ comienzaEn=-1; }//no coincidencias


          if(comienzaEn!=-1)
          {
                //console.log('fecha comienza en  '+comienzaEn);
                ano = (new Date).getFullYear();
                espacios=0;
                dia="";
                //console.log(mes);
                for(var i=(comienzaEn-1);i>=0;i--)
                {
                   if(texto_dictado[i]==" "){ espacios++;  }
                   else
                   {
                     if(texto_dictado[i]!="de" && !isNaN(texto_dictado[i]) )
                     {
                       dia+=texto_dictado[i];
                     }
                   }
                }
                //reccorrer
                if(dia!="")
                {
                  //console.log('dia='+dia);
                  var x=dia.length;
                  cadenaInvertida="";
                  while (x>=0) {
                    cadenaInvertida +=dia.charAt(x);
                    x--;
                  }
                  cadenaInvertida=identificarCantidadNumerica(cadenaInvertida);//convertir el texto a Numero
                  if(parseInt(cadenaInvertida)<=9){
                    cadenaInvertida="0"+cadenaInvertida;
                  }
                  //let fecha_inicio=''+cadenaInvertida+'-'+mes+'-'+ano;
                  let fecha_inicio=''+ano+'-'+mes+'-'+cadenaInvertida;
                  //console.log(''+cadenaInvertida+'-'+mes+'-'+ano);
                  return fecha_inicio;
                }
          }
          else{
            return "";
          }


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
                  //console.log('pos= '+pos+' edades[pos] ='+edades[pos]+' text '+texto_dictado[i]);
                }
              }
             if(texto_dictado[i]!="y" && isNaN(texto_dictado[i]) ){break;}//cuando encuentre dos espacios que representan el corte de cadena deja de concatenar a el numero de adultos
           }

           let tam_edades=edades.length;
           let invertida=[];
           for(var j=0;j<tam_edades;j++)
           {
             //console.log(edades[j]+'tam='+edades[j].length);
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



      function calcular_noches()
    	{

    				var fecha_actual_date = new Date();
    				var fecha_actual=fecha_actual_date.getDate() + "/" + (fecha_actual_date.getMonth() +1) + "/" + fecha_actual_date.getFullYear();

    				var noches=$('#c_noches').val();
    				var fecha1=$('#c_entrada').val();
    				//console.log(noches+' '+fecha1);

            //fecha de inicio y noches deben estar presentes
						if(fecha1!="" && noches !="")
						{
							//partir las fechas
							var aux_dia=0; var aux_mes=0; var aux_ano=0;
							aux_ano=fecha1.charAt(0)+fecha1.charAt(1)+fecha1.charAt(2)+fecha1.charAt(3);
							aux_mes=fecha1.charAt(5)+fecha1.charAt(6);
							aux_dia=fecha1.charAt(8)+fecha1.charAt(9);

							var ultimodia  = new Date(aux_ano, aux_mes, 0);
							var total_dias_mes = ultimodia.toString();
							var total_dias_mes_convertido=total_dias_mes.charAt(8)+total_dias_mes.charAt(9);

							if(parseInt(aux_dia)+parseInt(noches)>total_dias_mes_convertido)
							{
								aux_dia=((parseInt(aux_dia))+(parseInt(noches)))-parseInt(total_dias_mes_convertido);
								aux_mes=parseInt(aux_mes)+parseInt(1);

								if(aux_mes>12) { aux_mes=1; aux_ano=parseInt(aux_ano)+parseInt(1); }
								if(aux_dia<=9){aux_dia="0"+aux_dia;}
								if(aux_mes<=9){aux_mes="0"+aux_mes;}
							}
							else{aux_dia=parseInt(aux_dia)+parseInt(noches);}


							aux_dia=parseInt(aux_dia);
							if(aux_dia<10){aux_dia="0"+aux_dia;}
							//console.log(aux_ano+"-"+aux_mes+"-"+aux_dia);
							$("#c_salida").val(aux_ano+"-"+aux_mes+"-"+aux_dia);
							tope_maximo=aux_ano+"-"+aux_mes+"-"+aux_dia;
							//Modificadores Input Date attributos modificados
							//modificadores();
						}
    				else
    				{
    					$("#c_salida").val('');
    				}
    	}


      function crear_menores(habitaciones=1,menores=0)
      {

        for(let i=1;i<=habitaciones;i++)
        {
          console.log('hab='+habitaciones+' menores='+menores);
          $("#div_menores_"+i).empty();
          for(let j=1;j<=menores;j++)
          {
            $("#div_menores_"+i).append(`
                <div class='col-md-3' style='margin:0px; padding:0px;'>
                  <input type='number' class='form-control' id='c_`+j+`_`+i+`' name='c_`+j+`_`+i+`' placeholder='0' >
                </div>
            `);
          }//menores
        }//habitaciones
      }
