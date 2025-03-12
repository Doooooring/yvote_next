import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`

  .common-scroll-style {
    &::-webkit-scrollbar {
      width: 6px;
      height: 8px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      transition: background 0.3s;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.5);
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }

* {
  margin: 0;
  padding: 0;
  border: 0;
  box-sizing : border-box;
  font-size: 100%;
  font-family: 'Noto Sans KR', Helvetica, sans-serif;
  vertical-align: baseline;
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}

html {
  scrollbar-width: none;
}

html::-webkit-scrollbar {
  @media (max-width: 480px) {
    display: none;
  }
}

body {
  line-height: 1.65em;
  font-weight: 300;
  width: 100vw;
  height: 100vh;
  background-color: rgb(239, 239, 239);

  overflow-x: hidden;
  overflow-y: scroll;
}



blockquote,
q {
  quotes: none;
}

body {
  -webkit-text-size-adjust: none;
}

mark {
  background-color: transparent;
  color: inherit;
}

input::-moz-focus-inner {
  border: 0;
  padding: 0;
}

h3 {
  font-size: 1.35em;
  line-height: 1.5em;
}

h4 {
  font-size: 1.25em;
  line-height: 1.5em;
}

h5 {
  font-size: 0.9em;
  line-height: 1.5em;
}

h6 {
  font-size: 0.7em;
  line-height: 1.5em;
}

a {
  text-decoration : none;
  color : black;
}


`;

export default GlobalStyle;
