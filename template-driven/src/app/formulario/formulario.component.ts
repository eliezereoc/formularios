import { Component, OnInit } from '@angular/core';
import { FormService } from './service/form.service';
import { Cep } from './model/cep';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit {
  cepErro: string = '';
  agarda: boolean = false;

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
    cep: '',
  };

  constructor(private formService: FormService) {}

  ngOnInit(): void {}

  onSubmit(form: any) {
    console.log(form.value);
  }

  consultaCEP(cep: any, formUser: any) {
    cep = cep.value.replace(/\D/g, '');

    if (cep != '') {
      let validaCep = /^[0-9]{8}$/;
      if (validaCep.test(cep)) {
        if (this.cepErro) this.cepErro = '';

        this.agarda = true;

        this.resetFormEndereco(formUser);

        this.formService
          .getCep(cep)
          .subscribe((endereco) =>
            this.populaFormsEndereco(endereco, formUser)
          );

        this.agarda = false;
      } else {
        this.cepErro = 'Formato de CEP inválido.';
      }
    } else {
      this.cepErro = 'CEP é obrigatório!';
    }
  }

  populaFormsEndereco(endereco: any, formUser: any) {
    if (!('erro' in endereco)) {
      formUser.form.patchValue({
        endereco: {
          logradouro: endereco.logradouro,
          // complemento: endereco.complemento,
          cep: endereco.cep,
          bairro: endereco.bairro,
          cidade: endereco.localidade,
          estado: endereco.uf,
        },
      });
    } else {
      this.cepErro = 'CEP não encontrado.';
    }

    // formUser.setValue({
    //   nome: '',
    //   email: '',
    //   telefone: null,
    //   endereco: {
    //     logradouro: endereco.logradouro,
    //     numero: '',
    //     complemento: endereco.complemento,
    //     cep: endereco.cep,
    //     bairro: endereco.bairro,
    //     cidade: endereco.localidade,
    //     estado: endereco.uf,
    //   },
    // });
  }

  resetFormEndereco(formUser: any) {
    formUser.form.patchValue({
      endereco: {
        logradouro: '',
        // complemento: '',
        cep: '',
        bairro: '',
        cidade: '',
        estado: '',
      },
    });
  }
}
