import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit {
  usuario = {
    idusuario: null,
    nome: '',
    email: '',
    telefone: null,
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  };

  constructor() {}

  ngOnInit(): void {}

  onSubmit(form: any) {
    console.log(form);
  }
}
