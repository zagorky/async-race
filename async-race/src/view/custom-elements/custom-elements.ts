// type CustomElementType = {
//   connectedCallback: () => void;
//   disconnectedCallback: () => void;
//   attributeChangedCallback: () => void;
//   adoptedCallback: () => void;
//   observedAttributes: () => string[];
// };
//
// class Car extends HTMLElement {
//   construstor() {
//     super();
//     this.attachShadow({ mode: 'closed' });
//   }
//
//   connectedCallback() {
//     this.render();
//   }
//
//   disconnectedCallback() {}
//
//   attributeChangedCallback({name: string, oldValue: string. newValue: string}): string[] {
//     return ['color', 'id', 'name'];
//   }
//
//   render(){
//     const color = this.getAttribute('color')
//     const id =  this.getAttribute('id')
//     const name = this.getAttribute('name')
//   }
//
//   adoptedCallback() {}
//
//   static get observedAttributes() {}
// }
console.log('');
