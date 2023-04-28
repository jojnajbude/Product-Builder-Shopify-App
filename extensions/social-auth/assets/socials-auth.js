class SocialAuth extends HTMLElement {
  static content = {
    google: {
      icon: `
        <svg width="19" height="19" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_805_16757)">
          <path d="M9.53906 8.76538V12.4603H14.6738C14.4483 13.6486 13.7717 14.6547 12.7569 15.3313L15.8533 17.7338C17.6574 16.0686 18.6982 13.6226 18.6982 10.717C18.6982 10.0405 18.6375 9.38992 18.5248 8.76548L9.53906 8.76538Z" fill="#4285F4"/>
          <path d="M4.19379 12.3162L3.49543 12.8508L1.02344 14.7762C2.59334 17.89 5.81098 20.0411 9.54056 20.0411C12.1165 20.0411 14.2762 19.1911 15.8548 17.7339L12.7584 15.3314C11.9084 15.9038 10.8242 16.2508 9.54056 16.2508C7.05995 16.2508 4.95234 14.5768 4.19769 12.3217L4.19379 12.3162Z" fill="#34A853"/>
          <path d="M1.0234 6.22412C0.372922 7.50775 0 8.95625 0 10.5001C0 12.044 0.372922 13.4925 1.0234 14.7761C1.0234 14.7847 4.19796 12.3128 4.19796 12.3128C4.00715 11.7404 3.89436 11.1333 3.89436 10.5C3.89436 9.86676 4.00715 9.25965 4.19796 8.6872L1.0234 6.22412Z" fill="#FBBC05"/>
          <path d="M9.54076 4.75823C10.9459 4.75823 12.1949 5.24393 13.1923 6.18068L15.9244 3.44856C14.2678 1.9047 12.1168 0.959229 9.54076 0.959229C5.81117 0.959229 2.59334 3.10158 1.02344 6.22406L4.1979 8.68734C4.95245 6.4322 7.06014 4.75823 9.54076 4.75823Z" fill="#EA4335"/>
          </g>
          <defs>
          <clipPath id="clip0_805_16757">
          <rect width="18.7" height="19.0816" fill="white" transform="translate(0 0.959229)"/>
          </clipPath>
          </defs>
        </svg>
      `,
      textLogin: 'Log in with Google',
      textSign: 'Sign up with Google'
    },
    facebook: {
      icon: `
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_805_16765)">
          <path d="M18.7333 9.55722C18.7333 4.35253 14.5397 0.133301 9.36667 0.133301C4.1936 0.133301 0 4.35253 0 9.55722C0 14.2609 3.42524 18.1597 7.90313 18.8666V12.2813H5.52487V9.55722H7.90313V7.48101C7.90313 5.11914 9.30155 3.81452 11.4411 3.81452C12.4655 3.81452 13.5378 3.99858 13.5378 3.99858V6.31775H12.3567C11.1932 6.31775 10.8302 7.04423 10.8302 7.79023V9.55722H13.428L13.0127 12.2813H10.8302V18.8666C15.3081 18.1597 18.7333 14.2609 18.7333 9.55722Z" fill="white"/>
          </g>
          <defs>
          <clipPath id="clip0_805_16765">
          <rect width="18.7333" height="18.7333" fill="white" transform="translate(0 0.133301)"/>
          </clipPath>
          </defs>
        </svg>
      `,
      textLogin: 'Log in with Facebook',
      textSign: 'Sign up with Facebook'
    }
  }

  static cliendId = '29293067184-soculp7hd0h4o21a9hp3iju3rhivngoi.apps.googleusercontent.com';
  static redirectUrl = 'https://product-builder.dev-test.pro/api/googleOAth';

  static getUserLogin = 'https://product-builder.dev-test.pro/api/social/login';
  static getUserRegister = 'https://product-builder.dev-test.pro/api/social/register';

  constructor() {
    super();

    const params = new URLSearchParams(location.search);

    this.code = params.get('code');
    this.action = params.get('action');
  }
  
  connectedCallback() {
    this.form = this.nextElementSibling;

    this.classList.add('social-auth');

    const googleScrpits = document.createElement('script');

    googleScrpits.onload = this.onScriptLoad.bind(this);

    googleScrpits.src = "https://accounts.google.com/gsi/client";
    this.appendChild(googleScrpits);
  }

  async onScriptLoad() {
    this.initShadowDom();

    this.initGoogleButton();
    this.initMetaButton();
    this.initOrUsingText();

    if (this.code && this.action) {
      switch(this.action) {
        case 'register':
          this.registerUser();
          break;
        case 'login':
          this.loginUser();
          break;
      }
    } else if (this.code && !this.action) {
      console.log('no action provided');
    }
  }

  async loginUser() {
    const response = await fetch(SocialAuth.getUserLogin, {
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: this.code,
        shop: Shopify.shop
      })
    });

      const userData = await response.json();

      if (response.status === 200) {
        const { email, password } = userData;

        const inputEmail = this.form.querySelector('input[name="customer[email]"]');
        const inputPassword = this.form.querySelector('input[name="customer[password]"]');

        inputEmail.value = email;
        inputPassword.value = password;

        console.log(email, password);

        console.log(this.form);

        document.querySelector('form[action="/account/login"').submit();
      } else {
        this.ErrorUser();
      }

      this.initLoader();
  }

  async registerUser() {
    const response = await fetch(SocialAuth.getUserRegister, {
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: this.code,
        shop: Shopify.shop
      })
    });

    const userData = await response.json();

    if (response.status === 200) {
      const { email, password, name, lastName } = userData;


      const inputEmail = this.form.querySelector('input[name="customer[email]"]');
      const inputPassword = this.form.querySelector('input[name="customer[password]"]');

      inputEmail.value = email;
      inputPassword.value = password;

      const inputName = this.form.querySelector('input[name="customer[first_name]"]');
      const inputLastName = this.form.querySelector('input[name="customer[last_name]"]');

      if (inputName && inputLastName) {
        inputName.value = name;
        inputLastName.value = lastName;
      }

      console.log(email, password, name, lastName);

      document.querySelector('form[action="/account"]').submit();
    } else {
      this.ErrorUser();
    }

    this.initLoader();
  }

  initShadowDom() {
    this.shadow = this.attachShadow({ mode: 'open'});
    this.container = document.createElement('div');
    this.container.classList.add('social-auth__container');

    this.shadow.appendChild(this.container);
    this.initStyle();
  }

  ErrorUser() {
    this.destroyLoader();

    const error = document.createElement('div');
    error.textContent = 'Error!';

    this.container.append(error)
  }

  destroyLoader() {
    if (this.loader) {
      this.loader.remove();
    }
  }

  initStyle() {
    const style = document.createElement('style');

    style.innerHTML = `
      social-authorization {
        display: block;
      }
      
      .social-auth__container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        font-family: "DM Sans", sans-serif;
        color: #888;
        font-size: 14px;
        line-height: 17px;
      }
      
      .social-auth .or-text {
        padding: 10px;
      }

      .button {
        position: relative;
        width: 100%;
        padding: 12px 24px;
        display: flex;
        align-items: center;
        background-color: #fff;
        border-radius: 50px;
        outline: none;
        border: 0;
        font-family: "DM Sans", sans-serif;
        font-weight: 700;
        font-size: 16px;
        line-height: 21px;
      }

      .button:hover {
        cursor: pointer;
      }

      .button::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
        border-radius: 50px;
        transition: background-color .3s;
      }

      .button:hover::before {
        background-color: rgba(0,0,0,0.05);
      }

      .button.button--google {
        border: 1px solid #CACACA;
        color: #000;
      }

      .button.button--facebook {
        background-color: #4674DC;
        border: 1px solid #4674DC;
        color: #fff;
      }

      .button svg {
        flex-shrink: 0;
      }

      .button span {
        flex-grow: 1;
      }

      .loader {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(0,0,0,0.25);
        z-index: 50;
      }
    `;

    this.container.appendChild(style);
  }

  initLoader() {
    const loader = document.createElement('div');
    loader.classList.add('loader');

    this.loader = loader;

    this.container.appendChild(loader);
  }

  initGoogleButton() {
    const button = document.createElement('button');
    button.classList.add('button', 'button--google');

    const icon = SocialAuth.content.google.icon;
    button.innerHTML += icon;
  
    const text = document.createElement('span');
    text.textContent = this.form.getAttribute('action').includes('login')
      ? SocialAuth.content.google.textLogin
      : SocialAuth.content.google.textSign;
    button.appendChild(text);

    button.addEventListener('click', this.googleAuthBegin.bind(this));

    this.googleClient = google.accounts.oauth2.initCodeClient({
      client_id: SocialAuth.cliendId,
      redirect_uri: SocialAuth.redirectUrl,
      ux_mode: 'redirect',
      scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.profile openid',
      state: JSON.stringify({
        redirect: location.href,
        shop: location.hostname,
        action: (this.form.getAttribute('action').includes('login')
          ? 'login'
          : 'register')
      })
    });

    this.container.appendChild(button);
  }

  googleAuthBegin() {
    this.googleClient.requestCode();
  }

  initMetaButton() {
    const button = document.createElement('button');
    button.classList.add('button', 'button--facebook');

    const icon = SocialAuth.content.facebook.icon;
    button.innerHTML += icon;

    const text = document.createElement('span');
    text.textContent = this.form.getAttribute('action').includes('login')
    ? SocialAuth.content.facebook.textLogin
    : SocialAuth.content.facebook.textSign;
    button.appendChild(text);

    this.container.appendChild(button);
  }

  initOrUsingText() {
    const orText = document.createElement('span');
    orText.classList.add('or-text');
    orText.textContent = 'or using'

    this.container.appendChild(orText);
  }
}
customElements.define('social-authorization', SocialAuth);

const formLogin = document.querySelector('form[action*="login"]');
const formRegister = document.querySelector('form[action="/account"]');
const socialAuth = document.createElement('social-authorization');

if (formLogin) {
  formLogin.parentElement.insertBefore(socialAuth, formLogin);
}

if (formRegister) {
  formRegister.parentElement.insertBefore(socialAuth, formRegister);
}