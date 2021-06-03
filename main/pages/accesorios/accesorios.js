if(window.location.pathname == ruta+'accesorios/accesorios.php'){

  
    /* DEFINICION VARIABLES */
    var fila;
    var $tipos_accesorio = document.querySelector('#tipo');
    var $tipo_en_modal_edicion = document.querySelector('#modal_edicion_id_tipo');
    var tabla_accesorios = $('#tabla_accesorios').DataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json"
        },
        pageLength : 5,
        lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Mostrar todo']],
        "columnDefs": [
            {
                "targets": [ 5 ],
                "visible": false,
                "searchable": true
            }
        ]
    });
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

      
    /* LLAMADO FUNCIONES */
    get_accesorios();
    get_tipos_accesorio();


    /* LANZADORES JQUERY */
    $("#form_modal_edicion_accesorio").on("hidden.bs.modal", function () {
        $('#form_modal_edicion_accesorio').trigger('reset');
    });

    $('#form_nuevo_accesorio').submit(function (e) { 
        e.preventDefault();
        data = $('#form_nuevo_accesorio').serialize();
        
        $.ajax({
            url: "../../functions/php/accesorios/nuevo_accesorio.php",
            type: "POST",
            data: data
        })
        .done(function (res) {
          var accesorio = JSON.parse(res);
          $('#indicador_de_que_no_hay_nada').attr('hidden', 'hidden');
          $('#contenedor_tabla_accesorios').removeAttr('hidden');
          row_add(tabla_accesorios, accesorio[0]);
             $('#form_nuevo_accesorio').trigger("reset");
             Toast.fire({
                icon: 'success',
                title: 'Nuevo accesorio almacenado en el inventario'
            })
        })
        .fail(function (e) {
          console.log(e);
        });
        
    });

    $('#form_modal_edicion_accesorio').submit(function (e) { 
        e.preventDefault();
        var data = $('#form_modal_edicion_accesorio').serialize();
        $.ajax({
            url: "../../functions/php/accesorios/actualizar_accesorio.php",
            type: "POST",
            data: data
        })
        .done(function (res) {
            let accesorio = JSON.parse(res);
            var id = (tabla_accesorios.row( fila ).index());
            fila.find("td:eq(1)").text(accesorio[0].nombre);
            fila.find("td:eq(2)").text(accesorio[0].tipo);
            fila.find("td:eq(3)").text(accesorio[0].precio);
            fila.find("td:eq(4)").text(accesorio[0].edicion);
            tabla_accesorios.cell( id, 5 ).data(accesorio[0].id_tipo);
            $('#modal_edicion_accesorio').modal('hide');
            Toast.fire({
                icon: 'success',
                title: 'Accesorio editado'
            })
        })
        .fail(function (e) {
          console.log(e);
        });
    });

    $(document).on("click", ".btn_editar_accesorio", function () {
        fila = $(this).closest("tr");
        id = parseInt(fila.find("td:eq(0)").text());
        nombre = fila.find("td:eq(1)").text();
        precio = fila.find("td:eq(3)").text();
        fk_id_tipo = tabla_accesorios.row($(this).parents('tr')).data()["5"];

        $('#modal_edicion_accesorio_id').val(id);
        $('#modal_edicion_accesorio_nombre').val(nombre);
        $('#modal_edicion_accesorio_precio').val(precio);
        $('#modal_edicion_id_tipo').trigger('change');
        $('#modal_edicion_id_tipo').val(fk_id_tipo);

        $('#modal_edicion_accesorio').modal('show');
    });

    $(document).on("click", ".btn_quitar_accesorio", function () {
        fila = $(this).closest("tr");        
        id = parseInt(fila.find("td:eq(0)").text());

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-danger',
              cancelButton: 'btn btn-success'
            },
            buttonsStyling: true
          })
          
          swalWithBootstrapButtons.fire({
            title: 'Esta segura/o de eliminar este accesorio?',
            text: "Se borrará todo su registro.",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Voler',
            confirmButtonText: 'Eliminar',
            reverseButtons: false
          }).then((result) => {
            if (result.isConfirmed) {
              $.ajax({
                url: "../../functions/php/accesorios/eliminar_accesorio.php",
                type: "POST",
                dataType: "JSON",
                data: { id },
                  }).done(function (res) {  
                  Toast.fire({
                    icon: 'success',
                    title: 'El accesorio fue removido del inventario'
                  });
                  $('#tabla_accesorios').dataTable().fnDeleteRow(fila);
                }).fail(function (e) {
                  console.log(e);
                }); 
            } else if (
              result.dismiss === Swal.DismissReason.cancel
            ) { }
          })
    });


    /* DEFINICION DE FUNCIONES */
    function get_tipos_accesorio(){
        $.ajax({
            url: "../../functions/php/accesorios/get_tipos_accesorio.php",
            type: "GET",
          })
            .done(function (res) {
              if (res) {
                 var template = '';
                    var array = JSON.parse(res);
                    template += `<option class="form-control" selected disabled value=''>Tipo del accesorio?</option>`;
                    array.forEach(OBJ => {
                        template += `<option class="form-control" value="${OBJ.id}">${OBJ.tipo}</option>`;
                    });
                    $tipos_accesorio.innerHTML = template;
                    $tipo_en_modal_edicion.innerHTML = template;
              }
            })
            .fail(function () {
              console.log('Err');
            });
    }

    function get_accesorios(){
        $.ajax({
            url: "../../functions/php/accesorios/get_accesorios.php",
            type: "GET"
        })
        .done(function (res) {
          var array = JSON.parse(res);
          if(array.length == 0){
            $('#indicador_de_que_no_hay_nada').removeAttr('hidden');
          }else{
            $('#contenedor_tabla_accesorios').removeAttr('hidden');
          }
          array.forEach((accesorio) => {
            row_add(tabla_accesorios, accesorio);
          })
        })
        .fail(function () {
          console.log('Err'); 
        });
    }

    function row_add(tabla, objeto){
      tabla.row.add([
        objeto.id,
        objeto.nombre,
        objeto.tipo,
        objeto.precio,
        objeto.edicion,
        objeto.id_tipo,
        "<div class='text-center'><div id='bt-group'><a style='color: orange' class='btn_editar_accesorio'><i class='bi bi-pen'></i></a></div></div>",
        "<div class='text-center'><div id='bt-group'><a style='color: red' class='btn_quitar_accesorio'><i class='bi bi-trash2'></i></a></div></div>",
      ]).draw();
    }

  }


