import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Producto } from '../../../app/modelo/producto.model';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  formulario!: FormGroup;
  producto: Producto = new Producto();
  productos!: any[];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
  ) { }

  ngOnInit(): void {
    this.iniciarFormulario();
    this.obtener();
  }

  iniciarFormulario() {
    this.formulario = this.fb.group({
      nombre: [this.producto.nombre],
      cantidad: [this.producto.cantidad],
      descripcion: [this.producto.descripcion],
      id: [this.producto.id],
    });
  }

  guardar() {
    console.log('object')

    if(this.producto.id) {
      this.actualizarProducto();
    } else {
      this.producto = {
        nombre: this.formulario.get('nombre')?.value,
        cantidad: this.formulario.get('cantidad')?.value,
        descripcion: this.formulario.get('descripcion')?.value,
      }
  
      this.productoService.guardarProducto(this.producto)
        .subscribe( respuesta => {
          console.log(respuesta);
          this.limpiarModelo();
          this.obtener();
          Swal.fire({
            title: 'Exito',
            text: 'Guardado!',
            icon: 'success',
            confirmButtonText: 'Cool'
          })
        }, error => {
          console.log(error);
          this.mostrarError();
        });
    }
  }

  obtener() {
    this.productoService.obtener()
      .subscribe( data => {
        console.log(data);
        this.productos = data;
      }, error => {
        console.log(error);
        this.mostrarError();
      });
  }

  mostrarError() {
    Swal.fire({
      title: 'Error!',
      text: 'Algo salio mal! Intentalo nuevamente',
      icon: 'error',
      confirmButtonText: 'Cool'
    })
  }

  modificar(product: any) {
    this.producto.id = product.id;
    this.producto.nombre = product.nombre;
    this.producto.cantidad = product.cantidad;
    this.producto.descripcion = product.descripcion;
    this.iniciarFormulario();
  }

  actualizarProducto() {
    this.producto = {
      nombre: this.formulario.get('nombre')?.value,
      cantidad: this.formulario.get('cantidad')?.value,
      descripcion: this.formulario.get('descripcion')?.value,
      id: this.formulario.get('id')?.value,
    };

    this.productoService.modificarProducto(this.producto)
      .subscribe( respuesta => {
        console.log(respuesta);
        this.obtener();
        Swal.fire({
          title: 'Actualizado',
          text: 'Producto modificado con exito!',
          icon: 'success',
          confirmButtonText: 'Cool'
        })
      }, error => {
        console.log(error);
        this.mostrarError();
      });
  }

  limpiarModelo() {
    this.producto = {
      nombre: '',
      cantidad: 0,
      descripcion: '',
      id: '',
    }
    this.iniciarFormulario();
  }

  eliminar(prod: any) {
    Swal.fire({
      title: "Eliminar",
      text: "Estas seguro que deseas eliminar el producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminarProducto(prod.id)
          .subscribe( respuesta =>{
            console.log(respuesta);
            this.obtener();
            Swal.fire({
              title: "Eliminado!",
              text: "Producto eliminado con exito",
              icon: "success"
            });
          });
      }
    });
  }
}
