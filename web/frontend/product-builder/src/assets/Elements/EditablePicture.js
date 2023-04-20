export default class EditablePicture extends HTMLElement {
  constructor() {
    super();
  }
}

console.log('here');

customElements.define('editable-picture', EditablePicture);