import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from './service/form.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
})
export class FormularioComponent implements OnInit {
  formulario: FormGroup | any;
  cepErro: string = '';
  agarda: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      nome: [
        null,
        [Validators.required, Validators.min(3), Validators.max(100)],
      ],
      email: [
        null,
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(250),
          Validators.minLength(5),
          Validators.pattern(/.+@.+\..+/),
        ],
      ],
      telefone: [null, Validators.required],

      logradouro: [null, Validators.required],
      numero: [null, Validators.required],
      complemento: [null, Validators.required],
      cep: [null, Validators.required],
      bairro: [null, Validators.required],
      cidade: [null, Validators.required],
      estado: [null, Validators.required],
    });
  }

  consultaCEP(cep: any, formulario: any) {
    cep = cep.value.replace(/\D/g, '');

    if (cep != '') {
      let validaCep = /^[0-9]{8}$/;

      if (validaCep.test(cep)) {
        if (this.cepErro) this.cepErro = '';

        this.agarda = true;

        this.resetFormEndereco();

        this.formService
          .getCep(cep)
          .subscribe((endereco) => this.populaFormsEndereco(endereco));

        this.agarda = false;
      } else {
        this.cepErro = 'Formato de CEP inválido.';
      }
    } else {
      this.cepErro = 'CEP é obrigatório!';
    }
  }

  populaFormsEndereco(endereco: any) {
    if (!('erro' in endereco)) {
      this.formulario.patchValue({
        logradouro: endereco.logradouro,
        // complemento: endereco.complemento,
        cep: endereco.cep,
        bairro: endereco.bairro,
        cidade: endereco.localidade,
        estado: endereco.uf,
      });
    } else {
      this.cepErro = 'CEP não encontrado.';
    }
  }

  resetFormEndereco() {
    this.formulario.patchValue({
      logradouro: '',
      // complemento: '',
      cep: '',
      bairro: '',
      cidade: '',
      estado: '',
    });
  }

  onSubmit() {
    if (this.formulario.valid) {
      console.log('Formulario valido!!!');
    } else {
      console.log('Formulario invalido!!!');
      /*Object.keys(this.formulario.controls).forEach((campo) => {
        console.log(campo);
        const controle = this.formulario.get(campo);
        controle.markAsDirty();
        // controle.markAsTouched();
      });*/
    }
    // console.log(this.formulario);
  }
}
