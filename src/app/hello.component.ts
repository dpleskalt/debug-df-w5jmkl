import { Component, Input } from '@angular/core';

@Component({
  selector: 'hello',
  template: `<h1>{{name}} live demo</h1>`,
  styles: [
    `h1 { font-family: sans-serif; margin-left: 1rem; font-variant: small-caps}`,
  ],
})
export class HelloComponent {
  @Input() name: string;
}
