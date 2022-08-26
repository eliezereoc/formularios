import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { distinctUntilChanged, EMPTY, switchMap, tap } from 'rxjs';
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

  frameworks = ['Angular', 'React', 'Vue', 'Sencha'];

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.montaFromulario();

    /*****************************************/
    // Mostra o valor de CEP de forma reativa
    /*****************************************/
    this.formulario
      .get('cep')
      .statusChanges.pipe(
        distinctUntilChanged(),
        tap((value: any) => console.log('Status CEP: ', value)),
        switchMap((status) =>
          status === 'VALID'
            ? this.formService.getCep(this.formulario.get('cep').value)
            : EMPTY
        )
      )
      .subscribe((endereco: any) =>
        endereco ? this.populaFormsEndereco(endereco) : {}
      );

    /*****************************************/
    // Mostra o valor de CEP de forma reativa
    /*****************************************/

    /*this.formulario
      .get('cep')
      .valueChanges.subscribe((value: any) =>
        console.log('valor CEP: ', value)
      );*/
  }

  consultaCEP(cep: any, formulario: any) {
    cep = cep.value.replace(/\D/g, '');

    console.log(cep);

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

  requiredMinCheckBox(min = 1) {}

  onSubmit() {
    // if (this.formulario.valid) {
    // console.log('Formulario valido!!!');
    // } else {
    // console.log('Formulario invalido!!!');
    /*Object.keys(this.formulario.controls).forEach((campo) => {
        console.log(campo);
        const controle = this.formulario.get(campo);
        controle.markAsDirty();
        // controle.markAsTouched();
      });*/
    // }
    let valueSubmit = Object.assign({}, this.formulario.value);
    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((valor: any, index: number) =>
          valor ? this.frameworks[index] : null
        )
        .filter((valor: any) => valor !== null),
    });
    console.log(valueSubmit);
    // console.log(this.formulario);
  }

  montaFromulario() {
    this.formulario = this.formBuilder.group({
      nome: [
        'João da Silva',
        [Validators.required, Validators.min(3), Validators.max(100)],
      ],
      email: [
        'joao@joao.com.br',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(250),
          Validators.minLength(5),
          Validators.pattern(/.+@.+\..+/),
        ],
      ],
      telefone: ['44999999999', Validators.required],

      logradouro: [null, Validators.required],
      numero: ['400', Validators.required],
      complemento: ['Casa', Validators.required],
      cep: [null, [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      bairro: [null, Validators.required],
      cidade: [null, Validators.required],
      estado: [null, Validators.required],
      frameworks: this.buildFrameworks(),
    });
  }

  buildFrameworks() {
    const values = this.frameworks.map((v) => new FormControl(false));
    return this.formBuilder.array(values);
  }
}
