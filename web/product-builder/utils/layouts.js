const layouts = {
  whole: {
    id: 'whole',
    icon: `
      <svg width="45" height="23" viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_806_20391)">
          <rect x="1" y="1" width="43" height="21" fill="#DDDDDD"/>
          <rect x="2.5" y="2.5" width="40" height="18" stroke="white" stroke-width="3"/>
        </g>
        <defs>
          <filter id="filter0_d_806_20391" x="0" y="0" width="45" height="23" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_806_20391"/>
            <feOffset/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_806_20391"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_806_20391" result="shape"/>
          </filter>
        </defs>
      </svg>
      `,
    types: ['photobook-page'],
    blocks: ['editable-picture']
  },
  wholeFrameless: {
    id: 'wholeFrameless',
    icon: `
      <svg width="45" height="23" viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_806_20393)">
          <rect x="1" y="1" width="43" height="21" fill="#DDDDDD"/>
        </g>
        <defs>
          <filter id="filter0_d_806_20393" x="0" y="0" width="45" height="23" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_806_20393"/>
            <feOffset/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_806_20393"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_806_20393" result="shape"/>
          </filter>
        </defs>
      </svg>
      `,
    types: ['photobook-page'],
    blocks: ['editable-picture']
  },
  rightImageWithText: {
    id: 'rightImageWithText',
    icon: `
      <svg width="45" height="23" viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_806_20395)">
          <rect x="44" y="22" width="43" height="21" transform="rotate(-180 44 22)" fill="white"/>
        </g>
        <rect x="44" y="22" width="21" height="21" transform="rotate(-180 44 22)" fill="#D9D9D9"/>
        <rect x="17" y="14" width="9" height="1" rx="0.5" transform="rotate(-180 17 14)" fill="#FF8714"/>
        <rect x="15" y="12" width="5" height="1" rx="0.5" transform="rotate(-180 15 12)" fill="#FF8714"/>
        <rect x="17" y="10" width="9" height="1" rx="0.5" transform="rotate(-180 17 10)" fill="#FF8714"/>
        <defs>
          <filter id="filter0_d_806_20395" x="0" y="0" width="45" height="23" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_806_20395"/>
            <feOffset/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_806_20395"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_806_20395" result="shape"/>
          </filter>
        </defs>
      </svg>
      `,
    types: ['photobook-page'],
    blocks: ['text', 'editable-picture']
  },
  leftImageWithText: {
    id: 'leftImageWithText',
    icon: `
      <svg width="45" height="23" viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_806_20403)">
          <rect x="1" y="1" width="43" height="21" fill="white"/>
        </g>
        <rect x="1" y="1" width="21" height="21" fill="#D9D9D9"/>
        <rect x="28" y="9" width="9" height="1" rx="0.5" fill="#FF8714"/>
        <rect x="30" y="11" width="5" height="1" rx="0.5" fill="#FF8714"/>
        <rect x="28" y="13" width="9" height="1" rx="0.5" fill="#FF8714"/>
        <defs>
          <filter id="filter0_d_806_20403" x="0" y="0" width="45" height="23" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_806_20403"/>
          <feOffset/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_806_20403"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_806_20403" result="shape"/>
          </filter>
        </defs>
      </svg>
      `,
    types: ['photobook-page'],
    blocks: ['editable-picture', 'text']
  },
  bigWithThreeSquare: {
    id: 'bigWithThreeSquare',
    icon: `
      <svg width="45" height="23" viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_806_20516)">
          <rect x="1" y="1" width="43" height="21" fill="white"/>
        </g>
        <rect x="3" y="3" width="33" height="17" fill="#D9D9D9"/>
        <rect x="37" y="3" width="5" height="5" fill="#D9D9D9"/>
        <rect x="37" y="9" width="5" height="5" fill="#D9D9D9"/>
        <rect x="37" y="15" width="5" height="5" fill="#D9D9D9"/>
        <defs>
          <filter id="filter0_d_806_20516" x="0" y="0" width="45" height="23" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_806_20516"/>
          <feOffset/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_806_20516"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_806_20516" result="shape"/>
          </filter>
        </defs>
      </svg>
    `,
    types: ['photobook-page'],
    blocks: ['editable-picture','editable-picture','editable-picture','editable-picture']
  },
  twoRectangleImagesWithText: {
    id: 'twoRectangleImagesWithText',
    icon: `
      <svg width="45" height="23" viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_806_20443)">
          <rect x="44" y="22" width="43" height="21" transform="rotate(-180 44 22)" fill="white"/>
        </g>
        <rect x="20" y="5" width="11" height="16" transform="rotate(90 20 5)" fill="#D9D9D9"/>
        <rect x="41" y="5" width="11" height="16" transform="rotate(90 41 5)" fill="#D9D9D9"/>
        <rect x="17" y="19" width="10" height="1" rx="0.5" transform="rotate(-180 17 19)" fill="#FF8714"/>
        <rect x="38" y="19" width="10" height="1" rx="0.5" transform="rotate(-180 38 19)" fill="#FF8714"/>
        <defs>
          <filter id="filter0_d_806_20443" x="0" y="0" width="45" height="23" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_806_20443"/>
          <feOffset/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_806_20443"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_806_20443" result="shape"/>
          </filter>
        </defs>
      </svg>
    `,
    types: ['photobook-page'],
    blocks: ['editable-picture', 'text', 'editable-picture', 'text']
  },
  wholeTextCover: {
    id: 'wholeTextCover',
    icon: `
    <svg width="29" height="34" viewBox="0 0 29 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_0_1)">
      <path d="M0 0H29V17V34H0V0Z" fill="white"/>
      <path d="M0.5 0.5H28.5V17V33.5H0.5V0.5Z" stroke="#D9D9D9"/>
      </g>
      <rect x="6" y="23" width="19" height="18" transform="rotate(-90 6 23)" fill="#D9D9D9"/>
      <rect x="8.28516" y="27.2002" width="13.1672" height="1.36" rx="0.68" fill="#FF8714"/>
      <defs>
      <filter id="filter0_d_0_1" x="0" y="0" width="29" height="34" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape"/>
      </filter>
      </defs>
    </svg>
      `,
    types: ['photobook-cover'],
    blocks: ['editable-picture', 'text']
  },
  wholeFramelessCover: {
    id: 'wholeFramelessCover',
    icon: `
    <svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_0_1)">
      <path d="M0 0H28V17V34H0V0Z" fill="white"/>
      <path d="M0.5 0.5H27.5V17V33.5H0.5V0.5Z" stroke="#D9D9D9"/>
      </g>
      <rect y="34" width="34" height="28" transform="rotate(-90 0 34)" fill="#D9D9D9"/>
      <defs>
      <filter id="filter0_d_0_1" x="0" y="0" width="28" height="34" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape"/>
      </filter>
      </defs>
    </svg>
    `,
    types: ['photobook-cover'],
    blocks: ['editable-picture']
  },
  wholeUpWithTextCover: {
    id: 'wholeUpWithTextCover',
    icon: `
    <svg width="29" height="34" viewBox="0 0 29 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_0_1)">
      <path d="M0 0H29V17V34H0V0Z" fill="white"/>
      <path d="M0.5 0.5H28.5V17V33.5H0.5V0.5Z" stroke="#D9D9D9"/>
      </g>
      <rect y="23" width="23" height="29" transform="rotate(-90 0 23)" fill="#D9D9D9"/>
      <rect x="8.28516" y="27.2002" width="13.1672" height="1.36" rx="0.68" fill="#FF8714"/>
      <defs>
      <filter id="filter0_d_0_1" x="0" y="0" width="29" height="34" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape"/>
      </filter>
      </defs>
    </svg>
    `,
    types: ['photobook-cover'],
    blocks: ['editable-picture', 'line']
  },
  wholeDownWithTextCover: {
    id: 'wholeUpwholeDownWithTextCoverWithTextCover',
    icon: `
    <svg width="29" height="34" viewBox="0 0 29 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_0_1)">
      <path d="M0 0H29V17V34H0V0Z" fill="white"/>
      <path d="M0.5 0.5H28.5V17V33.5H0.5V0.5Z" stroke="#D9D9D9"/>
      </g>
      <rect x="1" y="33" width="22" height="27" transform="rotate(-90 1 33)" fill="#D9D9D9"/>
      <rect x="8.28516" y="5.44043" width="13.1672" height="1.36" rx="0.68" fill="#FF8714"/>
      <defs>
      <filter id="filter0_d_0_1" x="0" y="0" width="29" height="34" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape"/>
      </filter>
      </defs>
    </svg>
    `,
    types: ['photobook-cover'],
    blocks: ['line', 'editable-picture']
  },
  squareTile: {
    id: 'squareTile',
    icon: `
      <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="33" height="33" fill="#DDDDDD" fill-opacity="0.866667" stroke="#BFBFBF"/>
        <rect x="5" y="5" width="25" height="25" rx="1" fill="white"/>
      </svg>
    `,
    types: ['tiles'],
    blocks: ['editable-picture'],
    mask: `
      <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M160 0H0V160H160V0ZM19 14C16.2383 14 14 16.2383 14 19V141C14 143.762 16.2383 146 19 146H141C143.762 146 146 143.762 146 141V19C146 16.2383 143.762 14 141 14H19Z" fill="white"/>
      </svg>
    `
  },
  squareFramelessTile: {
    id: 'squareFramelessTile',
    icon: `
      <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="33" height="33" fill="#DDDDDD" fill-opacity="0.866667" stroke="#BFBFBF"/>
      </svg>    
    `,
    types: ['tiles'],
    blocks: ['editable-picture']
  },
  roundTile: {
    id: 'roundTile',
    icon: `
      <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="33" height="33" fill="#DDDDDD" fill-opacity="0.866667" stroke="#BFBFBF"/>
        <rect x="5" y="5" width="25" height="25" rx="12.5" fill="white"/>
      </svg>    
    `,
    types: ['tiles'],
    blocks: ['editable-picture'],
    mask: `
      <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M160 0H0V160H160V0ZM80 14C43.5508 14 14 43.5488 14 80C14 116.451 43.5508 146 80 146C116.449 146 146 116.451 146 80C146 43.5488 116.449 14 80 14Z" fill="white"/>
      </svg>
    `
  },
}

export default layouts;