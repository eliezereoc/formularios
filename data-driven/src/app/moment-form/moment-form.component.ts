import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-moment-form',
  templateUrl: './moment-form.component.html',
  styleUrls: ['./moment-form.component.scss'],
})
export class MomentFormComponent implements OnInit {
  formulario: FormGroup | any;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      nome: [null, this.validarObrigatoriedade],
      email: [null, [Validators.required, Validators.email]],
    });
  }

  validarObrigatoriedade(input: FormControl) {
    // input.hasError('obrigatoriedade').qualquer
    // this.formulario.get('nome').hasError('obrigatoriedade').qualquer;
    // No HTML: formulario.get('nome').errors?.obrigatoriedade?.qualquer;
    // return (input.value ? null : { obrigatoriedade: { qualquer: true } });

    return input.value ? null : { obrigatoriedade: true };
  }

  submit() {
    console.log(this.formulario.value);
  }
}
