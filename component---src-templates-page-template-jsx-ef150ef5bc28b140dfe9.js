webpackJsonp([0xa485d5bf544],{228:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0;var u=n(1),i=r(u),c=n(23),f=r(c);n(453);var s=function(e){function t(){return a(this,t),o(this,e.apply(this,arguments))}return l(t,e),t.prototype.render=function(){var e=this.props.page;return i.default.createElement("div",null,i.default.createElement(f.default,{siteMetadata:this.props.siteMetadata}),i.default.createElement("div",{className:"content"},i.default.createElement("div",{className:"content__inner"},i.default.createElement("div",{className:"page"},i.default.createElement("h1",{className:"page__title"},e.frontmatter.title),i.default.createElement("div",{className:"page__body",dangerouslySetInnerHTML:{__html:e.html}})))))},t}(i.default.Component);t.default=s,e.exports=t.default},453:function(e,t){},237:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}t.__esModule=!0,t.pageQuery=void 0;var u=n(1),i=r(u),c=n(22),f=r(c),s=n(228),p=r(s),d=function(e){function t(){return a(this,t),o(this,e.apply(this,arguments))}return l(t,e),t.prototype.render=function(){var e=this.props.data.site.siteMetadata,t=e.title,n=e.subtitle,r=this.props.data.markdownRemark,a=r.frontmatter,o=a.title,l=a.description,u=null!==l?l:n;return i.default.createElement("div",null,i.default.createElement(f.default,null,i.default.createElement("title",null,o+" - "+t),i.default.createElement("meta",{name:"description",content:u})),i.default.createElement(p.default,{siteMetadata:e,page:r}))},t}(i.default.Component);t.default=d;t.pageQuery="** extracted graphql fragment **"}});
//# sourceMappingURL=component---src-templates-page-template-jsx-ef150ef5bc28b140dfe9.js.map