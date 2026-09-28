/* @ds-bundle: {"format":4,"namespace":"JustSchoolDesignSystem_efd9c8","components":[{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"ActionButton","sourcePath":"components/buttons/ActionButton.jsx"},{"name":"AddAction","sourcePath":"components/buttons/AddAction.jsx"},{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"CircleButton","sourcePath":"components/buttons/CircleButton.jsx"},{"name":"CellHeadline","sourcePath":"components/cells/CellHeadline.jsx"},{"name":"CellMain","sourcePath":"components/cells/CellMain.jsx"},{"name":"CellTextRightIcon","sourcePath":"components/cells/CellTextRightIcon.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"},{"name":"SocialLinks","sourcePath":"components/media/SocialLinks.jsx"},{"name":"HeaderButton","sourcePath":"components/navigation/HeaderButton.jsx"},{"name":"Link","sourcePath":"components/navigation/Link.jsx"},{"name":"NavItem","sourcePath":"components/navigation/NavItem.jsx"},{"name":"Pagination","sourcePath":"components/navigation/Pagination.jsx"},{"name":"StudentMenu","sourcePath":"components/navigation/StudentMenu.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"CtaPanel","sourcePath":"components/site/CtaPanel.jsx"},{"name":"FaqRow","sourcePath":"components/site/FaqRow.jsx"},{"name":"FeatureItem","sourcePath":"components/site/FeatureItem.jsx"},{"name":"FormatCard","sourcePath":"components/site/FormatCard.jsx"},{"name":"SectionHeading","sourcePath":"components/site/SectionHeading.jsx"},{"name":"StatCard","sourcePath":"components/site/StatCard.jsx"},{"name":"StatChip","sourcePath":"components/site/StatChip.jsx"},{"name":"StepCard","sourcePath":"components/site/StepCard.jsx"},{"name":"TrustChip","sourcePath":"components/site/TrustChip.jsx"}],"sourceHashes":{"components/brand/Logo.jsx":"f7ab13e57f0e","components/buttons/ActionButton.jsx":"17d0fd6a66c0","components/buttons/AddAction.jsx":"8dc532c06848","components/buttons/Button.jsx":"5a4658ec22e7","components/buttons/CircleButton.jsx":"e0cdb28bdc1f","components/cells/CellHeadline.jsx":"37c19f9a5a74","components/cells/CellMain.jsx":"73e99f285c99","components/cells/CellTextRightIcon.jsx":"328673c67696","components/forms/Checkbox.jsx":"5b11b51a91cf","components/forms/TextField.jsx":"3e8dad60ab31","components/icons/Icon.jsx":"b81dfc2559d3","components/icons/icon-data.js":"5529ce0b19b8","components/media/SocialLinks.jsx":"5758773989a6","components/navigation/HeaderButton.jsx":"692fc096694a","components/navigation/Link.jsx":"80e54369e744","components/navigation/NavItem.jsx":"c9a7573e53d1","components/navigation/Pagination.jsx":"fd4b4643fa5e","components/navigation/StudentMenu.jsx":"78da63bc00f6","components/navigation/Tabs.jsx":"42320e32e168","components/site/CtaPanel.jsx":"032ef1a335f0","components/site/FaqRow.jsx":"29f058acd59e","components/site/FeatureItem.jsx":"bf6d321ca0c2","components/site/FormatCard.jsx":"5cf5a2bd8d51","components/site/SectionHeading.jsx":"e877665585b7","components/site/StatCard.jsx":"4896562fd3f6","components/site/StatChip.jsx":"9b5ad0b3d664","components/site/StepCard.jsx":"600ef065b56a","components/site/TrustChip.jsx":"eaf2b2900c8a","ui_kits/student_app/StudentHome.jsx":"4a4bce9d3cda","ui_kits/website/Faq.jsx":"de473a51f0e7","ui_kits/website/Formats.jsx":"cb2ff8430304","ui_kits/website/Header.jsx":"64a392d24891","ui_kits/website/Hero.jsx":"68cc1022fd25","ui_kits/website/Numbers.jsx":"ca223868020b","ui_kits/website/Reviews.jsx":"af97024b45a1","ui_kits/website/SiteFooter.jsx":"7e0dd9f588f5","ui_kits/website/Steps.jsx":"9aa8df4c1267"},"inlinedExternals":[],"unexposedExports":[{"name":"icons","sourcePath":"components/icons/icon-data.js"}]} */

(() => {

const __ds_ns = (window.JustSchoolDesignSystem_efd9c8 = window.JustSchoolDesignSystem_efd9c8 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const FILES = {
  mark: 'logo.svg',
  horizontal: 'logo-horizontal-black.svg',
  horizontalWhite: 'logo-horizontal-white.svg',
  vertical: 'logo-vertical.svg',
  sticker: 'logo-sticker.svg'
};
function Logo(props) {
  const {
    variant = 'mark',
    height = 31,
    basePath = '../../assets/brand',
    src,
    style,
    ...rest
  } = props;
  const file = src || `${basePath}/${FILES[variant] || FILES.mark}`;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      height,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("img", {
    src: file,
    alt: "JustSchool",
    style: {
      height,
      width: 'auto',
      display: 'block'
    }
  }));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/buttons/ActionButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ActionButton(props) {
  const {
    scheme = 'primary',
    state = 'default',
    icon = null,
    children = 'Button',
    style,
    ...rest
  } = props;
  const primary = {
    default: {
      background: 'var(--js-orange-ui)',
      color: 'var(--js-white)',
      boxShadow: 'none'
    },
    hover: {
      background: 'var(--js-orange-hover)',
      color: 'var(--js-white)',
      boxShadow: 'none'
    },
    pressed: {
      background: 'var(--js-orange-pressed)',
      color: 'var(--js-white)',
      boxShadow: 'none'
    },
    disabled: {
      background: 'var(--js-grey-200)',
      color: 'var(--js-grey-450)',
      boxShadow: 'none'
    }
  };
  const secondary = {
    default: {
      background: 'transparent',
      color: 'var(--js-ink)',
      boxShadow: 'inset 0 0 0 1px var(--js-grey-200)'
    },
    hover: {
      background: 'transparent',
      color: 'var(--js-ink)',
      boxShadow: 'inset 0 0 0 1px var(--js-grey-300)'
    },
    pressed: {
      background: 'transparent',
      color: 'var(--js-ink)',
      boxShadow: 'inset 0 0 0 1px var(--js-grey-600)'
    },
    disabled: {
      background: 'transparent',
      color: 'var(--js-grey-200)',
      boxShadow: 'inset 0 0 0 1px var(--js-grey-200)'
    }
  };
  const tone = (scheme === 'secondary' ? secondary : primary)[state] || primary.default;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: state === 'disabled',
    style: {
      height: 36,
      minWidth: 86,
      borderRadius: 'var(--radius-pill)',
      padding: '0 16px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-ui)',
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '104%',
      border: 0,
      cursor: state === 'disabled' ? 'default' : 'pointer',
      boxSizing: 'border-box',
      ...tone,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: 'currentColor'
    }
  }, icon), /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { ActionButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/ActionButton.jsx", error: String((e && e.message) || e) }); }

// components/buttons/AddAction.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function AddAction(props) {
  const {
    state = 'default',
    label = 'Додати компанію',
    icon = null,
    style,
    ...rest
  } = props;
  const color = state === 'disabled' ? 'var(--js-grey-450)' : state === 'hover' ? 'var(--js-orange-hover)' : state === 'pressed' ? 'var(--js-orange-pressed)' : 'var(--js-orange-ui)';
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: state === 'disabled',
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      height: 24,
      padding: 0,
      border: 0,
      background: 'none',
      color,
      fontFamily: 'var(--font-ui)',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '18px',
      cursor: state === 'disabled' ? 'default' : 'pointer',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, icon), /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { AddAction });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/AddAction.jsx", error: String((e && e.message) || e) }); }

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const BASE = {
  height: 36,
  minWidth: 64,
  borderRadius: 'var(--radius-pill)',
  padding: '0 16px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  fontFamily: 'var(--font-ui)',
  fontWeight: 400,
  fontSize: 14,
  lineHeight: '104%',
  border: 0,
  background: 'none',
  cursor: 'pointer',
  boxSizing: 'border-box',
  transition: 'background var(--duration-base) var(--ease-standard), box-shadow var(--duration-base) var(--ease-standard)'
};
const PRIMARY = {
  default: {
    background: 'var(--js-orange-ui)',
    color: 'var(--js-white)'
  },
  hover: {
    background: 'var(--js-orange-hover)',
    color: 'var(--js-white)'
  },
  pressed: {
    background: 'var(--js-orange-pressed)',
    color: 'var(--js-white)'
  },
  disabled: {
    background: 'var(--js-grey-200)',
    color: 'var(--js-grey-450)',
    cursor: 'default'
  }
};
const SECONDARY = {
  default: {
    background: 'var(--js-white)',
    color: 'var(--js-ink-slate)',
    boxShadow: 'inset 0 0 0 1px var(--js-grey-200)'
  },
  hover: {
    background: 'var(--js-white)',
    color: 'var(--js-ink-slate)',
    boxShadow: 'inset 0 0 0 1px var(--js-grey-300)'
  },
  pressed: {
    background: 'var(--js-white)',
    color: 'var(--js-ink-slate)',
    boxShadow: 'inset 0 0 0 1px var(--js-grey-600)'
  },
  disabled: {
    background: 'var(--js-white)',
    color: 'var(--js-grey-200)',
    boxShadow: 'inset 0 0 0 1px var(--js-grey-200)',
    cursor: 'default'
  }
};
function Button(props) {
  const {
    scheme = 'primary',
    state = 'default',
    loading = false,
    children = 'Button',
    style,
    ...rest
  } = props;
  const map = scheme === 'secondary' ? SECONDARY : PRIMARY;
  const tone = map[loading ? 'default' : state] || map.default;
  const spinner = scheme === 'secondary' ? 'var(--js-orange-ui)' : 'var(--js-white)';
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: state === 'disabled',
    style: {
      ...BASE,
      ...tone,
      ...style
    }
  }, rest), loading ? /*#__PURE__*/React.createElement("span", {
    "aria-label": "loading",
    style: {
      width: 20,
      height: 20,
      borderRadius: 'var(--radius-circle)',
      background: spinner,
      display: 'block'
    }
  }) : children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/CircleButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  default: 'var(--js-orange-ui)',
  hover: 'var(--js-orange-hover)',
  pressed: 'var(--js-orange-pressed)',
  disabled: 'var(--js-grey-200)',
  cancel: 'var(--js-ink)'
};
function CircleButton(props) {
  const {
    size = 'm',
    tone = 'default',
    icon = null,
    style,
    ...rest
  } = props;
  const d = size === 's' ? 44 : 56;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: tone === 'disabled',
    style: {
      width: d,
      height: d,
      borderRadius: 'var(--radius-circle)',
      background: TONES[tone] || TONES.default,
      boxShadow: 'var(--shadow-card)',
      border: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--js-white)',
      cursor: tone === 'disabled' ? 'default' : 'pointer',
      padding: 0,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, icon));
}
Object.assign(__ds_scope, { CircleButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/CircleButton.jsx", error: String((e && e.message) || e) }); }

// components/cells/CellHeadline.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CellHeadline(props) {
  const {
    children = 'Headline',
    width = 200,
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width,
      height: 56,
      display: 'flex',
      alignItems: 'center',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontWeight: 700,
      fontSize: 20,
      lineHeight: '28px',
      color: 'var(--js-ink)'
    }
  }, children));
}
Object.assign(__ds_scope, { CellHeadline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cells/CellHeadline.jsx", error: String((e && e.message) || e) }); }

// components/cells/CellMain.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CellMain(props) {
  const {
    children = 'Main',
    width = 200,
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width,
      height: 56,
      display: 'flex',
      alignItems: 'center',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-ui)',
      fontWeight: 400,
      fontSize: 14,
      lineHeight: '104%',
      color: 'var(--js-ink)'
    }
  }, children));
}
Object.assign(__ds_scope, { CellMain });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cells/CellMain.jsx", error: String((e && e.message) || e) }); }

// components/cells/CellTextRightIcon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CellTextRightIcon(props) {
  const {
    children = 'Main',
    icon = null,
    width = 200,
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width,
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.CellMain, {
    width: 160
  }, children), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: 'var(--js-ink)'
    }
  }, icon));
}
Object.assign(__ds_scope, { CellTextRightIcon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cells/CellTextRightIcon.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox(props) {
  const {
    checked = false,
    state = 'default',
    label = '',
    onChange,
    style,
    ...rest
  } = props;
  const border = state === 'hover' ? 'var(--js-grey-300)' : 'var(--js-grey-175)';
  return /*#__PURE__*/React.createElement("label", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: 'var(--radius-xs)',
      background: 'var(--js-white)',
      boxShadow: `inset 0 0 0 1px ${border}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, checked ? /*#__PURE__*/React.createElement("svg", {
    width: "13.75",
    height: "9.167",
    viewBox: "0 0 13.75 9.167",
    fill: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 4.2 L4.9 8.1 L12.75 1",
    stroke: "var(--js-orange-link)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })) : null), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    onChange: onChange,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 400,
      fontSize: 16,
      lineHeight: '20px',
      color: 'var(--js-ink)'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TextField(props) {
  const {
    state = 'default',
    value = '',
    placeholder = 'Main',
    helperText = '',
    style,
    ...rest
  } = props;
  const border = state === 'error' ? 'var(--js-error)' : state === 'pressed' ? 'var(--js-grey-600)' : state === 'hover' ? 'var(--js-grey-300)' : 'var(--js-grey-350)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 111,
      height: 60,
      borderRadius: 'var(--radius-xl)',
      boxShadow: `inset 0 0 0 1px ${border}`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 29px',
      boxSizing: 'border-box',
      background: 'var(--js-white)'
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    value: value,
    placeholder: placeholder,
    readOnly: state === 'disabled',
    style: {
      border: 0,
      outline: 'none',
      background: 'none',
      width: '100%',
      fontFamily: 'var(--font-core)',
      fontWeight: 400,
      fontSize: 21,
      lineHeight: '100%',
      color: value ? 'var(--js-ink)' : 'var(--js-grey-350)'
    }
  }, rest))), helperText ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 400,
      fontSize: 10,
      lineHeight: '100%',
      color: state === 'error' ? 'var(--js-error)' : 'var(--js-grey-500)',
      paddingLeft: 20
    }
  }, helperText) : null);
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextField.jsx", error: String((e && e.message) || e) }); }

// components/icons/icon-data.js
try { (() => {
// Icon data as { viewBox, body } SVG-markup entries. Render via the sibling
// Icon.jsx (<Icon name="Mail" size={24} />).
//
// Entries 1-9 were extracted from Redesign_MainPage_JustSchool.fig.
// The remaining 46 come from the user-supplied "Унікальні іконки - 24px" sheet;
// their strokes are hard-coded #F46600, so they do NOT follow currentColor.
const icons = {
  "FavoriteBorder": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 0 0 L 24 0 L 24 24 L 0 24 L 0 0 Z\" fill=\"currentColor\" fill-rule=\"evenodd\"/><path d=\"M 14.5 0 C 12.76 0 11.09 0.81 10 2.09 C 8.91 0.81 7.24 0 5.5 0 C 2.42 0 0 2.42 0 5.5 C 0 9.28 3.4 12.36 8.55 17.04 L 10 18.35 L 11.45 17.03 C 16.6 12.36 20 9.28 20 5.5 C 20 2.42 17.58 0 14.5 0 Z M 10.1 15.55 L 10 15.65 L 9.9 15.55 C 5.14 11.24 2 8.39 2 5.5 C 2 3.5 3.5 2 5.5 2 C 7.04 2 8.54 2.99 9.07 4.36 L 10.94 4.36 C 11.46 2.99 12.96 2 14.5 2 C 16.5 2 18 3.5 18 5.5 C 18 8.39 14.86 11.24 10.1 15.55 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 2 3)\"/>"
  },
  "FiChevronRight": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 0 12 L 6 6 L 0 0 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 9 6)\"/>"
  },
  "Homework": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 10 0 L 4 0 C 2.939 0 1.922 0.421 1.172 1.172 C 0.421 1.922 0 2.939 0 4 L 0 18 C 0 17.204 0.316 16.441 0.879 15.879 C 1.441 15.316 2.204 15 3 15 L 10 15 L 10 0 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 12 3)\"/><path d=\"M 0 0 L 6 0 C 7.061 0 8.078 0.421 8.828 1.172 C 9.579 1.922 10 2.939 10 4 L 10 18 C 10 17.204 9.684 16.441 9.121 15.879 C 8.559 15.316 7.796 15 7 15 L 0 15 L 0 0 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 2 3)\"/>"
  },
  "Ic16x16ArrowProperty1Default": {
    viewBox: "0 0 16 16",
    body: "<path d=\"M 9.719 0.279 C 9.542 0.1 9.301 0 9.051 0 C 8.8 0 8.56 0.1 8.382 0.279 L 4.976 3.68 L 1.618 0.279 C 1.44 0.1 1.2 0 0.949 0 C 0.699 0 0.458 0.1 0.281 0.279 C 0.192 0.369 0.121 0.475 0.073 0.592 C 0.025 0.709 0 0.834 0 0.961 C 0 1.088 0.025 1.214 0.073 1.331 C 0.121 1.448 0.192 1.554 0.281 1.643 L 4.303 5.716 C 4.391 5.806 4.496 5.877 4.611 5.926 C 4.727 5.975 4.851 6 4.976 6 C 5.102 6 5.226 5.975 5.341 5.926 C 5.457 5.877 5.562 5.806 5.65 5.716 L 9.719 1.643 C 9.808 1.554 9.879 1.448 9.927 1.331 C 9.975 1.214 10 1.088 10 0.961 C 10 0.834 9.975 0.709 9.927 0.592 C 9.879 0.475 9.808 0.369 9.719 0.279 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 6)\"/>"
  },
  "Ic16x16ArrowProperty1Variant2": {
    viewBox: "0 0 16 16",
    body: "<path d=\"M 9.719 0.279 C 9.542 0.1 9.301 0 9.051 0 C 8.8 0 8.56 0.1 8.382 0.279 L 4.976 3.68 L 1.618 0.279 C 1.44 0.1 1.2 0 0.949 0 C 0.699 0 0.458 0.1 0.281 0.279 C 0.192 0.369 0.121 0.475 0.073 0.592 C 0.025 0.709 0 0.834 0 0.961 C 0 1.088 0.025 1.214 0.073 1.331 C 0.121 1.448 0.192 1.554 0.281 1.643 L 4.303 5.716 C 4.391 5.806 4.496 5.877 4.611 5.926 C 4.727 5.975 4.851 6 4.976 6 C 5.102 6 5.226 5.975 5.341 5.926 C 5.457 5.877 5.562 5.806 5.65 5.716 L 9.719 1.643 C 9.808 1.554 9.879 1.448 9.927 1.331 C 9.975 1.214 10 1.088 10 0.961 C 10 0.834 9.975 0.709 9.927 0.592 C 9.879 0.475 9.808 0.369 9.719 0.279 Z\" fill=\"currentColor\" fill-rule=\"nonzero\" transform=\"matrix(1 0 0 1 3 6)\"/>"
  },
  "Ic24x24ArrowDropDown": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 4.958 4.958 L 0 0 L 9.917 0 L 4.958 4.958 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 7 10)\"/>"
  },
  "Ic24x24Volume2": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 9 0 L 4 4 L 0 4 L 0 10 L 4 10 L 9 14 L 9 0 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 2 5)\"/><path d=\"M 0 3.53 C 0.937 4.468 1.464 5.739 1.464 7.065 C 1.464 8.391 0.937 9.662 0 10.6 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 15.540 4.930)\"/>"
  },
  "LogoJustschool": {
    viewBox: "0 0 178 31",
    body: "<path d=\"M 15.029 0 L 12.54 2.111 C 6.598 2.579 2.035 3.68 0.534 5.042 C 0.183 4.728 0 4.399 0 4.062 C 0 2.068 6.441 0.397 15.029 0 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 0 20.787)\"/><path d=\"M 0 0 C 0.321 0.097 0.662 0.198 1.027 0.29 C 0.661 0.198 0.321 0.101 0 0 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 3.505 27.253)\"/><path d=\"M 0 0.29 C 0.366 0.198 0.706 0.097 1.027 0 C 0.706 0.101 0.365 0.198 0 0.29 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 33.465 27.253)\"/><path d=\"M 11.069 3.594 C 11.069 3.932 10.886 4.261 10.535 4.574 C 9.162 3.328 5.216 2.299 0 1.772 L 1.61 0 C 7.27 0.72 11.068 2.058 11.068 3.593 L 11.069 3.594 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 26.930 21.254)\"/><path d=\"M 12.008 0.001 L 6.022 5.091 C 5.829 5.058 5.642 5.019 5.454 4.98 C 5.088 4.903 4.737 4.826 4.401 4.748 C 4.386 4.743 4.376 4.738 4.367 4.738 C 4.243 4.71 4.12 4.675 4.001 4.646 C 3.635 4.555 3.295 4.453 2.974 4.357 C 2.653 4.26 2.347 4.154 2.065 4.047 C 1.809 3.951 1.566 3.854 1.339 3.753 C 1.221 3.7 1.112 3.647 1.003 3.588 C 0.929 3.549 0.855 3.511 0.786 3.472 C 0.761 3.457 0.731 3.444 0.707 3.429 C 0.613 3.376 0.524 3.323 0.44 3.264 C 0.375 3.221 0.312 3.177 0.252 3.134 C 0.158 3.066 0.074 2.999 0 2.932 C 1.502 1.57 6.065 0.468 12.006 0 L 12.008 0.001 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 0.531 22.894)\"/><path d=\"M 15.929 2.8 C 15.855 2.868 15.772 2.935 15.678 3.002 C 15.619 3.046 15.554 3.09 15.49 3.132 C 15.406 3.19 15.317 3.244 15.223 3.297 C 15.198 3.312 15.168 3.326 15.144 3.34 C 15.074 3.379 15 3.418 14.926 3.457 C 14.818 3.514 14.709 3.568 14.59 3.621 C 14.363 3.722 14.121 3.819 13.864 3.915 C 13.583 4.021 13.276 4.128 12.955 4.225 C 12.634 4.321 12.293 4.423 11.928 4.515 C 11.809 4.543 11.686 4.578 11.563 4.607 C 11.553 4.607 11.543 4.611 11.528 4.616 C 11.192 4.693 10.842 4.77 10.477 4.848 C 10.289 4.887 10.097 4.925 9.899 4.964 C 9.553 5.027 9.198 5.09 8.832 5.153 C 8.576 5.196 8.309 5.234 8.042 5.274 C 7.613 5.337 7.168 5.399 6.708 5.452 C 6.027 5.539 5.316 5.612 4.584 5.674 C 4.337 5.698 4.09 5.718 3.843 5.737 C 3.774 5.742 3.7 5.746 3.631 5.752 C 3.201 5.785 2.766 5.815 2.322 5.844 C 2.059 5.859 1.798 5.873 1.536 5.883 C 1.274 5.898 1.013 5.907 0.746 5.916 C 0.588 5.921 0.429 5.931 0.272 5.936 C 0.182 5.936 0.094 5.94 0 5.94 L 5.394 0 C 10.609 0.527 14.556 1.555 15.928 2.802 L 15.929 2.8 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 21.537 23.027)\"/><path d=\"M 42.952 8.562 L 42.947 8.562 C 42.839 8.668 42.72 8.76 42.601 8.847 C 42.483 8.939 42.364 9.031 42.236 9.113 C 41.993 9.277 41.746 9.431 41.515 9.567 C 41.258 9.712 40.996 9.857 40.734 9.997 C 40.516 10.113 40.304 10.224 40.087 10.33 C 39.801 10.471 39.514 10.616 39.223 10.75 C 38.966 10.866 38.447 10.987 38.25 11.19 C 38.25 11.19 32.703 17.009 28.757 13.803 L 21.991 21.255 L 20.381 23.027 L 14.987 28.967 C 14.967 28.967 14.947 28.967 14.928 28.972 C 14.883 28.972 14.834 28.972 14.785 28.977 C 14.656 28.977 14.528 28.981 14.394 28.986 C 14.32 28.991 14.246 28.991 14.172 28.991 C 13.994 28.991 13.811 28.995 13.629 28.995 C 13.422 29 13.209 29 12.991 29 C 12.443 29 11.895 28.995 11.366 28.995 L 11 28.995 C 10.906 28.995 10.812 28.991 10.724 28.991 C 10.65 28.986 10.576 28.986 10.501 28.986 C 9.628 28.977 8.734 28.938 7.849 28.885 C 7.558 28.87 7.272 28.851 6.99 28.832 C 6.747 28.817 6.511 28.798 6.278 28.779 C 6.175 28.77 6.076 28.764 5.977 28.755 C 5.804 28.74 5.626 28.726 5.458 28.711 C 4.313 28.605 3.216 28.484 2.218 28.349 C 2.164 28.34 2.11 28.334 2.055 28.325 C 1.734 28.276 1.417 28.228 1.121 28.184 C 1.022 28.165 0.923 28.151 0.825 28.136 C 0.75 28.121 0.676 28.107 0.607 28.097 C 0.488 28.078 0.375 28.053 0.266 28.034 C 0.221 28.029 0.172 28.019 0.133 28.01 C 0.088 28 0.044 27.99 0 27.986 L 5.986 22.895 L 8.475 20.785 L 24.186 7.426 L 20.072 7.141 C 19.331 7.092 18.684 6.629 18.408 5.957 L 16.58 1.48 L 20.867 1.48 C 21.529 1.48 22.166 1.741 22.635 2.195 L 26.077 5.909 L 27.386 4.788 L 25.801 3.137 L 24.566 1.852 C 24.137 1.364 24.032 0.577 24.748 0.389 L 25.998 0.051 C 26.808 -0.166 27.163 0.326 27.603 1.254 C 27.603 1.254 27.608 1.263 27.618 1.283 C 27.623 1.298 27.638 1.326 27.652 1.36 C 27.722 1.509 27.855 1.79 28.003 2.118 C 28.333 2.823 28.739 3.707 28.744 3.712 C 28.694 3.596 35.703 4.239 40.355 4.542 L 41.155 5.324 C 41.317 5.184 41.53 5.116 41.743 5.131 C 41.96 5.146 42.158 5.243 42.3 5.402 L 43.189 4.682 C 43.224 4.686 43.254 4.686 43.283 4.686 C 43.56 4.691 43.91 4.952 44.064 5.334 C 44.494 6.724 43.842 7.768 42.948 8.56 L 42.952 8.562 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 6.551 0)\"/><path d=\"M 3.277 1.04 C 3.747 0.767 4.262 0.437 4.716 0.038 C 2.48 0.76 0.523 0.041 0.417 0 L 0 1.038 C 0.082 1.069 1.085 1.444 2.501 1.47 C 2.762 1.331 3.022 1.189 3.277 1.039 L 3.277 1.04 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 44.784 8.524)\"/><path d=\"M 1.324 7.131 L 5.887 5.644 L 8.547 0.439 L 6.862 0 L 0 5.836 L 1.324 7.131 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 20.239 10.521)\"/><path d=\"M 8.915 2.581 L 7.725 5.958 L 0 6.937 L 8.16 0 L 8.915 2.581 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 8.064 19.773)\"/><path d=\"M 7.223 0 L 1.521 2.23 L 0 7.064 L 4.234 8.018 L 10.117 1.543 L 7.223 0 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 19.282 18.768)\"/><path d=\"M 0.044 2.307 C -0.065 1.809 0.031 1.298 0.314 0.871 C 0.597 0.443 1.034 0.148 1.543 0.042 C 2.595 -0.178 3.634 0.48 3.86 1.508 L 2.745 1.742 C 2.651 1.315 2.219 1.042 1.782 1.133 C 1.571 1.178 1.389 1.299 1.271 1.478 C 1.153 1.655 1.114 1.867 1.159 2.074 L 0.044 2.308 L 0.044 2.307 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 30.778 0.001) matrix(1 0 0 1 0 0) matrix(1 0 0 1 6.134 4.695)\"/><path d=\"M 2.835 0.669 L 1.945 1.389 C 1.802 1.229 1.604 1.132 1.388 1.118 C 1.175 1.103 0.963 1.171 0.8 1.311 L 0 0.529 L 0.005 0.529 C 0.4 0.191 0.948 -0.026 1.467 0.003 C 1.985 0.042 2.494 0.283 2.835 0.67 L 2.835 0.669 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 30.778 0.001) matrix(1 0 0 1 0 0) matrix(1 0 0 1 16.131 4.013)\"/><path d=\"M 0.338 1.853 L 1.573 3.135 C 1.667 3.147 1.762 3.154 1.859 3.154 C 2.636 3.154 3.328 2.749 3.781 2.117 C 3.562 1.645 3.379 1.25 3.379 1.25 C 2.938 0.323 2.582 -0.165 1.774 0.051 L 0.522 0.384 C -0.192 0.574 -0.093 1.364 0.338 1.853 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 30.778 0.001) matrix(1 0 0 1 0 0) matrix(1 0 0 1 0 0)\"/><path d=\"M 0 15.377 L 0 0 L 2.653 0 L 2.653 15.377 L 0 15.377 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 63.090 8.352) matrix(1 0 0 1 110.079 0.195)\"/><path d=\"M 5.677 11.788 C 4.502 11.788 3.487 11.549 2.632 11.071 C 1.791 10.592 1.138 9.911 0.674 9.026 C 0.225 8.142 0 7.105 0 5.916 C 0 4.713 0.232 3.676 0.696 2.806 C 1.16 1.921 1.813 1.233 2.654 0.739 C 3.495 0.246 4.502 0 5.677 0 C 6.837 0 7.837 0.246 8.678 0.739 C 9.519 1.233 10.165 1.929 10.614 2.827 C 11.064 3.712 11.288 4.756 11.288 5.96 C 11.288 7.134 11.064 8.164 10.614 9.048 C 10.179 9.918 9.541 10.592 8.7 11.071 C 7.859 11.549 6.851 11.788 5.677 11.788 Z M 5.655 9.374 C 6.38 9.374 6.96 9.215 7.395 8.896 C 7.844 8.577 8.171 8.156 8.374 7.634 C 8.577 7.112 8.678 6.547 8.678 5.938 C 8.678 5.329 8.577 4.756 8.374 4.219 C 8.171 3.683 7.844 3.255 7.395 2.936 C 6.96 2.603 6.38 2.436 5.655 2.436 C 4.93 2.436 4.343 2.603 3.893 2.936 C 3.444 3.255 3.118 3.683 2.915 4.219 C 2.712 4.741 2.61 5.314 2.61 5.938 C 2.61 6.547 2.712 7.12 2.915 7.656 C 3.132 8.178 3.458 8.599 3.893 8.918 C 4.343 9.222 4.93 9.374 5.655 9.374 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 63.090 8.352) matrix(1 0 0 1 96.667 3.937)\"/><path d=\"M 5.677 11.788 C 4.502 11.788 3.487 11.549 2.632 11.071 C 1.791 10.592 1.138 9.911 0.674 9.026 C 0.225 8.142 0 7.105 0 5.916 C 0 4.713 0.232 3.676 0.696 2.806 C 1.16 1.921 1.813 1.233 2.654 0.739 C 3.495 0.246 4.502 0 5.677 0 C 6.837 0 7.837 0.246 8.678 0.739 C 9.519 1.233 10.165 1.929 10.614 2.827 C 11.064 3.712 11.288 4.756 11.288 5.96 C 11.288 7.134 11.064 8.164 10.614 9.048 C 10.179 9.918 9.541 10.592 8.7 11.071 C 7.859 11.549 6.851 11.788 5.677 11.788 Z M 5.655 9.374 C 6.38 9.374 6.96 9.215 7.395 8.896 C 7.845 8.577 8.171 8.156 8.374 7.634 C 8.577 7.112 8.678 6.547 8.678 5.938 C 8.678 5.329 8.577 4.756 8.374 4.219 C 8.171 3.683 7.845 3.255 7.395 2.936 C 6.96 2.603 6.38 2.436 5.655 2.436 C 4.93 2.436 4.343 2.603 3.893 2.936 C 3.444 3.255 3.118 3.683 2.915 4.219 C 2.712 4.741 2.61 5.314 2.61 5.938 C 2.61 6.547 2.712 7.12 2.915 7.656 C 3.132 8.178 3.458 8.599 3.893 8.918 C 4.343 9.222 4.93 9.374 5.655 9.374 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 63.090 8.352) matrix(1 0 0 1 83.688 3.937)\"/><path d=\"M 0 15.377 L 0 0 L 2.654 0 L 2.654 5.394 C 2.958 5.002 3.313 4.684 3.719 4.437 C 4.125 4.19 4.553 4.016 5.003 3.915 C 5.452 3.799 5.88 3.741 6.286 3.741 C 7.373 3.741 8.229 3.98 8.852 4.459 C 9.476 4.937 9.911 5.575 10.157 6.373 C 10.418 7.17 10.549 8.069 10.549 9.07 L 10.549 15.377 L 7.895 15.377 L 7.895 9.526 C 7.895 9.135 7.866 8.736 7.808 8.33 C 7.75 7.924 7.634 7.562 7.46 7.243 C 7.301 6.909 7.054 6.641 6.721 6.438 C 6.402 6.235 5.974 6.134 5.438 6.134 C 4.93 6.134 4.495 6.242 4.133 6.46 C 3.77 6.663 3.48 6.945 3.262 7.308 C 3.059 7.671 2.907 8.069 2.806 8.504 C 2.704 8.939 2.654 9.374 2.654 9.809 L 2.654 15.377 L 0 15.377 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 63.090 8.352) matrix(1 0 0 1 71.082 0.195)\"/><path d=\"M 5.481 11.788 C 4.292 11.788 3.292 11.549 2.48 11.071 C 1.668 10.578 1.051 9.889 0.631 9.004 C 0.21 8.12 0 7.098 0 5.938 C 0 4.778 0.218 3.756 0.653 2.871 C 1.088 1.972 1.726 1.269 2.567 0.761 C 3.408 0.254 4.43 0 5.633 0 C 6.518 0 7.301 0.152 7.982 0.457 C 8.678 0.761 9.237 1.211 9.657 1.805 C 10.092 2.385 10.367 3.11 10.483 3.98 L 7.874 3.98 C 7.7 3.429 7.41 3.03 7.004 2.784 C 6.612 2.523 6.141 2.393 5.59 2.393 C 4.85 2.393 4.263 2.574 3.828 2.936 C 3.407 3.284 3.103 3.727 2.915 4.263 C 2.726 4.8 2.632 5.358 2.632 5.938 C 2.632 6.547 2.733 7.12 2.936 7.656 C 3.139 8.178 3.451 8.599 3.872 8.918 C 4.307 9.237 4.865 9.396 5.546 9.396 C 6.097 9.396 6.59 9.273 7.025 9.026 C 7.475 8.78 7.765 8.381 7.895 7.83 L 10.592 7.83 C 10.491 8.715 10.194 9.454 9.701 10.049 C 9.222 10.629 8.613 11.064 7.874 11.354 C 7.134 11.644 6.337 11.788 5.481 11.788 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 63.090 8.352) matrix(1 0 0 1 58.498 3.937)\"/><path d=\"M 6.373 15.747 C 5.343 15.747 4.372 15.595 3.458 15.29 C 2.559 14.971 1.805 14.471 1.196 13.79 C 0.587 13.094 0.188 12.187 0 11.071 L 2.762 11.071 C 2.936 11.636 3.212 12.078 3.589 12.397 C 3.98 12.716 4.437 12.941 4.959 13.072 C 5.481 13.188 6.01 13.246 6.547 13.246 C 7.025 13.246 7.475 13.188 7.895 13.072 C 8.33 12.941 8.686 12.731 8.961 12.441 C 9.251 12.151 9.396 11.767 9.396 11.288 C 9.396 10.926 9.316 10.636 9.157 10.418 C 9.012 10.186 8.802 9.998 8.526 9.853 C 8.265 9.693 7.946 9.57 7.569 9.483 C 7.207 9.367 6.815 9.266 6.394 9.179 C 5.974 9.092 5.561 8.997 5.155 8.896 C 4.749 8.794 4.364 8.664 4.002 8.504 C 3.538 8.345 3.088 8.164 2.653 7.961 C 2.233 7.743 1.863 7.482 1.544 7.178 C 1.24 6.873 0.993 6.496 0.805 6.047 C 0.616 5.597 0.522 5.061 0.522 4.437 C 0.522 3.726 0.638 3.117 0.87 2.61 C 1.116 2.088 1.435 1.66 1.827 1.327 C 2.233 0.993 2.682 0.732 3.175 0.544 C 3.683 0.355 4.205 0.217 4.742 0.13 C 5.293 0.043 5.814 0 6.307 0 C 7.264 0 8.135 0.16 8.918 0.479 C 9.715 0.797 10.367 1.29 10.875 1.957 C 11.383 2.624 11.672 3.48 11.745 4.524 L 9.113 4.524 C 9.055 4.031 8.881 3.639 8.591 3.349 C 8.301 3.045 7.939 2.828 7.504 2.697 C 7.069 2.552 6.598 2.479 6.09 2.479 C 5.742 2.479 5.394 2.508 5.046 2.566 C 4.712 2.624 4.408 2.726 4.132 2.871 C 3.871 3.016 3.654 3.212 3.48 3.458 C 3.32 3.69 3.241 3.987 3.241 4.35 C 3.241 4.669 3.32 4.952 3.48 5.198 C 3.639 5.43 3.857 5.626 4.132 5.785 C 4.422 5.945 4.763 6.09 5.155 6.221 C 5.662 6.424 6.213 6.576 6.808 6.677 C 7.417 6.779 7.99 6.916 8.526 7.09 C 9.048 7.235 9.526 7.417 9.961 7.634 C 10.411 7.837 10.795 8.091 11.114 8.396 C 11.433 8.686 11.68 9.048 11.854 9.483 C 12.042 9.904 12.136 10.411 12.136 11.005 C 12.136 11.875 11.977 12.615 11.658 13.224 C 11.354 13.819 10.926 14.304 10.375 14.681 C 9.838 15.058 9.222 15.334 8.526 15.508 C 7.845 15.667 7.127 15.747 6.373 15.747 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 63.090 8.352) matrix(1 0 0 1 44.421 0)\"/><path d=\"M 5.851 14.66 C 4.923 14.66 4.154 14.536 3.545 14.29 C 2.951 14.043 2.501 13.645 2.197 13.094 C 1.907 12.543 1.762 11.803 1.762 10.875 L 1.762 5.546 L 0 5.546 L 0 3.197 L 1.762 3.197 L 1.762 0 L 4.415 0 L 4.415 3.197 L 7.091 3.197 L 7.091 5.546 L 4.415 5.546 L 4.415 10.527 C 4.415 11.107 4.517 11.549 4.72 11.854 C 4.923 12.158 5.38 12.311 6.09 12.311 L 7.004 12.311 L 7.004 14.66 L 5.851 14.66 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 63.090 8.352) matrix(1 0 0 1 35.782 0.915)\"/><path d=\"M 5.003 11.788 C 4.452 11.788 3.9 11.731 3.349 11.615 C 2.813 11.498 2.306 11.31 1.827 11.049 C 1.349 10.774 0.95 10.404 0.631 9.94 C 0.312 9.476 0.102 8.896 0 8.2 L 2.675 8.2 C 2.791 8.519 2.972 8.78 3.219 8.983 C 3.48 9.171 3.777 9.316 4.111 9.418 C 4.459 9.505 4.8 9.548 5.133 9.548 C 5.336 9.548 5.553 9.534 5.785 9.505 C 6.032 9.476 6.257 9.418 6.46 9.331 C 6.677 9.244 6.851 9.121 6.982 8.961 C 7.112 8.787 7.178 8.562 7.178 8.287 C 7.178 8.026 7.105 7.823 6.96 7.678 C 6.815 7.518 6.619 7.395 6.373 7.308 C 6.126 7.206 5.829 7.127 5.481 7.069 C 4.858 6.938 4.19 6.801 3.48 6.656 C 2.769 6.496 2.153 6.25 1.631 5.916 C 1.414 5.786 1.225 5.633 1.066 5.459 C 0.906 5.285 0.769 5.097 0.653 4.894 C 0.551 4.676 0.471 4.444 0.413 4.198 C 0.37 3.951 0.348 3.683 0.348 3.393 C 0.348 2.784 0.471 2.269 0.718 1.849 C 0.979 1.414 1.32 1.066 1.74 0.805 C 2.175 0.529 2.668 0.326 3.219 0.196 C 3.77 0.065 4.335 0 4.915 0 C 5.698 0 6.409 0.123 7.047 0.37 C 7.685 0.616 8.214 0.993 8.635 1.501 C 9.07 2.008 9.331 2.654 9.418 3.437 L 6.895 3.437 C 6.822 3.074 6.597 2.784 6.22 2.567 C 5.858 2.349 5.394 2.24 4.828 2.24 C 4.625 2.24 4.415 2.262 4.198 2.306 C 3.98 2.335 3.77 2.393 3.567 2.479 C 3.378 2.552 3.219 2.668 3.088 2.827 C 2.972 2.987 2.915 3.183 2.915 3.415 C 2.915 3.632 2.965 3.821 3.067 3.98 C 3.183 4.14 3.349 4.278 3.567 4.394 C 3.799 4.495 4.067 4.582 4.372 4.654 C 4.865 4.756 5.379 4.857 5.916 4.959 C 6.452 5.06 6.917 5.162 7.308 5.264 C 7.772 5.394 8.192 5.583 8.569 5.829 C 8.947 6.061 9.237 6.373 9.44 6.764 C 9.657 7.141 9.766 7.627 9.766 8.221 C 9.766 8.917 9.621 9.498 9.331 9.962 C 9.055 10.426 8.686 10.788 8.222 11.049 C 7.758 11.31 7.243 11.498 6.677 11.615 C 6.112 11.731 5.554 11.788 5.003 11.788 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 63.090 8.352) matrix(1 0 0 1 25.126 3.937)\"/><path d=\"M 5.111 11.615 C 3.458 11.615 2.189 11.187 1.305 10.331 C 0.435 9.476 0 8.171 0 6.416 L 0 0 L 2.653 0 L 2.653 6.242 C 2.653 6.851 2.733 7.38 2.893 7.83 C 3.067 8.279 3.335 8.628 3.697 8.874 C 4.074 9.106 4.546 9.222 5.111 9.222 C 5.72 9.222 6.199 9.099 6.547 8.852 C 6.909 8.591 7.163 8.236 7.308 7.787 C 7.453 7.337 7.525 6.822 7.525 6.242 L 7.525 0 L 10.179 0 L 10.179 6.416 C 10.179 8.214 9.729 9.534 8.83 10.375 C 7.946 11.201 6.706 11.615 5.111 11.615 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 63.090 8.352) matrix(1 0 0 1 13.032 4.112)\"/><path d=\"M 5.264 15.551 C 4.495 15.551 3.792 15.464 3.154 15.29 C 2.516 15.102 1.965 14.812 1.501 14.42 C 1.051 14.014 0.696 13.492 0.435 12.854 C 0.174 12.202 0.029 11.412 0 10.484 L 2.719 10.484 C 2.748 10.948 2.842 11.375 3.002 11.767 C 3.161 12.158 3.415 12.47 3.763 12.702 C 4.125 12.934 4.611 13.05 5.22 13.05 C 5.8 13.05 6.249 12.927 6.569 12.68 C 6.887 12.434 7.112 12.108 7.243 11.702 C 7.388 11.296 7.46 10.839 7.46 10.331 L 7.46 0 L 10.157 0 L 10.157 9.983 C 10.157 10.839 10.063 11.615 9.875 12.311 C 9.7 12.992 9.41 13.579 9.004 14.072 C 8.613 14.551 8.105 14.921 7.482 15.182 C 6.873 15.428 6.134 15.551 5.264 15.551 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 1 1) matrix(1 0 0 1 63.090 8.352) matrix(1 0 0 1 0 0.195)\"/>"
  },
  "Star": {
    viewBox: "0 0 24 24",
    body: "<path d=\"M 19.994 7.234 C 19.93 7.051 19.816 6.891 19.663 6.772 C 19.51 6.653 19.326 6.581 19.134 6.564 L 13.444 5.734 L 10.894 0.564 C 10.812 0.395 10.684 0.252 10.525 0.153 C 10.366 0.053 10.181 0 9.994 0 C 9.806 0 9.622 0.053 9.463 0.153 C 9.303 0.252 9.176 0.395 9.094 0.564 L 6.544 5.724 L 0.854 6.564 C 0.669 6.59 0.495 6.668 0.351 6.788 C 0.208 6.908 0.102 7.066 0.044 7.244 C -0.009 7.418 -0.014 7.603 0.03 7.779 C 0.074 7.955 0.165 8.116 0.294 8.244 L 4.424 12.244 L 3.424 17.924 C 3.383 18.113 3.398 18.309 3.467 18.489 C 3.535 18.669 3.654 18.825 3.809 18.94 C 3.965 19.054 4.15 19.12 4.342 19.132 C 4.534 19.143 4.726 19.099 4.894 19.004 L 9.994 16.334 L 15.094 19.004 C 15.234 19.083 15.392 19.125 15.554 19.124 C 15.765 19.125 15.972 19.058 16.144 18.934 C 16.299 18.823 16.419 18.67 16.49 18.493 C 16.561 18.315 16.579 18.122 16.544 17.934 L 15.544 12.254 L 19.674 8.254 C 19.818 8.132 19.925 7.971 19.981 7.79 C 20.038 7.61 20.042 7.417 19.994 7.234 Z M 13.844 11.234 C 13.728 11.347 13.641 11.485 13.591 11.638 C 13.54 11.792 13.527 11.955 13.554 12.114 L 14.274 16.314 L 10.514 14.314 C 10.367 14.242 10.207 14.204 10.044 14.204 C 9.881 14.204 9.72 14.242 9.574 14.314 L 5.814 16.314 L 6.534 12.114 C 6.56 11.955 6.547 11.792 6.497 11.638 C 6.446 11.485 6.359 11.347 6.244 11.234 L 3.244 8.234 L 7.454 7.624 C 7.616 7.602 7.77 7.54 7.902 7.444 C 8.035 7.348 8.142 7.221 8.214 7.074 L 9.994 3.264 L 11.874 7.084 C 11.946 7.231 12.053 7.358 12.185 7.454 C 12.318 7.55 12.472 7.612 12.634 7.634 L 16.844 8.244 L 13.844 11.234 Z\" fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"matrix(1 0 0 1 2.006 2.436)\"/>"
  },
  "UserCircle": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-40 -37)\"><rect x=\"40\" y=\"37\" width=\"24\" height=\"24\" rx=\"12\" fill=\"#FFEBDD\"></rect><path d=\"M55.8191 53.9091V52.8182C55.8191 52.2395 55.5892 51.6846 55.18 51.2754C54.7708 50.8662 54.2158 50.6364 53.6371 50.6364H50.364C49.7852 50.6364 49.2302 50.8662 48.821 51.2754C48.4118 51.6846 48.1819 52.2395 48.1819 52.8182V53.9091M54.1826 46.2727C54.1826 47.4777 53.2056 48.4545 52.0005 48.4545C50.7954 48.4545 49.8184 47.4777 49.8184 46.2727C49.8184 45.0677 50.7954 44.0909 52.0005 44.0909C53.2056 44.0909 54.1826 45.0677 54.1826 46.2727Z\" stroke=\"#F46600\" stroke-width=\"1.09091\" stroke-linecap=\"round\"></path></g>"
  },
  "CheckCircle": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-116 -37)\"><rect x=\"117\" y=\"38\" width=\"22\" height=\"22\" rx=\"11\" stroke=\"#F46600\" stroke-width=\"2\"></rect><path d=\"M132.445 45.6667L126.335 51.7773L123.557 48.9997\" stroke=\"#F46600\" stroke-width=\"2.66667\" stroke-linecap=\"round\"></path></g>"
  },
  "UserOutline": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-192 -37)\"><path d=\"M211 58V56C211 54.9391 210.578 53.9217 209.828 53.1716C209.078 52.4214 208.06 52 206.999 52H200.999C199.938 52 198.92 52.4214 198.17 53.1716C197.42 53.9217 196.998 54.9391 196.998 56V58M207.999 44C207.999 46.2091 206.208 48 203.999 48C201.789 48 199.998 46.2091 199.998 44C199.998 41.7909 201.789 40 203.999 40C206.208 40 207.999 41.7909 207.999 44Z\" stroke=\"#F46600\" stroke-width=\"3\" stroke-linecap=\"round\"></path></g>"
  },
  "User": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-268 -37)\"><path d=\"M277.34 50.1289C278.153 50.501 279.051 50.7129 280 50.7129C280.949 50.7128 281.85 50.501 282.66 50.1289H283.27C285.977 50.1292 288.173 52.3259 288.173 55.0332V56.5508C288.173 57.5177 287.389 58.3026 286.422 58.3027H273.577C272.61 58.3025 271.826 57.5176 271.826 56.5508V55.0332C271.826 52.3257 274.023 50.1289 276.73 50.1289H277.34ZM280 39.6934C282.379 39.6934 284.307 41.6212 284.307 44C284.307 46.3788 282.379 48.3066 280 48.3066C277.621 48.3066 275.693 46.3788 275.693 44C275.693 41.6213 277.621 39.6934 280 39.6934Z\" fill=\"#F46600\"></path></g>"
  },
  "Users": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-344 -37)\"><rect x=\"344\" y=\"37\" width=\"24\" height=\"24\" rx=\"12\" fill=\"#FFEBDD\"></rect><path d=\"M358.545 54.7273V53.4546C358.545 52.7795 358.277 52.132 357.8 51.6546C357.322 51.1773 356.675 50.9091 356 50.9091H352.181C351.506 50.9091 350.859 51.1773 350.381 51.6546C349.904 52.132 349.635 52.7795 349.635 53.4546V54.7273M358.545 43.3541C359.091 43.4957 359.575 43.8144 359.92 44.2604C360.265 44.7063 360.452 45.2543 360.452 45.8181C360.452 46.382 360.265 46.93 359.92 47.3759C359.575 47.8219 359.091 48.1406 358.545 48.2821M362.364 54.7272V53.4545C362.363 52.8905 362.176 52.3426 361.83 51.8969C361.485 51.4511 361.001 51.1327 360.455 50.9918M356.636 45.8182C356.636 47.224 355.496 48.3636 354.09 48.3636C352.684 48.3636 351.545 47.224 351.545 45.8182C351.545 44.4124 352.684 43.2727 354.09 43.2727C355.496 43.2727 356.636 44.4124 356.636 45.8182Z\" stroke=\"#F46600\" stroke-width=\"1.09091\" stroke-linecap=\"round\"></path></g>"
  },
  "Check": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-420 -37)\"><path d=\"M439.999 43L429 53.9992L424.001 48.9996\" stroke=\"#F46600\" stroke-width=\"4.8\" stroke-linecap=\"round\"></path></g>"
  },
  "Brain": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-496 -37)\"><path d=\"M501.846 42.5507C503.016 41.452 504.8 41.452 505.97 42.5507L507.43 43.9218H507.431L509.81 46.1552L509.927 46.2714C510.003 46.3503 510.073 46.4335 510.14 46.5194C510.185 46.5776 510.227 46.638 510.268 46.6991C510.288 46.7286 510.308 46.7579 510.327 46.788C510.364 46.8486 510.4 46.9106 510.433 46.9735C510.447 46.9991 510.46 47.0247 510.473 47.0507C510.507 47.1185 510.538 47.1876 510.567 47.2577C510.577 47.2827 510.587 47.3077 510.597 47.3329C510.627 47.4099 510.653 47.488 510.677 47.5673C510.683 47.5864 510.688 47.6056 510.694 47.6249C510.715 47.6991 510.734 47.7738 510.75 47.8495C510.757 47.8841 510.762 47.9191 510.768 47.954C510.781 48.0281 510.793 48.1025 510.8 48.1776C510.802 48.1991 510.803 48.2206 510.805 48.2421C510.811 48.3182 510.815 48.3947 510.816 48.4716C510.816 48.4853 510.818 48.4989 510.818 48.5126V53.8173L510.814 53.9814C510.813 53.9974 510.81 54.0133 510.809 54.0292C510.805 54.0962 510.799 54.1626 510.791 54.2284C510.787 54.2529 510.785 54.2774 510.782 54.3017C510.772 54.3709 510.757 54.439 510.743 54.5067C510.735 54.5414 510.729 54.5761 510.72 54.6103C510.705 54.6714 510.687 54.7313 510.668 54.7909C510.646 54.8648 510.62 54.9373 510.592 55.0087C510.585 55.0286 510.577 55.0486 510.569 55.0683C510.539 55.1396 510.506 55.2088 510.472 55.2773C510.46 55.302 510.448 55.3271 510.435 55.3515C510.2 55.7924 509.869 56.1697 509.468 56.4511C509.455 56.4602 509.441 56.4676 509.428 56.4765C509.364 56.5204 509.298 56.5626 509.23 56.6015C509.198 56.6201 509.164 56.6358 509.13 56.6532C509.08 56.6797 509.03 56.7068 508.978 56.7304C508.908 56.7622 508.837 56.7918 508.764 56.8183C508.754 56.822 508.743 56.8254 508.733 56.829C508.652 56.8576 508.569 56.8827 508.485 56.9042C508.478 56.9059 508.471 56.9074 508.464 56.9091C508.379 56.9303 508.293 56.9492 508.205 56.9628C508.196 56.9642 508.186 56.9644 508.177 56.9657C508.09 56.9785 508.001 56.9881 507.912 56.9931C507.91 56.9932 507.908 56.994 507.907 56.994L507.906 56.9931C507.853 56.9959 507.8 56.9989 507.747 56.9989H506.979C506.131 56.9989 505.444 56.2866 505.444 55.4081V53.0214C505.444 52.1432 504.756 51.4308 503.909 51.4306C503.061 51.4306 502.373 52.1431 502.373 53.0214V55.4081C502.372 56.2866 501.685 56.9989 500.837 56.9989H500.07C498.374 56.9988 497 55.5743 497 53.8173V48.5116C497 47.6137 497.366 46.7572 498.008 46.1542L501.846 42.5507ZM509.973 41.7294C511.101 40.7567 512.717 40.7569 513.845 41.7294L517.684 45.0399C518.401 45.6588 518.818 46.588 518.818 47.5692V53.7401C518.818 55.5401 517.443 56.9989 515.748 56.9989H511.517C512.22 56.1259 512.636 55.0108 512.636 53.8173V48.5126C512.636 47.2106 512.139 45.952 511.24 45.0136L511.054 44.83L508.815 42.7274L509.973 41.7294Z\" fill=\"#F46600\"></path></g>"
  },
  "UserNetwork": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-572 -37)\"><path d=\"M590 58C590 55.8783 589.158 53.8434 587.657 52.3431C586.157 50.8429 584.122 50 582 50M582 50C579.878 50 577.843 50.8429 576.342 52.3431C574.842 53.8434 573.999 55.8783 573.999 58M582 50C584.761 50 587 47.7614 587 45C587 42.2386 584.761 40 582 40C579.238 40 576.999 42.2386 576.999 45C576.999 47.7614 579.238 50 582 50ZM594.001 57.0002C594.001 53.6302 592 50.5002 590 49.0002C590.658 48.507 591.183 47.8593 591.531 47.1145C591.878 46.3696 592.037 45.5507 591.992 44.73C591.948 43.9093 591.702 43.1123 591.276 42.4094C590.85 41.7065 590.257 41.1195 589.55 40.7002\" stroke=\"#F46600\" stroke-width=\"3\" stroke-linecap=\"round\"></path></g>"
  },
  "Book": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-648 -37)\"><path d=\"M663.465 40.9995C665.379 40.9997 666.93 42.4323 666.93 44.1997V53.8013C666.93 55.5685 665.379 57.0013 663.465 57.0015H655.668C654.233 57.0013 653.07 55.9266 653.07 54.6011V43.3989C653.07 42.0735 654.233 40.9996 655.668 40.9995H663.465ZM665.198 53.3726C664.688 53.6448 664.096 53.8012 663.465 53.8013H655.668C655.19 53.8014 654.802 54.1593 654.802 54.6011C654.802 55.0428 655.19 55.4007 655.668 55.4009H663.465C664.422 55.4007 665.197 54.6847 665.198 53.8013V53.3726ZM657.401 47.3999C656.923 47.4001 656.535 47.7581 656.535 48.1997C656.535 48.6415 656.923 49.0003 657.401 49.0005H660C660.478 49.0005 660.866 48.6416 660.866 48.1997C660.866 47.758 660.478 47.3999 660 47.3999H657.401ZM657.401 44.1997C656.923 44.1999 656.535 44.5578 656.535 44.9995C656.535 45.4413 656.923 45.7992 657.401 45.7993H662.599C663.077 45.7991 663.465 45.4413 663.465 44.9995C663.465 44.5578 663.077 44.1999 662.599 44.1997H657.401Z\" fill=\"#F46600\"></path></g>"
  },
  "Diamond": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-724 -37)\"><rect x=\"724\" y=\"37\" width=\"24\" height=\"24\" rx=\"12\" fill=\"white\"></rect><path d=\"M742 46.3121C742 46.2866 742 46.2611 741.974 46.2102C741.974 46.2102 741.974 46.2102 741.974 46.1847C741.949 46.1592 741.949 46.1083 741.923 46.0828L739.6 43.1529C739.523 43.051 739.421 43 739.294 43H736H734.519H732.732C732.604 43 732.502 43.051 732.426 43.1529L730.077 46.0828C730.051 46.1083 730.026 46.1338 730.026 46.1847V46.2102C730 46.2357 730 46.2611 730 46.3121V46.3376C730 46.3631 730 46.414 730.026 46.4395V46.465C730.026 46.4904 730.051 46.5414 730.077 46.5669L735.694 54.8471C735.694 54.8471 735.694 54.8471 735.719 54.8726C735.745 54.8981 735.77 54.9236 735.77 54.9236L735.796 54.949C735.821 54.9745 735.847 54.9745 735.872 54.9745H735.898C735.923 54.9745 735.974 55 736 55C736.026 55 736.077 55 736.102 54.9745H736.128C736.153 54.9745 736.179 54.949 736.204 54.949C736.204 54.949 736.23 54.949 736.23 54.9236C736.255 54.8981 736.281 54.8726 736.281 54.8726C736.281 54.8726 736.281 54.8726 736.306 54.8471L741.923 46.5669C741.949 46.5414 741.949 46.4904 741.974 46.465V46.4395C741.974 46.414 742 46.3885 742 46.3376C742 46.3376 742 46.3376 742 46.3121ZM733.191 46.7197L734.902 52.2994L731.098 46.7197H733.191ZM736 43.7898H737.2L737.966 45.9554H734.009L734.774 43.7898H736ZM738.017 46.7197L736 53.3185L733.983 46.7197H738.017ZM738.809 46.7197H740.902L737.098 52.2994L738.809 46.7197ZM740.826 45.9554H738.809L738.043 43.7898H739.115L740.826 45.9554ZM732.911 43.7898H733.983L733.217 45.9554H731.2L732.911 43.7898Z\" fill=\"#F46600\"></path></g>"
  },
  "MessageCircle": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-40 -113)\"><rect x=\"40\" y=\"113\" width=\"24\" height=\"24\" rx=\"12\" fill=\"#FFEBDD\"></rect>\n<g clip-path=\"url(#clip0_960_890)\">\n<path d=\"M47.2719 127.629C47.3174 127.443 47.3 127.249 47.222 127.072C46.6793 126.059 46.5518 124.906 46.8618 123.816C47.1719 122.726 47.8997 121.77 48.9168 121.116C49.934 120.462 51.175 120.153 52.4211 120.242C53.6671 120.331 54.8381 120.814 55.7274 121.604C56.6166 122.395 57.167 123.443 57.2815 124.563C57.396 125.683 57.0671 126.804 56.353 127.727C55.6389 128.65 54.5854 129.317 53.3783 129.609C52.1713 129.901 50.8883 129.801 49.7557 129.325C49.5698 129.261 49.3678 129.246 49.1728 129.281L47.3626 129.757C47.2753 129.778 47.1835 129.778 47.0959 129.758C47.0083 129.738 46.9279 129.699 46.8622 129.643C46.7966 129.587 46.7479 129.517 46.7207 129.439C46.6935 129.362 46.6888 129.279 46.707 129.2L47.2719 127.629Z\" stroke=\"#F46600\" stroke-width=\"1.09091\" stroke-linecap=\"round\"></path>\n</g></g>"
  },
  "Headphones": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-116 -113)\"><path d=\"M121 125C121 121.134 124.134 118 128 118C131.866 118 135 121.134 135 125V126C132.791 126 131 127.791 131 130V131C131 132.657 132.343 134 134 134C135.657 134 137 132.657 137 131V125C137 120.367 133.5 116.552 129 116.055V116H128C123.029 116 119 120.029 119 125V131C119 132.657 120.343 134 122 134C123.657 134 125 132.657 125 131V130C125 127.791 123.209 126 121 126V125Z\" fill=\"#F46600\"></path></g>"
  },
  "ChevronRight": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-192 -113)\"><path d=\"M201 131L207 125L201 119\" stroke=\"#F46600\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></g>"
  },
  "StarOutline": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-268 -113)\"><path d=\"M280 116.035C280.049 116.036 280.1 116.051 280.149 116.084C280.199 116.118 280.246 116.171 280.278 116.243L280.279 116.247L282.619 121.417L282.751 121.712L283.071 121.763L288.292 122.592L288.31 122.596L288.33 122.597C288.379 122.602 288.433 122.622 288.483 122.664C288.529 122.704 288.568 122.761 288.594 122.832C288.609 122.908 288.607 122.987 288.586 123.06C288.563 123.14 288.522 123.205 288.474 123.249L288.458 123.263L288.445 123.278L284.656 127.278L284.452 127.493L284.5 127.785L285.417 133.465V133.466L285.418 133.473C285.433 133.557 285.425 133.645 285.397 133.722C285.383 133.76 285.364 133.794 285.343 133.824L285.273 133.897L285.271 133.899C285.216 133.942 285.157 133.961 285.103 133.96H285.099C285.066 133.96 285.029 133.951 284.994 133.929L284.976 133.919L280.297 131.249L280 131.079L279.703 131.249L275.024 133.919L275.006 133.929C274.956 133.96 274.903 133.972 274.854 133.969C274.804 133.966 274.751 133.946 274.702 133.907C274.651 133.866 274.606 133.806 274.579 133.727C274.551 133.648 274.544 133.56 274.561 133.476L274.563 133.466L274.565 133.455L275.482 127.776L275.53 127.483L275.326 127.267L271.541 123.271C271.497 123.222 271.462 123.158 271.444 123.08C271.426 123.003 271.428 122.921 271.449 122.845C271.472 122.77 271.513 122.709 271.559 122.666C271.606 122.623 271.658 122.601 271.707 122.593L271.71 122.592L276.93 121.752L277.249 121.702L277.381 121.408L279.721 116.247L279.722 116.243C279.754 116.171 279.801 116.118 279.851 116.084C279.9 116.051 279.952 116.035 280 116.035ZM279.449 118.463L277.82 122.264C277.792 122.326 277.752 122.375 277.709 122.409C277.667 122.442 277.622 122.461 277.58 122.467H277.576L273.713 123.077L272.61 123.251L273.365 124.076L276.118 127.076L276.124 127.082C276.163 127.125 276.197 127.181 276.217 127.248C276.237 127.315 276.243 127.386 276.233 127.456L275.573 131.657L275.376 132.901L276.466 132.269L279.9 130.278C279.948 130.252 279.997 130.241 280.045 130.241C280.094 130.241 280.144 130.252 280.192 130.278L283.625 132.269L284.715 132.901L284.519 131.657L283.859 127.456C283.849 127.386 283.855 127.315 283.875 127.248C283.895 127.181 283.928 127.125 283.968 127.082L283.973 127.077L286.726 124.086L287.485 123.262L286.378 123.087L282.516 122.477H282.512C282.47 122.47 282.425 122.452 282.382 122.418C282.34 122.385 282.3 122.336 282.272 122.274V122.273L280.546 118.453L279.986 117.21L279.449 118.463Z\" fill=\"#F46600\" stroke=\"#F46600\" stroke-width=\"1.2\"></path></g>"
  },
  "ChevronRightSmall": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-344 -113)\"><path d=\"M352.822 131L359 124.822L352.822 118.644\" stroke=\"#F46600\" stroke-width=\"2.39539\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></g>"
  },
  "Mail": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-420 -113)\"><path d=\"M424 124.116C424 123.439 424.714 122.971 425.317 123.278C427.273 124.269 429.205 125.309 431.188 126.234C431.639 126.446 432.349 126.458 432.795 126.244C434.554 125.409 436.287 124.518 438.103 123.585C438.97 123.14 439.999 123.77 440 124.745V128.019C440 129.822 438.537 131.285 436.734 131.285H427.265C425.462 131.284 424 129.822 424 128.019V124.116ZM437.592 118.715C439.097 118.715 439.747 119.563 439.747 120.48C439.747 120.667 439.741 120.993 438.174 121.794C436.412 122.695 434.626 123.556 432.893 124.513C432.232 124.879 431.731 124.843 431.086 124.492C429.347 123.544 427.566 122.674 425.801 121.773C424.337 121.025 424.252 120.729 424.252 120.48C424.252 119.294 425.213 118.715 426.014 118.715H437.592Z\" fill=\"#F46600\"></path></g>"
  },
  "Phone": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-496 -113)\"><path d=\"M514 129.799L506.735 127.34L506.734 116.599\" stroke=\"#F46600\" stroke-width=\"3.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></g>"
  },
  "Translate": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-572 -113)\"><path d=\"M587.415 125.092C587.588 125.095 587.763 125.103 587.865 125.115C588.283 125.166 588.573 125.246 588.941 125.413C589.216 125.538 589.445 125.683 589.677 125.88L589.833 126.012L589.866 125.928C589.912 125.807 590.071 125.597 590.192 125.494C590.386 125.33 590.572 125.281 591.006 125.281C591.381 125.281 591.566 125.336 591.752 125.5C591.873 125.606 591.95 125.737 591.982 125.894C591.994 125.952 592.001 127.09 592 129.059C592 132.382 592.005 132.225 591.9 132.391C591.84 132.485 591.69 132.615 591.584 132.665C591.449 132.729 591.277 132.753 590.938 132.753C590.765 132.753 590.577 132.745 590.522 132.735C590.389 132.712 590.233 132.644 590.128 132.565C589.969 132.444 589.822 132.174 589.822 131.999C589.822 131.962 589.82 131.931 589.817 131.931C589.811 131.934 589.721 132.014 589.614 132.11C589.034 132.633 588.217 132.928 587.351 132.928C586.644 132.928 585.99 132.766 585.43 132.45C584.583 131.973 583.98 131.199 583.698 130.252H583.695C583.686 130.223 583.68 130.193 583.671 130.163C583.661 130.126 583.651 130.09 583.642 130.053C583.611 129.929 583.584 129.802 583.565 129.673C583.546 129.543 583.538 129.226 583.542 128.934H583.544C583.547 128.724 583.553 128.527 583.567 128.422C583.605 128.137 583.664 127.875 583.749 127.616H583.746C583.77 127.54 583.797 127.464 583.826 127.389C583.901 127.192 584.131 126.769 584.259 126.593C584.898 125.712 585.812 125.21 586.978 125.1C587.071 125.091 587.242 125.089 587.415 125.092ZM587.298 126.795C586.978 126.845 586.681 126.965 586.435 127.145C585.769 127.631 585.478 128.655 585.72 129.66C585.945 130.591 586.679 131.16 587.653 131.16C588.411 131.16 589.046 130.805 589.378 130.194C589.478 130.011 589.541 129.842 589.608 129.58C589.653 129.402 589.658 129.35 589.66 129.009C589.661 128.614 589.645 128.481 589.566 128.186C589.388 127.527 588.912 127.044 588.252 126.855C587.968 126.774 587.589 126.75 587.298 126.795ZM584.561 117.072C586.137 117.072 587.414 118.252 587.415 119.708V123.603C587.248 123.6 587.083 123.601 586.947 123.608L586.813 123.618C585.283 123.763 584.002 124.417 583.096 125.534L582.919 125.764C582.743 126.007 582.498 126.446 582.358 126.764L582.305 126.891C582.213 127.132 582.14 127.372 582.082 127.616H578.14C577.746 127.616 577.427 127.911 577.426 128.274C577.426 128.638 577.746 128.934 578.14 128.934H581.929C581.929 128.977 581.927 129.019 581.927 129.059C581.927 129.298 581.933 129.648 581.967 129.877L582.02 130.174C582.025 130.2 582.033 130.226 582.039 130.252H578.14C576.958 130.252 576 129.366 576 128.274V119.049C576 117.957 576.958 117.072 578.14 117.072H584.561ZM579.567 122.344C579.173 122.344 578.853 122.639 578.853 123.003C578.853 123.367 579.173 123.662 579.567 123.662H581.708C582.101 123.662 582.42 123.367 582.42 123.003C582.42 122.639 582.101 122.344 581.708 122.344H579.567ZM579.567 119.708C579.173 119.708 578.853 120.003 578.853 120.367C578.853 120.731 579.173 121.026 579.567 121.026H583.847C584.241 121.026 584.561 120.731 584.561 120.367C584.561 120.003 584.241 119.708 583.847 119.708H579.567Z\" fill=\"#F46600\"></path></g>"
  },
  "Rocket": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-648 -113)\"><path d=\"M654.204 128.596L652.845 129.775C649.603 130.036 647.113 130.651 646.292 131.409C646.101 131.236 646 131.051 646 130.863C646 129.75 649.513 128.818 654.201 128.596\" fill=\"#B8B0F2\"></path><path d=\"M647.915 132.207C648.089 132.263 648.277 132.318 648.475 132.37C648.277 132.318 648.089 132.266 647.915 132.207Z\" fill=\"#B8B0F2\"></path><path d=\"M664.262 132.367C664.461 132.315 664.649 132.259 664.822 132.207C664.649 132.263 664.461 132.318 664.262 132.367Z\" fill=\"#B8B0F2\"></path><path d=\"M666.74 130.864C666.74 131.051 666.639 131.236 666.448 131.41C665.7 130.714 663.543 130.14 660.698 129.848L661.578 128.86C664.667 129.26 666.74 130.008 666.74 130.864Z\" fill=\"#B8B0F2\"></path><path d=\"M652.844 129.775L649.579 132.616C649.474 132.599 649.37 132.575 649.269 132.554C649.071 132.512 648.88 132.467 648.695 132.425C648.688 132.425 648.681 132.422 648.678 132.422C648.612 132.404 648.542 132.387 648.48 132.369C648.281 132.317 648.093 132.262 647.92 132.209C647.746 132.154 647.579 132.095 647.422 132.036C647.283 131.983 647.151 131.928 647.026 131.872C646.96 131.841 646.901 131.813 646.841 131.782C646.8 131.761 646.761 131.74 646.723 131.716C646.709 131.709 646.692 131.698 646.681 131.691C646.629 131.663 646.581 131.632 646.535 131.601C646.501 131.576 646.466 131.552 646.431 131.528C646.379 131.49 646.334 131.451 646.295 131.413C647.116 130.651 649.606 130.039 652.848 129.778\" fill=\"#7B7D9E\"></path><path d=\"M666.446 131.41C666.404 131.449 666.359 131.487 666.306 131.525C666.275 131.549 666.24 131.574 666.206 131.598C666.16 131.629 666.112 131.661 666.06 131.689C666.046 131.696 666.028 131.706 666.018 131.713C665.98 131.734 665.941 131.755 665.9 131.779C665.84 131.81 665.781 131.842 665.715 131.869C665.59 131.925 665.458 131.981 665.319 132.033C665.166 132.092 664.999 132.151 664.821 132.207C664.648 132.262 664.46 132.318 664.261 132.37C664.195 132.388 664.129 132.405 664.063 132.422C664.056 132.422 664.053 132.422 664.046 132.429C663.862 132.471 663.67 132.516 663.472 132.558C663.371 132.579 663.263 132.6 663.155 132.624C662.968 132.659 662.773 132.694 662.575 132.729C662.436 132.753 662.289 132.774 662.143 132.795C661.91 132.829 661.667 132.864 661.417 132.895C661.044 132.944 660.658 132.986 660.258 133.021C660.123 133.035 659.991 133.045 659.855 133.055C659.817 133.055 659.778 133.062 659.74 133.062C659.507 133.08 659.267 133.097 659.027 133.115C658.885 133.122 658.742 133.132 658.599 133.135C658.457 133.142 658.314 133.149 658.168 133.153C658.081 133.153 657.994 133.16 657.911 133.163C657.862 133.163 657.813 133.163 657.761 133.163L660.704 129.849C663.548 130.144 665.705 130.718 666.453 131.41\" fill=\"#7B7D9E\"></path><path d=\"M673.015 121.776C672.956 121.835 672.89 121.887 672.827 121.936C672.761 121.988 672.699 122.037 672.629 122.086C672.497 122.176 672.361 122.263 672.236 122.339C672.097 122.419 671.955 122.499 671.812 122.579C671.694 122.646 671.579 122.705 671.457 122.767C671.301 122.844 671.144 122.927 670.984 123C670.845 123.066 670.56 123.132 670.452 123.247C670.452 123.247 667.426 126.496 665.273 124.704L661.58 128.864L660.7 129.852L657.758 133.166C657.758 133.166 657.737 133.166 657.726 133.166C657.702 133.166 657.674 133.166 657.646 133.166C657.577 133.166 657.507 133.166 657.434 133.173C657.392 133.173 657.354 133.173 657.312 133.173C657.215 133.173 657.114 133.173 657.017 133.173C656.902 133.173 656.787 133.173 656.669 133.173C656.37 133.173 656.071 133.173 655.782 133.173H655.584C655.532 133.173 655.483 133.173 655.434 133.173C655.393 133.173 655.354 133.173 655.313 133.173C654.836 133.166 654.349 133.145 653.866 133.118C653.706 133.111 653.549 133.1 653.396 133.086C653.264 133.079 653.135 133.069 653.007 133.058C652.951 133.052 652.895 133.052 652.843 133.045C652.749 133.038 652.652 133.027 652.562 133.02C651.936 132.961 651.337 132.895 650.795 132.819C650.767 132.812 650.736 132.812 650.704 132.805C650.53 132.777 650.357 132.749 650.197 132.728C650.141 132.718 650.089 132.711 650.033 132.7C649.991 132.693 649.953 132.683 649.915 132.679C649.849 132.669 649.79 132.655 649.731 132.645C649.706 132.645 649.678 132.638 649.657 132.631C649.633 132.624 649.609 132.62 649.584 132.617L652.85 129.775L654.207 128.596L662.78 121.143L660.533 120.983C660.13 120.955 659.775 120.698 659.625 120.322L658.627 117.825H660.968C661.329 117.825 661.677 117.971 661.931 118.225L663.809 120.298L664.522 119.672L663.656 118.75L662.981 118.034C662.748 117.763 662.689 117.324 663.082 117.217L663.764 117.029C664.206 116.907 664.4 117.182 664.64 117.7C664.64 117.7 664.64 117.707 664.647 117.717C664.647 117.724 664.658 117.742 664.665 117.759C664.703 117.843 664.776 117.999 664.856 118.183C665.037 118.576 665.26 119.07 665.26 119.074C665.232 119.008 669.057 119.366 671.596 119.536L672.035 119.975C672.125 119.895 672.24 119.86 672.354 119.867C672.473 119.874 672.581 119.929 672.661 120.016L673.144 119.616C673.161 119.616 673.179 119.616 673.196 119.616C673.346 119.616 673.537 119.766 673.62 119.978C673.853 120.754 673.499 121.334 673.012 121.78\" fill=\"#F46600\"></path><path d=\"M666.169 120.907C666.109 120.629 666.162 120.344 666.315 120.107C666.468 119.867 666.708 119.704 666.986 119.645C667.56 119.523 668.127 119.888 668.248 120.462L667.64 120.594C667.588 120.354 667.351 120.205 667.115 120.253C667 120.278 666.899 120.347 666.836 120.445C666.774 120.542 666.749 120.66 666.777 120.778L666.169 120.911V120.907Z\" fill=\"black\"></path><path d=\"M673.148 119.613L672.661 120.017C672.581 119.926 672.473 119.874 672.355 119.867C672.24 119.86 672.122 119.899 672.035 119.975L671.597 119.537C671.813 119.349 672.112 119.227 672.393 119.245C672.675 119.266 672.953 119.401 673.141 119.617\" fill=\"black\"></path><path d=\"M672.229 122.336C672.486 122.183 672.768 121.998 673.015 121.776C671.794 122.179 670.727 121.776 670.667 121.755L670.441 122.336C670.487 122.353 671.033 122.562 671.805 122.576C671.947 122.499 672.09 122.419 672.229 122.336Z\" fill=\"black\"></path><path d=\"M662.983 118.034L663.658 118.75C663.71 118.757 663.762 118.76 663.814 118.76C664.238 118.76 664.618 118.534 664.864 118.183C664.746 117.919 664.645 117.7 664.645 117.7C664.405 117.181 664.211 116.91 663.769 117.032L663.084 117.22C662.694 117.328 662.75 117.766 662.983 118.04\" fill=\"black\"></path><path d=\"M657.77 126.851L660.26 126.02L661.71 123.116L660.792 122.869L657.046 126.128L657.77 126.851Z\" fill=\"black\"></path><path d=\"M655.269 129.473L654.618 131.358L650.403 131.904L654.855 128.033L655.269 129.473Z\" fill=\"black\"></path><path d=\"M660.467 127.473L657.354 128.715L656.523 131.413L658.836 131.946L662.046 128.332L660.467 127.473Z\" fill=\"black\"></path></g>"
  },
  "Calendar": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-724 -113)\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M730.955 113C731.652 113 732.216 113.566 732.216 114.263V115.526H739.784V114.263C739.784 113.566 740.348 113 741.045 113C741.742 113 742.306 113.566 742.306 114.263V115.526C745.093 115.526 747.351 117.788 747.351 120.579V131.947C747.351 134.738 745.093 137 742.306 137H729.694C726.907 137 724.649 134.738 724.649 131.947V120.579C724.649 117.788 726.907 115.526 729.694 115.526V114.263C729.694 113.566 730.258 113 730.955 113ZM729.694 121.842C729.694 121.144 730.258 120.579 730.955 120.579H741.045C741.742 120.579 742.306 121.144 742.306 121.842C742.306 122.54 741.742 123.105 741.045 123.105H730.955C730.258 123.105 729.694 122.54 729.694 121.842Z\" fill=\"#F46600\"></path></g>"
  },
  "BookOpen": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-40 -189)\"><path d=\"M42 196.992C42 194.433 44.3693 192.532 46.8672 193.087L51 194.004V210.053L45.1318 208.75C43.302 208.343 42.0002 206.72 42 204.845V196.992ZM57.1328 193.087C59.6308 192.531 62.001 194.433 62.001 196.992V204.845C62.0008 206.72 60.6982 208.343 58.8682 208.75L53.001 210.053V194.004L57.1328 193.087Z\" fill=\"#F46600\"></path></g>"
  },
  "ChevronDown": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-116 -189)\"><path d=\"M119.724 197.276L127.638 205.19L135.552 197.276\" stroke=\"#F46600\" stroke-width=\"2.11034\" stroke-linejoin=\"round\"></path></g>"
  },
  "Lightbulb": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-192 -189)\"><path d=\"M204.952 206.375C205.392 206.375 205.717 206.674 205.717 207.032C205.717 207.554 205.535 208.054 205.214 208.423C204.892 208.792 204.456 209 204.001 209C203.546 209 203.109 208.793 202.787 208.423C202.465 208.054 202.285 207.554 202.285 207.032C202.285 206.665 202.708 206.375 203.07 206.375H204.952ZM204 196.958C204.832 196.958 205.642 197.231 206.317 197.739C206.992 198.246 207.496 198.963 207.76 199.787C208.023 200.61 208.031 201.499 207.783 202.328C207.647 202.782 206.921 203.822 206.372 204.521C206.056 204.924 205.567 205.13 205.054 205.13H202.883C202.398 205.13 201.937 204.942 201.64 204.559C201.092 203.851 200.343 202.747 200.218 202.328C199.97 201.499 199.977 200.61 200.24 199.787C200.503 198.963 201.008 198.246 201.682 197.739C202.357 197.231 203.168 196.958 204 196.958ZM197.82 200.255C198.017 200.256 198.206 200.334 198.349 200.475C198.493 200.616 198.579 200.809 198.591 201.014C198.602 201.219 198.538 201.421 198.412 201.579C198.285 201.736 198.105 201.838 197.91 201.862L197.82 201.868H197.048C196.851 201.867 196.661 201.789 196.518 201.648C196.375 201.507 196.289 201.314 196.277 201.109C196.266 200.904 196.33 200.702 196.456 200.544C196.582 200.387 196.761 200.286 196.957 200.261L197.048 200.255H197.82ZM210.953 200.255C211.15 200.256 211.339 200.334 211.482 200.475C211.625 200.616 211.712 200.809 211.723 201.014C211.735 201.219 211.671 201.421 211.545 201.579C211.418 201.736 211.238 201.838 211.043 201.862L210.953 201.868H210.18C209.984 201.867 209.794 201.789 209.651 201.648C209.508 201.507 209.421 201.314 209.41 201.109C209.398 200.904 209.462 200.702 209.589 200.544C209.715 200.387 209.894 200.286 210.09 200.261L210.18 200.255H210.953ZM208.92 195.095C209.116 195.089 209.307 195.161 209.454 195.296C209.601 195.432 209.694 195.621 209.713 195.825C209.731 196.029 209.674 196.232 209.554 196.394L209.49 196.47L208.95 197.035C208.811 197.179 208.624 197.263 208.427 197.269C208.231 197.275 208.04 197.203 207.893 197.068C207.746 196.932 207.654 196.743 207.635 196.54C207.617 196.336 207.674 196.132 207.794 195.97L207.857 195.895L208.398 195.331C208.537 195.186 208.724 195.102 208.92 195.095ZM199.008 195.096C199.195 195.084 199.381 195.144 199.53 195.264L199.602 195.332L200.143 195.896C200.282 196.041 200.362 196.235 200.368 196.44C200.374 196.645 200.305 196.844 200.176 196.998C200.046 197.151 199.864 197.248 199.669 197.267C199.473 197.286 199.278 197.227 199.123 197.102L199.051 197.036L198.51 196.471C198.365 196.32 198.284 196.115 198.284 195.901C198.284 195.687 198.365 195.483 198.51 195.332C198.643 195.193 198.82 195.109 199.008 195.096ZM204.001 193C204.19 193 204.372 193.072 204.513 193.204C204.655 193.335 204.745 193.515 204.767 193.711L204.773 193.806V194.612C204.773 194.817 204.697 195.015 204.562 195.165C204.427 195.314 204.242 195.404 204.046 195.417C203.849 195.429 203.656 195.362 203.505 195.23C203.354 195.098 203.256 194.911 203.233 194.707L203.228 194.612V193.806C203.228 193.592 203.309 193.387 203.454 193.236C203.599 193.085 203.796 193 204.001 193Z\" fill=\"#F46600\"></path></g>"
  },
  "UsersAdd": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-268 -189)\"><path d=\"M276.127 201.418C276.24 201.397 276.34 201.426 276.438 201.484C276.54 201.545 276.643 201.605 276.751 201.65C276.956 201.735 277.162 201.819 277.373 201.886C277.557 201.944 277.748 201.981 277.937 202.024C278.409 202.133 278.887 202.141 279.367 202.129C279.492 202.125 279.618 202.119 279.742 202.105C279.885 202.089 280.029 202.066 280.17 202.04C280.295 202.016 280.419 201.986 280.542 201.955C280.646 201.929 280.75 201.902 280.851 201.868C280.959 201.832 281.064 201.787 281.169 201.746C281.261 201.71 281.354 201.678 281.443 201.636C281.567 201.579 281.685 201.505 281.812 201.456C281.876 201.431 281.955 201.437 282.026 201.44C282.098 201.444 282.169 201.464 282.241 201.473C282.323 201.484 282.406 201.49 282.489 201.503C282.599 201.519 282.71 201.537 282.82 201.56C282.953 201.588 283.087 201.619 283.218 201.656C283.315 201.683 283.41 201.719 283.504 201.757C283.649 201.814 283.793 201.87 283.934 201.935C284.036 201.982 284.133 202.042 284.232 202.096C284.373 202.174 284.504 202.267 284.636 202.359C284.938 202.569 285.205 202.819 285.444 203.1C285.582 203.262 285.711 203.434 285.829 203.612C285.98 203.841 286.115 204.08 286.212 204.341C286.279 204.52 286.345 204.701 286.404 204.884C286.447 205.019 286.482 205.158 286.512 205.298C286.539 205.42 286.557 205.544 286.572 205.669C286.65 206.314 286.601 206.964 286.607 207.611C286.609 207.849 286.547 208.079 286.451 208.3C286.328 208.581 286.148 208.814 285.917 209.004C285.768 209.126 285.601 209.214 285.419 209.279C285.201 209.358 284.978 209.375 284.75 209.375C282.842 209.374 280.935 209.374 279.028 209.374C277.073 209.374 275.119 209.374 273.165 209.373C272.982 209.373 272.808 209.325 272.637 209.258C272.479 209.195 272.334 209.112 272.202 209.005C272.059 208.889 271.934 208.753 271.829 208.598C271.74 208.469 271.67 208.329 271.621 208.179C271.582 208.065 271.555 207.945 271.533 207.826C271.514 207.728 271.503 207.627 271.502 207.528C271.499 207.07 271.497 206.611 271.504 206.152C271.507 205.979 271.532 205.805 271.553 205.632C271.569 205.502 271.591 205.372 271.619 205.244C271.644 205.124 271.677 205.005 271.713 204.887C271.757 204.748 271.803 204.609 271.857 204.474C271.92 204.317 271.987 204.16 272.065 204.011C272.147 203.853 272.243 203.702 272.338 203.552C272.395 203.461 272.458 203.374 272.526 203.292C272.644 203.148 272.761 203.003 272.891 202.872C273.147 202.613 273.424 202.379 273.731 202.187C273.897 202.083 274.068 201.984 274.244 201.898C274.39 201.826 274.547 201.775 274.7 201.718C274.799 201.68 274.899 201.643 275.001 201.615C275.112 201.585 275.225 201.566 275.337 201.544C275.448 201.522 275.558 201.501 275.669 201.483C275.734 201.473 275.8 201.469 275.865 201.46C275.952 201.447 276.04 201.434 276.127 201.418ZM287.299 194.493L288.699 194.494C288.913 194.495 289.121 194.534 289.318 194.625C289.435 194.679 289.554 194.731 289.663 194.801C289.837 194.912 289.982 195.062 290.111 195.227C290.211 195.356 290.288 195.499 290.349 195.65C290.403 195.782 290.453 195.917 290.468 196.061C290.481 196.179 290.497 196.297 290.498 196.415C290.501 196.825 290.499 197.235 290.499 197.644C290.499 197.976 290.414 198.287 290.263 198.577C290.177 198.743 290.071 198.897 289.938 199.027C289.761 199.202 289.56 199.341 289.332 199.438C289.181 199.502 289.028 199.544 288.869 199.565C288.804 199.574 288.738 199.584 288.673 199.584C288.247 199.585 287.821 199.586 287.395 199.584C287.337 199.583 287.294 199.603 287.251 199.64C286.982 199.877 286.71 200.112 286.441 200.348C286.275 200.494 286.109 200.64 285.947 200.79C285.824 200.902 285.683 200.953 285.524 200.926C285.366 200.898 285.252 200.799 285.197 200.641C285.177 200.584 285.17 200.519 285.169 200.457C285.168 200.119 285.169 199.781 285.17 199.443C285.171 199.382 285.117 199.373 285.085 199.355C284.853 199.226 284.656 199.052 284.494 198.841C284.381 198.694 284.283 198.532 284.228 198.35C284.182 198.198 284.141 198.043 284.108 197.887C284.091 197.809 284.092 197.726 284.091 197.645C284.09 197.255 284.087 196.865 284.091 196.475C284.094 196.249 284.11 196.022 284.189 195.806C284.242 195.661 284.305 195.521 284.385 195.388C284.52 195.166 284.697 194.986 284.903 194.838C285.067 194.72 285.248 194.638 285.441 194.577C285.661 194.507 285.884 194.49 286.111 194.492C286.507 194.495 286.903 194.493 287.299 194.493ZM279.084 192C279.211 191.998 279.338 192.018 279.464 192.03C279.525 192.036 279.585 192.045 279.645 192.055C279.734 192.07 279.824 192.08 279.911 192.104C280.064 192.147 280.217 192.196 280.368 192.248C280.466 192.281 280.564 192.318 280.657 192.364C280.795 192.432 280.933 192.504 281.064 192.586C281.321 192.747 281.559 192.933 281.774 193.153C282.001 193.386 282.208 193.636 282.367 193.924C282.464 194.099 282.547 194.284 282.633 194.466C282.671 194.544 282.705 194.626 282.732 194.71C282.761 194.798 282.779 194.889 282.803 194.979C282.822 195.049 282.843 195.118 282.859 195.188C282.87 195.235 282.878 195.283 282.882 195.331C282.904 195.561 282.924 195.792 282.944 196.022C282.938 196.023 282.931 196.023 282.924 196.023C282.924 196.137 282.932 196.252 282.923 196.365C282.913 196.49 282.892 196.613 282.87 196.736C282.844 196.873 282.816 197.01 282.782 197.144C282.754 197.254 282.714 197.361 282.68 197.469C282.617 197.67 282.518 197.856 282.423 198.042C282.374 198.138 282.313 198.229 282.253 198.319C282.186 198.421 282.117 198.522 282.043 198.619C281.992 198.687 281.934 198.75 281.875 198.813C281.71 198.993 281.53 199.157 281.334 199.302C281.157 199.432 280.972 199.55 280.777 199.649C280.637 199.72 280.49 199.777 280.344 199.834C280.224 199.881 280.102 199.923 279.979 199.959C279.894 199.983 279.804 199.991 279.716 200.009C279.467 200.06 279.215 200.082 278.962 200.067C278.782 200.057 278.602 200.033 278.423 200.01C278.179 199.977 277.944 199.904 277.716 199.812C277.542 199.742 277.369 199.662 277.208 199.566C277.018 199.454 276.839 199.321 276.657 199.194C276.613 199.164 276.573 199.125 276.536 199.086C276.384 198.928 276.224 198.776 276.084 198.606C275.96 198.455 275.851 198.288 275.749 198.12C275.664 197.981 275.592 197.832 275.529 197.681C275.455 197.504 275.39 197.322 275.333 197.138C275.293 197.006 275.272 196.866 275.246 196.729C275.183 196.412 275.181 196.091 275.192 195.77C275.202 195.478 275.25 195.19 275.334 194.909C275.405 194.674 275.478 194.439 275.594 194.223C275.679 194.066 275.771 193.912 275.861 193.757C275.988 193.536 276.154 193.346 276.33 193.168C276.572 192.921 276.839 192.704 277.14 192.536C277.289 192.453 277.439 192.369 277.596 192.305C277.776 192.233 277.963 192.177 278.15 192.125C278.321 192.076 278.495 192.041 278.674 192.034C278.811 192.028 278.948 192.001 279.084 192Z\" fill=\"#F46600\"></path></g>"
  },
  "Clock": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-344 -189)\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M355.923 195.775C356.538 195.775 357.036 196.274 357.036 196.888V200.97L359.216 202.793C359.688 203.187 359.751 203.888 359.358 204.36C358.965 204.832 358.263 204.896 357.791 204.503L355.211 202.346C354.957 202.134 354.811 201.821 354.811 201.491V196.888C354.811 196.274 355.309 195.775 355.923 195.775ZM364.757 200.999C364.757 205.835 360.837 209.755 356.001 209.755C351.165 209.755 347.244 205.835 347.244 200.999C347.244 196.163 351.165 192.242 356.001 192.242C360.837 192.242 364.757 196.163 364.757 200.999Z\" fill=\"#F46600\"></path></g>"
  },
  "DocumentText": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-420 -189)\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M421.333 194.053C421.333 191.262 423.721 189 426.667 189H438.667C441.612 189 444 191.262 444 194.053V207.947C444 210.738 441.612 213 438.667 213H426.667C423.721 213 421.333 210.738 421.333 207.947V207.316C420.597 207.316 420 206.75 420 206.053C420 205.355 420.597 204.789 421.333 204.789V202.263C420.597 202.263 420 201.698 420 201C420 200.302 420.597 199.737 421.333 199.737V197.211C420.597 197.211 420 196.645 420 195.947C420 195.25 420.597 194.684 421.333 194.684V194.053ZM428.667 195.947C428.667 195.25 429.264 194.684 430 194.684H435.333C436.07 194.684 436.667 195.25 436.667 195.947C436.667 196.645 436.07 197.211 435.333 197.211H430C429.264 197.211 428.667 196.645 428.667 195.947ZM428.667 201C428.667 200.302 429.264 199.737 430 199.737H432.667C433.403 199.737 434 200.302 434 201C434 201.698 433.403 202.263 432.667 202.263H430C429.264 202.263 428.667 201.698 428.667 201Z\" fill=\"#F46600\"></path></g>"
  },
  "Teacher": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-496 -189)\"><path d=\"M508 191C506.073 191 504.512 192.472 504.512 194.287C504.512 196.102 506.073 197.574 508 197.574C509.926 197.574 511.487 196.102 511.487 194.287C511.487 192.472 509.926 191 508 191Z\" fill=\"#F46600\"></path><path d=\"M516.316 201.504V202.835C515.658 203.368 515.243 204.158 515.243 205.04C515.243 205.921 515.658 206.711 516.316 207.244V208.658C516.316 208.902 516.129 209.112 515.873 209.155L511.513 209.884C510.926 209.983 510.36 210.174 509.838 210.447L508.535 211.132V203.166C508.535 202.399 509.143 201.753 509.952 201.659L515.715 201.002C516.034 200.965 516.316 201.2 516.316 201.504Z\" fill=\"#F46600\"></path><path d=\"M499.684 208.658V207.245C500.341 206.711 500.757 205.921 500.757 205.04C500.757 204.159 500.341 203.368 499.684 202.835V201.504C499.684 201.2 499.965 200.965 500.285 201.002L506.048 201.659C506.857 201.753 507.464 202.399 507.464 203.166V211.132L506.162 210.447C505.64 210.174 505.074 209.983 504.486 209.884L500.126 209.155C499.87 209.112 499.684 208.902 499.684 208.658Z\" fill=\"#F46600\"></path><path d=\"M501.613 200.124L506.177 200.644C506.927 200.73 507.575 201.103 508 201.638C508.425 201.103 509.073 200.73 509.823 200.644L514.387 200.124C513.699 199.336 512.655 198.834 511.488 198.834H504.512C503.345 198.834 502.301 199.336 501.613 200.124Z\" fill=\"#F46600\"></path><path d=\"M497.671 206.927C498.782 206.927 499.683 206.078 499.683 205.031C499.683 203.984 498.782 203.135 497.671 203.135C497.338 203.135 497 203.271 497 203.64V206.422C497 206.791 497.338 206.927 497.671 206.927Z\" fill=\"#F46600\"></path><path d=\"M518.329 206.927C517.218 206.927 516.316 206.078 516.316 205.031C516.316 203.984 517.218 203.135 518.329 203.135C518.661 203.135 518.999 203.271 518.999 203.64V206.422C518.999 206.791 518.661 206.927 518.329 206.927Z\" fill=\"#F46600\"></path></g>"
  },
  "FacebookOutline": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-572 -189)\"><path d=\"M586.999 190.999H589.998V194.999H586.999C586.733 194.999 586.479 195.104 586.292 195.292C586.104 195.479 585.999 195.734 585.999 195.999V198.999H589.998L588.999 203H585.999V211H581.999V203H578.999V198.999H581.999V195.999C581.999 194.673 582.526 193.401 583.463 192.463C584.401 191.525 585.673 190.999 586.999 190.999Z\" fill=\"#F46600\"></path></g>"
  },
  "Pin": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-648 -189)\"><rect x=\"657.502\" y=\"197.253\" width=\"4.99609\" height=\"7.49414\" rx=\"2.49805\" fill=\"#F46600\"></rect><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M659.313 197.48C659.491 197.471 659.548 197.469 660 197.469C660.452 197.469 660.509 197.471 660.687 197.48C660.864 197.49 660.985 197.522 661.091 197.568C661.202 197.616 661.303 197.69 661.386 197.787C661.471 197.881 661.536 197.995 661.578 198.122C661.619 198.242 661.647 198.38 661.655 198.581C661.664 198.783 661.665 198.847 661.665 199.361C661.665 199.875 661.663 199.939 661.655 200.141C661.647 200.342 661.619 200.48 661.578 200.6C661.536 200.726 661.471 200.841 661.386 200.935C661.303 201.032 661.202 201.106 661.091 201.154C660.985 201.2 660.864 201.232 660.687 201.242C660.509 201.251 660.452 201.253 660 201.253C659.548 201.253 659.491 201.251 659.313 201.242C659.136 201.232 659.015 201.2 658.909 201.154C658.798 201.106 658.697 201.032 658.614 200.935C658.529 200.841 658.464 200.727 658.422 200.6C658.381 200.48 658.353 200.342 658.345 200.141C658.337 199.939 658.335 199.875 658.335 199.361C658.335 198.847 658.337 198.783 658.345 198.581C658.353 198.38 658.381 198.242 658.422 198.122C658.464 197.995 658.53 197.881 658.614 197.787C658.697 197.69 658.798 197.616 658.909 197.568C659.015 197.522 659.136 197.49 659.313 197.48H659.313ZM660.673 197.821C660.497 197.812 660.445 197.81 660 197.81C659.555 197.81 659.503 197.812 659.327 197.821C659.165 197.829 659.077 197.86 659.018 197.886C658.94 197.921 658.885 197.961 658.826 198.028C658.771 198.089 658.729 198.163 658.702 198.245C658.679 198.312 658.652 198.412 658.644 198.597C658.636 198.796 658.635 198.856 658.635 199.361C658.635 199.866 658.636 199.926 658.644 200.126C658.652 200.31 658.679 200.41 658.702 200.477C658.728 200.559 658.771 200.633 658.826 200.694C658.88 200.757 658.946 200.806 659.018 200.836C659.077 200.862 659.165 200.893 659.327 200.901C659.503 200.91 659.555 200.912 660 200.912C660.445 200.912 660.497 200.91 660.673 200.901C660.835 200.893 660.924 200.862 660.982 200.836C661.06 200.801 661.116 200.761 661.174 200.694C661.229 200.633 661.272 200.559 661.298 200.477C661.321 200.41 661.348 200.31 661.356 200.126C661.364 199.926 661.365 199.866 661.365 199.361C661.365 198.856 661.364 198.796 661.356 198.597C661.348 198.412 661.321 198.312 661.298 198.245C661.268 198.157 661.232 198.094 661.174 198.028C661.12 197.965 661.055 197.917 660.982 197.886C660.924 197.86 660.835 197.829 660.673 197.821V197.821ZM659.787 199.944C659.906 200 660.038 200.008 660.162 199.966C660.285 199.923 660.391 199.834 660.463 199.712C660.534 199.591 660.566 199.445 660.554 199.299C660.541 199.154 660.484 199.018 660.393 198.915C660.335 198.849 660.265 198.798 660.187 198.767C660.11 198.735 660.027 198.724 659.946 198.733C659.864 198.742 659.785 198.772 659.715 198.82C659.644 198.868 659.584 198.933 659.538 199.01C659.493 199.088 659.463 199.176 659.451 199.268C659.439 199.361 659.445 199.455 659.468 199.544C659.492 199.634 659.533 199.716 659.588 199.785C659.644 199.854 659.711 199.909 659.787 199.944ZM659.395 198.673C659.474 198.583 659.569 198.511 659.673 198.463C659.776 198.414 659.888 198.389 660 198.389C660.112 198.389 660.224 198.414 660.328 198.463C660.432 198.511 660.526 198.583 660.605 198.673C660.685 198.764 660.748 198.871 660.791 198.989C660.834 199.107 660.856 199.233 660.856 199.361C660.856 199.489 660.834 199.615 660.791 199.733C660.748 199.851 660.685 199.958 660.605 200.049C660.445 200.231 660.227 200.333 660 200.333C659.773 200.333 659.555 200.231 659.395 200.049C659.234 199.866 659.144 199.619 659.144 199.361C659.144 199.103 659.234 198.856 659.395 198.673V198.673ZM661.046 198.533C661.066 198.512 661.081 198.487 661.092 198.459C661.103 198.431 661.109 198.4 661.109 198.369C661.11 198.339 661.105 198.308 661.095 198.28C661.084 198.251 661.069 198.225 661.05 198.204C661.031 198.182 661.008 198.165 660.983 198.153C660.958 198.141 660.931 198.136 660.904 198.136C660.877 198.137 660.85 198.143 660.826 198.156C660.801 198.168 660.778 198.186 660.76 198.208C660.724 198.252 660.704 198.31 660.705 198.369C660.705 198.429 660.727 198.486 660.764 198.529C660.801 198.571 660.851 198.595 660.904 198.596C660.957 198.597 661.008 198.574 661.046 198.533V198.533Z\" fill=\"white\"></path></g>"
  },
  "Dumbbell": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-724 -189)\"><path d=\"M740.051 193.91C740.588 193.91 741.104 194.124 741.484 194.504C741.863 194.884 742.076 195.399 742.076 195.936V206.063C742.076 206.601 741.864 207.116 741.484 207.496C741.104 207.876 740.588 208.089 740.051 208.089C739.514 208.089 738.999 207.876 738.619 207.496C738.24 207.116 738.026 206.601 738.026 206.063V202.013H733.975V206.063C733.975 206.601 733.761 207.116 733.381 207.496C733.001 207.876 732.486 208.089 731.949 208.089C731.412 208.089 730.897 207.876 730.517 207.496C730.137 207.116 729.923 206.601 729.923 206.063V195.936C729.923 195.398 730.137 194.884 730.517 194.504C730.897 194.124 731.412 193.91 731.949 193.91C732.487 193.91 733.001 194.124 733.381 194.504C733.761 194.884 733.975 195.398 733.975 195.936V199.987H738.026V195.936C738.026 195.398 738.24 194.884 738.619 194.504C738.999 194.124 739.514 193.91 740.051 193.91ZM727.898 195.935C728.166 195.935 728.425 196.041 728.615 196.231C728.804 196.421 728.91 196.679 728.91 196.947V205.05C728.91 205.318 728.804 205.576 728.615 205.766C728.425 205.956 728.166 206.062 727.898 206.062C727.629 206.062 727.372 205.955 727.182 205.766C726.992 205.576 726.885 205.318 726.885 205.05V202.011H725.872C725.604 202.011 725.346 201.905 725.156 201.715C724.967 201.525 724.86 201.267 724.86 200.998C724.86 200.73 724.967 200.472 725.156 200.282C725.346 200.092 725.604 199.985 725.872 199.985H726.885V196.947C726.885 196.679 726.992 196.421 727.182 196.231C727.372 196.042 727.629 195.935 727.898 195.935ZM744.103 195.935C744.371 195.935 744.63 196.041 744.82 196.231C745.009 196.421 745.115 196.679 745.115 196.947V199.985H746.128C746.397 199.985 746.655 200.092 746.845 200.282C747.035 200.472 747.142 200.73 747.142 200.998C747.142 201.267 747.035 201.525 746.845 201.715C746.655 201.905 746.397 202.011 746.128 202.011H745.115V205.05C745.115 205.318 745.009 205.576 744.82 205.766C744.63 205.956 744.371 206.062 744.103 206.062C743.834 206.062 743.577 205.955 743.387 205.766C743.197 205.576 743.09 205.318 743.09 205.05V196.947C743.09 196.679 743.197 196.421 743.387 196.231C743.577 196.042 743.834 195.935 744.103 195.935Z\" fill=\"#F46600\"></path></g>"
  },
  "Clipboard": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-40 -265)\"><path d=\"M55.9978 268.999H57.9976C58.528 268.999 59.0367 269.209 59.4117 269.584C59.7867 269.96 59.9974 270.468 59.9974 270.999V285C59.9974 285.53 59.7867 286.039 59.4117 286.414C59.0367 286.789 58.528 287 57.9976 287H45.9988C45.4684 287 44.9598 286.789 44.5848 286.414C44.2097 286.039 43.999 285.53 43.999 285V270.999C43.999 270.468 44.2097 269.96 44.5848 269.584C44.9598 269.209 45.4684 268.999 45.9988 268.999H47.9986M48.9985 278.999L50.9983 281L54.9979 276.999M48.9985 266.998H54.9979C55.5502 266.998 55.9978 267.446 55.9978 267.999V269.999C55.9978 270.551 55.5502 270.999 54.9979 270.999H48.9985C48.4463 270.999 47.9986 270.551 47.9986 269.999V267.999C47.9986 267.446 48.4463 266.998 48.9985 266.998Z\" stroke=\"#F46600\" stroke-width=\"1.5395\" stroke-linecap=\"round\"></path></g>"
  },
  "Facebook": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-116 -265)\"><rect x=\"120\" y=\"265\" width=\"24\" height=\"24\" rx=\"12\" fill=\"#F46600\"></rect><path d=\"M130.042 285V277.492H128V274.789H130.042V272.48C130.042 270.666 131.249 269 134.028 269C135.154 269 135.986 269.105 135.986 269.105L135.92 271.629C135.92 271.629 135.072 271.621 134.145 271.621C133.143 271.621 132.982 272.07 132.982 272.815V274.789H136L135.869 277.492H132.982V285H130.042Z\" fill=\"white\"></path></g>"
  },
  "CaretDown": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-192 -265)\"><path d=\"M204 281L197 274H211L204 281Z\" fill=\"#F46600\"></path></g>"
  },
  "ChartBars": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-268 -265)\"><path d=\"M287.713 268.999H285.141C284.431 268.999 283.855 269.575 283.855 270.285V283.141C283.855 283.852 284.431 284.427 285.141 284.427H287.713C288.423 284.427 288.998 283.852 288.998 283.141V270.285C288.998 269.575 288.423 268.999 287.713 268.999Z\" fill=\"#F46600\"></path><path d=\"M281.285 272.857H278.713C278.003 272.857 277.428 273.433 277.428 274.143V283.143C277.428 283.853 278.003 284.429 278.713 284.429H281.285C281.995 284.429 282.571 283.853 282.571 283.143V274.143C282.571 273.433 281.995 272.857 281.285 272.857Z\" fill=\"#F46600\"></path><path d=\"M274.857 276.713H272.286C271.576 276.713 271 277.289 271 277.999V283.141C271 283.851 271.576 284.427 272.286 284.427H274.857C275.567 284.427 276.143 283.851 276.143 283.141V277.999C276.143 277.289 275.567 276.713 274.857 276.713Z\" fill=\"#F46600\"></path></g>"
  },
  "Asterisk": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-344 -265)\"><g id=\"Repeat group 1_inner\" data-figma-trr=\"r6u0-0f\">\n<rect x=\"354.494\" y=\"267.177\" width=\"3.01027\" height=\"19.6457\" fill=\"#F46600\"></rect>\n</g>\n<use xlink:href=\"#Repeat%20group%201_inner\" transform=\"translate(417.888 -169.805) rotate(60)\"></use>\n<use xlink:href=\"#Repeat%20group%201_inner\" transform=\"translate(773.888 107.195) rotate(120)\"></use>\n<use xlink:href=\"#Repeat%20group%201_inner\" transform=\"translate(711.999 553.999) rotate(-180)\"></use>\n<use xlink:href=\"#Repeat%20group%201_inner\" transform=\"translate(294.111 723.804) rotate(-120)\"></use>\n<use xlink:href=\"#Repeat%20group%201_inner\" transform=\"translate(-61.8889 446.804) rotate(-60)\"></use></g>"
  },
  "CheckBold": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-420 -265)\"><path d=\"M439.999 271L429 281.999L424.001 277\" stroke=\"#F46600\" stroke-width=\"3.6\" stroke-linecap=\"round\"></path></g>"
  },
  "CalendarClock": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-496 -265)\"><path d=\"M512.001 279V281.2L513.601 282.2M512.001 266.999V271M517.001 272.5V271C517.001 270.469 516.79 269.96 516.415 269.585C516.04 269.21 515.531 268.999 515.001 268.999H501C500.47 268.999 499.961 269.21 499.586 269.585C499.211 269.96 499 270.469 499 271V285.001C499 285.531 499.211 286.04 499.586 286.415C499.961 286.79 500.47 287.001 501 287.001H504.5M499 275H504M504 266.999V271M518.001 281C518.001 284.314 515.314 287.001 512.001 287.001C508.687 287.001 506 284.314 506 281C506 277.686 508.687 275 512.001 275C515.314 275 518.001 277.686 518.001 281Z\" stroke=\"#F46600\" stroke-width=\"2\" stroke-linecap=\"round\"></path></g>"
  },
  "ChevronDownBold": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-572 -265)\"><path d=\"M591.079 274.419C590.813 274.151 590.452 274 590.076 274C589.7 274 589.339 274.151 589.073 274.419L583.964 279.519L578.927 274.419C578.661 274.151 578.3 274 577.924 274C577.548 274 577.188 274.151 576.921 274.419C576.788 274.553 576.682 274.712 576.609 274.888C576.537 275.063 576.5 275.252 576.5 275.442C576.5 275.632 576.537 275.82 576.609 275.996C576.682 276.172 576.788 276.331 576.921 276.465L582.954 282.574C583.086 282.709 583.244 282.816 583.417 282.889C583.591 282.962 583.777 283 583.964 283C584.152 283 584.338 282.962 584.512 282.889C584.685 282.816 584.842 282.709 584.975 282.574L591.079 276.465C591.213 276.331 591.318 276.172 591.391 275.996C591.463 275.82 591.5 275.632 591.5 275.442C591.5 275.252 591.463 275.063 591.391 274.888C591.318 274.712 591.213 274.553 591.079 274.419Z\" fill=\"#F46600\"></path></g>"
  },
  "ShieldCheck": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-648 -265)\"><path d=\"M657 277L659 279L663 274.999M667.999 278C667.999 283 664.499 285.5 660.34 286.95C660.122 287.024 659.885 287.021 659.67 286.94C655.5 285.5 652.001 283 652.001 278V271C652.001 270.735 652.106 270.48 652.294 270.293C652.481 270.105 652.735 270 653.001 270C655 270 657.5 268.8 659.24 267.28C659.452 267.099 659.721 266.999 660 266.999C660.279 266.999 660.548 267.099 660.76 267.28C662.51 268.81 664.999 270 666.999 270C667.264 270 667.519 270.105 667.706 270.293C667.894 270.48 667.999 270.735 667.999 271V278Z\" stroke=\"#F46600\" stroke-width=\"2\" stroke-linecap=\"round\"></path></g>"
  },
  "Globe": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-40 -341)\"><rect x=\"36\" y=\"341\" width=\"24\" height=\"24\" rx=\"12\" fill=\"#F46600\"></rect><g clip-path=\"url(#clip1_960_890)\">\n<path d=\"M48 345C43.5885 345 40 348.589 40 353C40 357.411 43.5885 361 48 361C52.4115 361 56 357.411 56 353C56 348.589 52.4115 345 48 345ZM48 346.333C48.1198 346.333 48.3021 346.406 48.5417 346.688C48.7812 346.969 49.026 347.43 49.25 348.042C49.3542 348.328 49.4557 348.656 49.5417 349H46.4583C46.5443 348.656 46.6458 348.328 46.75 348.042C46.974 347.43 47.2188 346.969 47.4583 346.688C47.6979 346.406 47.8802 346.333 48 346.333ZM45.875 346.667C45.7266 346.945 45.599 347.253 45.4792 347.583C45.3229 348.013 45.1979 348.492 45.0833 349H42.6667C43.4688 347.93 44.5807 347.102 45.875 346.667ZM50.125 346.667C51.4193 347.102 52.5312 347.93 53.3333 349H50.9167C50.8021 348.492 50.6771 348.013 50.5208 347.583C50.401 347.253 50.2734 346.945 50.125 346.667ZM41.875 350.333H44.8542C44.7682 350.966 44.7083 351.638 44.6875 352.333H41.375C41.4427 351.63 41.6068 350.956 41.875 350.333ZM46.2083 350.333H49.7917C49.8854 350.958 49.9531 351.63 49.9792 352.333H46.0208C46.0469 351.63 46.1146 350.958 46.2083 350.333ZM51.1458 350.333H54.125C54.3932 350.956 54.5573 351.63 54.625 352.333H51.3125C51.2917 351.638 51.2318 350.966 51.1458 350.333ZM41.375 353.667H44.6875C44.7083 354.362 44.7682 355.034 44.8542 355.667H41.875C41.6068 355.044 41.4427 354.37 41.375 353.667ZM46.0208 353.667H49.9792C49.9531 354.37 49.8854 355.042 49.7917 355.667H46.2083C46.1146 355.042 46.0469 354.37 46.0208 353.667ZM51.3125 353.667H54.625C54.5573 354.37 54.3932 355.044 54.125 355.667H51.1458C51.2318 355.034 51.2917 354.362 51.3125 353.667ZM42.6667 357H45.0833C45.1979 357.508 45.3229 357.987 45.4792 358.417C45.599 358.747 45.7266 359.055 45.875 359.333C44.5807 358.898 43.4688 358.07 42.6667 357ZM46.4583 357H49.5417C49.4557 357.344 49.3542 357.672 49.25 357.958C49.026 358.57 48.7812 359.031 48.5417 359.312C48.3021 359.594 48.1198 359.667 48 359.667C47.8802 359.667 47.6979 359.594 47.4583 359.312C47.2188 359.031 46.974 358.57 46.75 357.958C46.6458 357.672 46.5443 357.344 46.4583 357ZM50.9167 357H53.3333C52.5312 358.07 51.4193 358.898 50.125 359.333C50.2734 359.055 50.401 358.747 50.5208 358.417C50.6771 357.987 50.8021 357.508 50.9167 357Z\" fill=\"white\"></path>\n</g></g>"
  },
  "ChevronUp": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-116 -341)\"><path d=\"M135.079 355.581C134.813 355.849 134.452 356 134.076 356C133.7 356 133.339 355.849 133.073 355.581L127.964 350.481L122.927 355.581C122.661 355.849 122.3 356 121.924 356C121.548 356 121.188 355.849 120.921 355.581C120.788 355.447 120.682 355.288 120.609 355.112C120.537 354.937 120.5 354.748 120.5 354.558C120.5 354.368 120.537 354.18 120.609 354.004C120.682 353.828 120.788 353.669 120.921 353.535L126.954 347.426C127.086 347.291 127.244 347.184 127.417 347.111C127.591 347.038 127.777 347 127.964 347C128.152 347 128.338 347.038 128.512 347.111C128.685 347.184 128.842 347.291 128.975 347.426L135.079 353.535C135.213 353.669 135.318 353.828 135.391 354.004C135.463 354.18 135.5 354.368 135.5 354.558C135.5 354.748 135.463 354.937 135.391 355.112C135.318 355.288 135.213 355.447 135.079 355.581Z\" fill=\"#F46600\"></path></g>"
  },
  "Instagram": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-192 -341)\"><rect x=\"196\" y=\"341\" width=\"24\" height=\"24\" rx=\"12\" fill=\"#F46600\"></rect><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M205.114 346.042C205.861 346.008 206.099 346 208 346C209.901 346 210.139 346.008 210.885 346.042C211.631 346.076 212.14 346.195 212.586 346.367C213.052 346.543 213.475 346.819 213.825 347.175C214.182 347.525 214.457 347.947 214.632 348.414C214.805 348.86 214.924 349.369 214.958 350.113C214.992 350.861 215 351.099 215 353C215 354.901 214.992 355.139 214.958 355.886C214.924 356.63 214.805 357.14 214.632 357.585C214.457 358.052 214.181 358.475 213.825 358.825C213.475 359.182 213.052 359.457 212.586 359.632C212.14 359.805 211.631 359.924 210.887 359.958C210.139 359.992 209.901 360 208 360C206.099 360 205.861 359.992 205.114 359.958C204.37 359.924 203.86 359.805 203.415 359.632C202.948 359.457 202.525 359.181 202.175 358.825C201.819 358.476 201.543 358.053 201.367 357.586C201.195 357.14 201.076 356.631 201.042 355.887C201.008 355.139 201 354.901 201 353C201 351.099 201.008 350.861 201.042 350.115C201.076 349.369 201.195 348.86 201.367 348.414C201.543 347.947 201.819 347.524 202.175 347.175C202.525 346.819 202.948 346.543 203.414 346.367C203.86 346.195 204.369 346.076 205.113 346.042H205.114ZM210.829 347.302C210.09 347.268 209.869 347.261 208 347.261C206.131 347.261 205.91 347.268 205.171 347.302C204.489 347.333 204.118 347.447 203.871 347.543C203.545 347.67 203.311 347.821 203.066 348.066C202.834 348.292 202.655 348.567 202.543 348.871C202.447 349.118 202.333 349.489 202.302 350.171C202.268 350.91 202.261 351.131 202.261 353C202.261 354.869 202.268 355.09 202.302 355.829C202.333 356.511 202.447 356.882 202.543 357.129C202.655 357.432 202.834 357.708 203.066 357.934C203.292 358.166 203.568 358.345 203.871 358.457C204.118 358.553 204.489 358.667 205.171 358.698C205.91 358.732 206.13 358.739 208 358.739C209.87 358.739 210.09 358.732 210.829 358.698C211.511 358.667 211.882 358.553 212.129 358.457C212.455 358.33 212.689 358.179 212.934 357.934C213.166 357.708 213.345 357.432 213.457 357.129C213.553 356.882 213.667 356.511 213.698 355.829C213.732 355.09 213.739 354.869 213.739 353C213.739 351.131 213.732 350.91 213.698 350.171C213.667 349.489 213.553 349.118 213.457 348.871C213.33 348.545 213.179 348.311 212.934 348.066C212.708 347.834 212.433 347.655 212.129 347.543C211.882 347.447 211.511 347.333 210.829 347.302V347.302ZM207.106 355.158C207.605 355.366 208.161 355.394 208.679 355.237C209.197 355.081 209.644 354.749 209.944 354.3C210.245 353.85 210.38 353.31 210.327 352.772C210.273 352.233 210.034 351.73 209.651 351.349C209.407 351.105 209.112 350.918 208.787 350.801C208.462 350.685 208.115 350.643 207.771 350.676C207.428 350.71 207.096 350.82 206.8 350.997C206.504 351.175 206.25 351.416 206.059 351.703C205.867 351.99 205.741 352.316 205.69 352.658C205.64 352.999 205.665 353.348 205.765 353.678C205.866 354.008 206.038 354.313 206.27 354.568C206.501 354.824 206.787 355.026 207.106 355.158ZM205.456 350.456C205.79 350.122 206.187 349.857 206.623 349.676C207.06 349.495 207.528 349.402 208 349.402C208.472 349.402 208.94 349.495 209.377 349.676C209.813 349.857 210.21 350.122 210.544 350.456C210.878 350.79 211.143 351.187 211.324 351.623C211.505 352.06 211.598 352.528 211.598 353C211.598 353.472 211.505 353.94 211.324 354.377C211.143 354.813 210.878 355.21 210.544 355.544C209.869 356.219 208.954 356.598 208 356.598C207.046 356.598 206.131 356.219 205.456 355.544C204.781 354.869 204.402 353.954 204.402 353C204.402 352.046 204.781 351.131 205.456 350.456V350.456ZM212.396 349.938C212.479 349.86 212.545 349.766 212.591 349.662C212.637 349.557 212.661 349.445 212.663 349.331C212.665 349.218 212.643 349.105 212.601 348.999C212.558 348.894 212.494 348.798 212.414 348.717C212.333 348.637 212.237 348.573 212.132 348.531C212.027 348.488 211.914 348.467 211.8 348.468C211.686 348.47 211.574 348.494 211.469 348.54C211.365 348.586 211.271 348.652 211.193 348.735C211.041 348.896 210.958 349.11 210.961 349.331C210.965 349.553 211.054 349.764 211.211 349.921C211.367 350.077 211.578 350.166 211.8 350.17C212.021 350.173 212.235 350.09 212.396 349.938V349.938Z\" fill=\"white\"></path></g>"
  },
  "Telegram": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-268 -341)\"><rect x=\"272\" y=\"341\" width=\"24\" height=\"24\" rx=\"12\" fill=\"#F46600\"></rect><path d=\"M289.96 347.275L287.847 359.155C287.688 359.993 287.272 360.202 286.682 359.807L283.463 356.979L281.909 358.76C281.738 358.965 281.594 359.136 281.262 359.136L281.494 355.227L287.46 348.799C287.719 348.523 287.404 348.37 287.057 348.646L279.681 354.184L276.506 352.999C275.815 352.741 275.803 352.175 276.65 351.78L289.069 346.075C289.644 345.817 290.148 346.227 289.96 347.275V347.275Z\" fill=\"white\"></path></g>"
  },
  "StarSolid": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-344 -341)\"><path d=\"M355.722 343.079C355.638 343.131 355.57 343.206 355.526 343.294L353.217 347.973C353.065 348.281 352.84 348.548 352.562 348.75C352.283 348.952 351.96 349.084 351.62 349.133L346.455 349.888C346.357 349.902 346.264 349.943 346.188 350.007C346.112 350.071 346.056 350.155 346.025 350.249C345.995 350.344 345.991 350.445 346.015 350.541C346.039 350.637 346.09 350.725 346.161 350.794L349.897 354.431C350.144 354.671 350.328 354.968 350.435 355.295C350.541 355.622 350.566 355.971 350.508 356.31L349.627 361.449C349.61 361.547 349.621 361.647 349.658 361.739C349.695 361.831 349.757 361.911 349.837 361.969C349.918 362.028 350.013 362.062 350.112 362.069C350.21 362.076 350.309 362.055 350.397 362.009L355.014 359.581C355.318 359.421 355.657 359.338 356.001 359.338C356.344 359.338 356.683 359.421 356.987 359.581L361.605 362.009C361.693 362.056 361.792 362.077 361.891 362.07C361.99 362.063 362.085 362.028 362.166 361.97C362.246 361.912 362.308 361.832 362.346 361.74C362.383 361.648 362.393 361.547 362.376 361.449L361.494 356.309C361.436 355.97 361.461 355.622 361.568 355.295C361.674 354.968 361.859 354.671 362.105 354.431L365.841 350.793C365.912 350.724 365.962 350.637 365.986 350.541C366.009 350.444 366.006 350.344 365.975 350.25C365.944 350.156 365.888 350.072 365.813 350.008C365.737 349.945 365.645 349.903 365.547 349.889L360.381 349.133C360.041 349.083 359.719 348.952 359.441 348.75C359.163 348.547 358.938 348.281 358.786 347.973L356.476 343.294C356.432 343.206 356.365 343.131 356.281 343.079C356.197 343.027 356.1 342.999 356.001 342.999C355.902 342.999 355.805 343.027 355.722 343.079Z\" stroke=\"#F46600\" stroke-width=\"2\" stroke-linecap=\"round\"></path></g>"
  },
  "GraduationCap": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-420 -341)\"><path d=\"M421.057 360.735C421.026 360.715 420.999 360.689 420.979 360.658C420.959 360.627 420.946 360.592 420.941 360.555C420.855 359.969 420.855 359.374 420.941 358.788C421.16 357.376 421.805 352.489 422.37 351.18C422.408 351.091 422.388 351.115 422.388 351.115C422.388 351.115 422.153 351.035 421.989 350.977C421.825 350.92 421.964 350.971 421.732 350.884L420.236 350.347C420.167 350.321 420.107 350.275 420.065 350.214C420.023 350.153 420 350.081 420 350.007C420 349.933 420.023 349.861 420.065 349.8C420.107 349.74 420.167 349.693 420.236 349.667L431.864 345.024C431.95 344.992 432.044 344.992 432.13 345.024L443.77 349.648C443.84 349.675 443.899 349.724 443.94 349.786C443.981 349.848 444.002 349.921 444 349.996C443.998 350.07 443.973 350.142 443.928 350.202C443.883 350.262 443.821 350.307 443.75 350.33C441.066 351.225 433.56 353.698 432.173 354.118C432.066 354.151 424.941 351.982 424.08 351.709C424.015 351.689 423.847 351.616 423.489 351.459C422.763 353.611 423.444 359.33 423.162 360.103C423.136 360.17 423.131 360.244 423.147 360.315C423.217 360.62 423.164 360.707 423.007 360.781C422.703 360.932 422.366 361.007 422.026 360.999C421.686 360.992 421.353 360.901 421.057 360.736L421.057 360.735ZM430.653 360.35C429.466 360.271 428.299 360.006 427.195 359.565C426.539 359.325 425.953 358.926 425.491 358.403C425.249 358.119 425.115 357.759 425.112 357.386V353.008C425.11 352.974 425.11 352.94 425.112 352.906L425.923 353.156C427.903 353.762 429.882 354.369 431.861 354.978C431.948 355.002 432.04 355.002 432.128 354.978L436.769 353.553L438.725 352.951C438.784 352.935 438.844 352.923 438.904 352.914V357.305C438.904 358.003 438.548 358.489 438.029 358.881C437.171 359.531 436.173 359.851 435.141 360.081C434.114 360.302 433.067 360.413 432.016 360.413C431.561 360.413 431.107 360.392 430.653 360.35Z\" fill=\"#F46600\"></path></g>"
  },
  "UsersOutline": {
    viewBox: "0 0 24 24",
    body: "<g transform=\"translate(-496 -341)\"><path d=\"M512 362V360C512 358.939 511.579 357.922 510.829 357.172C510.079 356.421 509.061 356 508 356H502C500.939 356 499.921 356.421 499.171 357.172C498.421 357.922 497.999 358.939 497.999 360V362M512 344.128C512.858 344.35 513.618 344.851 514.16 345.552C514.703 346.253 514.997 347.114 514.997 348C514.997 348.886 514.703 349.747 514.16 350.448C513.618 351.149 512.858 351.65 512 351.872M518.001 362V360C518 359.114 517.705 358.253 517.162 357.552C516.619 356.852 515.859 356.351 515.001 356.13M509 348C509 350.209 507.209 352 505 352C502.791 352 501 350.209 501 348C501 345.791 502.791 344 505 344C507.209 344 509 345.791 509 348Z\" stroke=\"#F46600\" stroke-width=\"2\" stroke-linecap=\"round\"></path></g>"
  }
};
Object.assign(__ds_scope, { icons, __ds_default_components_icons_icon_data_12stud1: icons });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/icon-data.js", error: String((e && e.message) || e) }); }

__ds_scope.__ds_default_components_icons_icon_data_12stud1$1nb03e1 = __ds_scope.__ds_default_components_icons_icon_data_12stud1 !== undefined ? __ds_scope.__ds_default_components_icons_icon_data_12stud1 : __ds_scope.icons;

// components/icons/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Icon({
  name,
  size,
  ...rest
}) {
  const d = __ds_scope.__ds_default_components_icons_icon_data_12stud1$1nb03e1[name];
  if (!d) return null;
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: d.viewBox,
    fill: "none"
    // body strings are emitter-controlled <path> markup — geometry,
    // numeric fills and transforms only; no .fig-authored text reaches them.
    ,
    dangerouslySetInnerHTML: {
      __html: d.body
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon, __ds_default_components_icons_Icon_fio49a: Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/media/SocialLinks.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const FACEBOOK = 'M 1.995 16 L 1.995 8.492 L 0 8.492 L 0 5.789 L 1.995 5.789 L 1.995 3.48 C 1.995 1.666 3.173 0 5.888 0 C 6.987 0 7.8 0.105 7.8 0.105 L 7.736 2.629 C 7.736 2.629 6.907 2.621 6.003 2.621 C 5.023 2.621 4.867 3.07 4.867 3.815 L 4.867 5.789 L 7.814 5.789 L 7.686 8.492 L 4.867 8.492 L 4.867 16 L 1.995 16 Z';
function SocialLinks(props) {
  const {
    items = ['facebook', 'globe'],
    state = 'default',
    globeSrc = '../../assets/icons/social-globe.svg',
    gap = 10,
    style,
    ...rest
  } = props;
  const dim = state === 'hover' ? 0.8 : 1;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      gap,
      alignItems: 'center',
      ...style
    }
  }, rest), items.map((kind, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    "aria-label": kind,
    style: {
      width: 24,
      height: 24,
      borderRadius: 'var(--radius-social)',
      background: `rgba(241,102,0,${dim})`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, kind === 'facebook' ? /*#__PURE__*/React.createElement("svg", {
    width: "7.814",
    height: "16",
    viewBox: "0 0 7.814 16",
    fill: `rgba(255,255,255,${dim})`,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: FACEBOOK,
    fillRule: "nonzero"
  })) : /*#__PURE__*/React.createElement("img", {
    src: globeSrc,
    alt: "",
    width: "16",
    height: "16",
    style: {
      opacity: dim
    }
  }))));
}
Object.assign(__ds_scope, { SocialLinks });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/SocialLinks.jsx", error: String((e && e.message) || e) }); }

// components/navigation/HeaderButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function HeaderButton(props) {
  const {
    scheme = 'primary',
    children = 'Зареєструватися',
    href = '#',
    style,
    ...rest
  } = props;
  const tone = scheme === 'secondary' ? {
    background: 'transparent',
    color: 'var(--js-orange-ui)',
    boxShadow: 'inset 0 0 0 1px var(--js-orange-ui)'
  } : {
    background: 'var(--js-orange-ui)',
    color: 'var(--js-white)',
    boxShadow: 'none'
  };
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    style: {
      height: 37,
      borderRadius: 'var(--radius-md)',
      padding: '0 23px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 14,
      lineHeight: '19px',
      textDecoration: 'none',
      boxSizing: 'border-box',
      ...tone,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { HeaderButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/HeaderButton.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Link.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Link(props) {
  const {
    variant = 'inline',
    tone = 'default',
    children = 'Link',
    href = '#',
    style,
    ...rest
  } = props;
  if (variant === 'arrow') {
    const c = tone === 'hover' ? 'var(--js-orange-link-hover)' : 'var(--js-orange-link)';
    return /*#__PURE__*/React.createElement("a", _extends({
      href: href,
      style: {
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: 10,
        fontFamily: 'var(--font-core)',
        fontWeight: 700,
        fontSize: 21,
        lineHeight: '100%',
        color: c,
        textDecoration: tone === 'hover' ? 'underline' : 'none',
        ...style
      }
    }, rest), /*#__PURE__*/React.createElement("span", null, children), /*#__PURE__*/React.createElement("svg", {
      width: "26",
      height: "26",
      viewBox: "0 0 26 26",
      fill: "none",
      "aria-hidden": "true",
      style: {
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M20.583 12 H5.417 M14.083 5.5 L20.583 12 L14.083 18.5",
      stroke: c,
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })));
  }
  if (variant === 'plain') {
    return /*#__PURE__*/React.createElement("a", _extends({
      href: href,
      style: {
        fontFamily: 'var(--font-core)',
        fontWeight: 500,
        fontSize: 14,
        lineHeight: '100%',
        color: tone === 'hover' ? 'var(--js-orange-ui)' : 'var(--js-ink)',
        textDecoration: 'none',
        ...style
      }
    }, rest), children);
  }
  const c = tone === 'hover' ? 'var(--js-orange-ui)' : 'var(--js-ink)';
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontFamily: 'var(--font-core)',
      fontWeight: 400,
      fontSize: 16,
      lineHeight: '20px',
      color: c,
      textDecoration: 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", null, children), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    "aria-hidden": "true",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 6 L8 11 L13 6",
    fill: "var(--js-ink)"
  })));
}
Object.assign(__ds_scope, { Link });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Link.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function NavItem(props) {
  const {
    children = 'Продукти',
    active = false,
    hasMenu = false,
    href = '#',
    style,
    ...rest
  } = props;
  const color = active ? 'var(--js-orange-ui)' : 'var(--js-ink)';
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: 20,
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 16,
      lineHeight: '20px',
      color,
      textDecoration: 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", null, children), hasMenu ? /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    "aria-hidden": "true",
    style: {
      flexShrink: 0,
      transform: 'scaleY(-1)'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 6 L8 11 L13 6",
    fill: active ? 'var(--js-orange-ui)' : 'var(--js-ink)'
  })) : null);
}
Object.assign(__ds_scope, { NavItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavItem.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Pagination.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Pagination(props) {
  const {
    count = 3,
    active = 0,
    onSelect,
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      ...style
    }
  }, rest), Array.from({
    length: count
  }).map((_, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    "aria-label": `Slide ${i + 1}`,
    onClick: onSelect && (() => onSelect(i)),
    style: {
      width: 14,
      height: 14,
      borderRadius: 'var(--radius-circle)',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      background: 'var(--js-orange-link)',
      opacity: i === active ? 1 : 0.3
    }
  })));
}
Object.assign(__ds_scope, { Pagination });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Pagination.jsx", error: String((e && e.message) || e) }); }

// components/navigation/StudentMenu.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function MenuRow(props) {
  const {
    label,
    icon,
    active
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      height: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: active ? 600 : 500,
      fontSize: 14,
      lineHeight: 1.21875,
      color: active ? 'var(--js-orange-ui)' : 'var(--js-ink)'
    }
  }, label));
}
function StudentMenu(props) {
  const {
    name = 'Mariia',
    course = 'Англійська мова',
    avatar = '../../assets/imagery/avatar-student.jpg',
    balance = '8 уроків',
    items = [],
    activeIndex = 0,
    footer = null,
    logo = null,
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: 262,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--js-white)',
      boxShadow: '0px 0px 10px 0px rgba(27,27,27,0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      padding: 16,
      boxSizing: 'border-box',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 32,
      paddingLeft: 20
    }
  }, logo), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-xl)',
      background: 'rgb(243,243,244)',
      padding: 16,
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: avatar,
    alt: "",
    width: "50",
    height: "50",
    style: {
      borderRadius: 'var(--radius-circle)',
      objectFit: 'cover',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: 1.21875,
      color: 'var(--js-ink)'
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 500,
      fontSize: 12,
      lineHeight: 1.21875,
      color: 'rgb(109,109,121)'
    }
  }, course))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 50,
      borderRadius: 'var(--radius-xl)',
      background: 'rgb(243,243,244)',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      height: 34,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--js-white)',
      padding: '6px 8px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      fontFamily: 'var(--font-core)',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: 1.21875,
      color: 'var(--js-ink)'
    }
  }, balance))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 32
    }
  }, items.map((item, i) => /*#__PURE__*/React.createElement(MenuRow, {
    key: i,
    label: item.label,
    icon: item.icon,
    active: i === activeIndex
  }))), footer ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      borderRadius: 'var(--radius-lg)',
      background: 'rgb(249,249,249)',
      padding: '12px 19px'
    }
  }, footer) : null);
}
Object.assign(__ds_scope, { StudentMenu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/StudentMenu.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tabs(props) {
  const {
    variant = 'pill',
    items = [],
    active = 0,
    onSelect,
    style,
    ...rest
  } = props;
  if (variant === 'underline') {
    return /*#__PURE__*/React.createElement("div", _extends({
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        borderBottom: '1px solid var(--js-grey-225)',
        ...style
      }
    }, rest), items.map((label, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      onClick: onSelect && (() => onSelect(i)),
      style: {
        minWidth: 153,
        height: 58,
        border: 0,
        cursor: 'pointer',
        borderRadius: '16px 16px 0 0',
        padding: '16px 20px',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-core)',
        fontWeight: 700,
        fontSize: 21,
        lineHeight: '100%',
        background: i === active ? 'var(--js-orange-ui)' : 'transparent',
        color: i === active ? 'var(--js-white)' : 'var(--js-ink)'
      }
    }, label)));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      gap: 0,
      padding: 10,
      borderRadius: 'var(--radius-3xl)',
      background: 'var(--surface-track)',
      ...style
    }
  }, rest), items.map((label, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    onClick: onSelect && (() => onSelect(i)),
    style: {
      minWidth: 153,
      height: 50,
      border: 0,
      cursor: 'pointer',
      borderRadius: 'var(--radius-xl)',
      padding: '11px 20px',
      boxSizing: 'border-box',
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 21,
      lineHeight: '28px',
      textAlign: 'center',
      background: i === active ? 'var(--js-orange-link)' : 'transparent',
      color: i === active ? 'var(--js-white)' : 'var(--js-ink)'
    }
  }, label)));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/site/CtaPanel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CtaPanel(props) {
  const {
    headline,
    action = 'Спробувати зараз',
    onAction,
    width = 385,
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width,
      borderRadius: 'var(--radius-3xl)',
      background: 'var(--js-gradient-cta)',
      boxShadow: 'var(--shadow-cta)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      padding: '24px 28px',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 600,
      fontSize: 16,
      lineHeight: '100%',
      textAlign: 'center',
      color: 'var(--js-white)'
    }
  }, headline), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onAction,
    style: {
      alignSelf: 'stretch',
      height: 48,
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-inverse-cta)',
      border: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 16,
      lineHeight: '100%',
      color: 'var(--js-black)'
    }
  }, action));
}
Object.assign(__ds_scope, { CtaPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/CtaPanel.jsx", error: String((e && e.message) || e) }); }

// components/site/FaqRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FaqRow(props) {
  const {
    question,
    answer = null,
    open = false,
    onToggle,
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      alignSelf: 'stretch',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onToggle,
    style: {
      width: '100%',
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      border: 0,
      background: 'none',
      padding: 0,
      cursor: 'pointer',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 22,
      lineHeight: '32px',
      color: 'var(--js-black)'
    }
  }, question), /*#__PURE__*/React.createElement("svg", {
    width: "32",
    height: "32",
    viewBox: "0 0 32 32",
    fill: "none",
    "aria-hidden": "true",
    style: {
      flexShrink: 0,
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform var(--duration-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 11 L15.625 21.625 L26.25 11",
    stroke: "var(--js-black)",
    strokeWidth: "1.417",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), open && answer ? /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 12,
      fontFamily: 'var(--font-core)',
      fontWeight: 400,
      fontSize: 16,
      lineHeight: 1.35,
      color: 'var(--js-ink)'
    }
  }, answer) : null);
}
Object.assign(__ds_scope, { FaqRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/FaqRow.jsx", error: String((e && e.message) || e) }); }

// components/site/FeatureItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FeatureItem(props) {
  const {
    children,
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: 9,
      boxShadow: 'inset 0 0 0 1.5px var(--js-orange-brand)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "10",
    viewBox: "0 0 10 10",
    fill: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1.667 5.2 L4 7.083 L8.333 2.5",
    stroke: "var(--js-orange-brand)",
    strokeWidth: "1",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flexGrow: 1,
      fontFamily: 'var(--font-core)',
      fontWeight: 400,
      fontSize: 12,
      lineHeight: '100%',
      color: 'var(--js-black)'
    }
  }, children));
}
Object.assign(__ds_scope, { FeatureItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/FeatureItem.jsx", error: String((e && e.message) || e) }); }

// components/site/FormatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FormatCard(props) {
  const {
    title,
    subtitle,
    icon = null,
    features = [],
    footer = null,
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      height: 485,
      borderRadius: 'var(--radius-2xl)',
      background: 'var(--js-white)',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      flexDirection: 'column',
      padding: 20,
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      boxSizing: 'border-box',
      flexGrow: 1,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 48,
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      alignSelf: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 'var(--radius-icon-wrap)',
      background: 'var(--surface-icon)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 20,
      lineHeight: '100%',
      color: 'var(--js-black)'
    }
  }, title), subtitle ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 14,
      lineHeight: '100%',
      color: 'var(--js-black)'
    }
  }, subtitle) : null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignSelf: 'stretch'
    }
  }, features), footer);
}
Object.assign(__ds_scope, { FormatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/FormatCard.jsx", error: String((e && e.message) || e) }); }

// components/site/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionHeading(props) {
  const {
    children,
    align = 'left',
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement("h2", _extends({
    style: {
      margin: 0,
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 42,
      lineHeight: 1.1,
      color: 'var(--js-black)',
      textAlign: align,
      alignSelf: 'stretch',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/site/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StatCard(props) {
  const {
    value,
    caption,
    background = 'var(--js-gradient-amber)',
    color = 'var(--js-white)',
    footer = null,
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      height: 220,
      borderRadius: 'var(--radius-3xl)',
      background,
      display: 'flex',
      flexDirection: 'column',
      padding: 24,
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      boxSizing: 'border-box',
      overflow: 'hidden',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      alignSelf: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 42,
      lineHeight: '100%',
      color
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      maxWidth: 244,
      fontFamily: 'var(--font-core)',
      fontWeight: 600,
      fontSize: 16,
      lineHeight: '100%',
      color
    }
  }, caption)), footer);
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/site/StatChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StatChip(props) {
  const {
    value,
    caption,
    background = 'var(--js-mint)',
    rotate = 0,
    width = 218,
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width,
      borderRadius: 'var(--radius-xl)',
      background,
      boxShadow: 'var(--shadow-chip-inner)',
      display: 'flex',
      flexDirection: 'column',
      padding: '12px 16px',
      justifyContent: 'center',
      alignItems: 'flex-start',
      boxSizing: 'border-box',
      transform: rotate ? `rotate(${rotate}deg)` : 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 22,
      lineHeight: '100%',
      color: 'var(--js-black)'
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '100%',
      color: 'var(--js-black)'
    }
  }, caption));
}
Object.assign(__ds_scope, { StatChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/StatChip.jsx", error: String((e && e.message) || e) }); }

// components/site/StepCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StepCard(props) {
  const {
    step = 1,
    title,
    body,
    meta = null,
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      height: 400,
      borderRadius: 'var(--radius-3xl)',
      background: 'var(--js-white)',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      flexDirection: 'column',
      padding: 24,
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      boxSizing: 'border-box',
      flexGrow: 1,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      alignSelf: 'stretch'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 54,
      height: 54,
      borderRadius: 'var(--radius-step-badge)',
      background: 'var(--js-orange-brand)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 26,
      lineHeight: '100%',
      color: 'var(--js-white)'
    }
  }, step), title ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 22,
      lineHeight: '32px',
      color: 'var(--js-black)'
    }
  }, title) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 1.35,
      color: 'var(--js-black)'
    }
  }, body)), meta);
}
Object.assign(__ds_scope, { StepCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/StepCard.jsx", error: String((e && e.message) || e) }); }

// components/site/TrustChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TrustChip(props) {
  const {
    children,
    icon = null,
    iconBackground = 'rgb(235,244,255)',
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      minWidth: 265,
      height: 56,
      borderRadius: 14,
      background: 'var(--js-white)',
      boxShadow: 'var(--shadow-lifted)',
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      padding: '6px 14px',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 18,
      background: iconBackground,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 600,
      fontSize: 14,
      lineHeight: 1.35,
      textAlign: 'center',
      color: 'var(--js-ink)'
    }
  }, children));
}
Object.assign(__ds_scope, { TrustChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/TrustChip.jsx", error: String((e && e.message) || e) }); }

// ui_kits/student_app/StudentHome.jsx
try { (() => {
const {
  StudentMenu,
  Logo,
  Icon,
  CellHeadline,
  CellMain,
  CellTextRightIcon,
  Button,
  Tabs,
  CircleButton
} = window.JustSchoolDesignSystem_efd9c8;
const glyph = src => /*#__PURE__*/React.createElement("img", {
  src: src,
  alt: "",
  width: "22",
  height: "22"
});
const NAV = [{
  label: 'Головна',
  icon: glyph('../../assets/icons/menu-home.svg')
}, {
  label: 'Мої уроки',
  icon: glyph('../../assets/icons/menu-item.svg')
}, {
  label: 'Розмовний клуб',
  icon: glyph('../../assets/icons/menu-glyph-a.svg')
}, {
  label: 'Домашнє завдання',
  icon: /*#__PURE__*/React.createElement(Icon, {
    name: "Homework",
    size: 22
  })
}, {
  label: 'Self - study',
  icon: glyph('../../assets/icons/menu-glyph-b.svg')
}, {
  label: 'Словник',
  icon: /*#__PURE__*/React.createElement(Icon, {
    name: "Ic24x24Volume2",
    size: 22
  })
}];
function Sidebar(props) {
  return /*#__PURE__*/React.createElement(StudentMenu, {
    logo: /*#__PURE__*/React.createElement(Logo, {
      height: 18,
      basePath: "../../assets/brand"
    }),
    name: "Mariia",
    course: "\u0410\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430 \u043C\u043E\u0432\u0430",
    avatar: "../../assets/imagery/avatar-student.jpg",
    balance: "8 \u0443\u0440\u043E\u043A\u0456\u0432",
    items: NAV,
    activeIndex: props.activeIndex,
    footer: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-core)',
        fontWeight: 600,
        fontSize: 12,
        color: 'var(--js-ink)'
      }
    }, "\u041F\u043E\u0442\u0440\u0456\u0431\u043D\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u0430?"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-core)',
        fontWeight: 400,
        fontSize: 11,
        lineHeight: 1.4,
        color: 'var(--js-grey-600)'
      }
    }, "\u041D\u0430\u043F\u0438\u0448\u0456\u0442\u044C \u043D\u0430\u043C \u2014 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u043C\u043E \u043F\u0440\u043E\u0442\u044F\u0433\u043E\u043C \u0434\u043D\u044F.")),
    style: {
      minHeight: 720
    }
  });
}
function LessonList() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 20,
      background: 'var(--js-white)',
      boxShadow: 'var(--shadow-card)',
      padding: '0 20px'
    }
  }, /*#__PURE__*/React.createElement(CellHeadline, {
    width: "100%"
  }, "\u041C\u043E\u0457 \u0443\u0440\u043E\u043A\u0438"), /*#__PURE__*/React.createElement(CellTextRightIcon, {
    width: "100%",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "FavoriteBorder",
      size: 24
    })
  }, "Speaking Club \xB7 B1"), /*#__PURE__*/React.createElement(CellTextRightIcon, {
    width: "100%",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "Ic24x24Volume2",
      size: 24
    })
  }, "\u0410\u0443\u0434\u0456\u043E\u043C\u0430\u0442\u0435\u0440\u0456\u0430\u043B\u0438 \u0434\u043E Unit 4"), /*#__PURE__*/React.createElement(CellMain, {
    width: "100%"
  }, "\u0413\u0440\u0443\u043F\u043E\u0432\u0456 \u0437\u0430\u043D\u044F\u0442\u0442\u044F \xB7 \u0447\u0435\u0442\u0432\u0435\u0440, 19:00"), /*#__PURE__*/React.createElement(CellTextRightIcon, {
    width: "100%",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "FiChevronRight",
      size: 24
    })
  }, "\u0414\u043E\u043C\u0430\u0448\u043D\u0454 \u0437\u0430\u0432\u0434\u0430\u043D\u043D\u044F"));
}
function StudentHome(props) {
  const [tab, setTab] = React.useState(0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      padding: 24,
      background: 'rgb(249,249,249)',
      boxSizing: 'border-box',
      width: 1280,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    activeIndex: props.activeIndex
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 32,
      color: 'var(--js-black)'
    }
  }, "\u0412\u0456\u0442\u0430\u0454\u043C\u043E, Mariia"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Button, null, "\u0417\u0430\u043F\u0438\u0441\u0430\u0442\u0438\u0441\u044F \u043D\u0430 \u0443\u0440\u043E\u043A"))), /*#__PURE__*/React.createElement(Tabs, {
    variant: "pill",
    items: ["Розклад", "Прогрес", "Матеріали"],
    active: tab,
    onSelect: setTab,
    style: {
      alignSelf: 'flex-start'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(LessonList, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 300,
      borderRadius: 24,
      background: 'var(--js-gradient-amber)',
      padding: 24,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 42,
      lineHeight: '100%',
      color: 'var(--js-white)'
    }
  }, "8"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 600,
      fontSize: 16,
      color: 'var(--js-white)'
    }
  }, "\u0443\u0440\u043E\u043A\u0456\u0432 \u043D\u0430 \u0431\u0430\u043B\u0430\u043D\u0441\u0456"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 12,
      alignSelf: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(CircleButton, {
    size: "s",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "FiChevronRight",
      size: 24
    })
  }))))));
}
Object.assign(window, {
  Sidebar,
  LessonList,
  StudentHome
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/student_app/StudentHome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Faq.jsx
try { (() => {
const {
  FaqRow,
  TextField,
  Checkbox,
  Button,
  SectionHeading
} = window.JustSchoolDesignSystem_efd9c8;
const QUESTIONS = [['Як проходить навчання?', 'Уроки проходять на платформі JustSchool у зручний для вас час — індивідуально або в групі.'], ['Чи є вікові обмеження або за рівнем англійської?', null], ['Скільки триває один урок?', null], ['Чи можна змінити викладача?', null]];
function Faq() {
  const [open, setOpen] = React.useState(0);
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "FAQ",
    style: {
      width: 1440,
      padding: '80px 140px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      alignItems: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'stretch',
      borderRadius: 24,
      background: 'var(--surface-muted)',
      padding: 56,
      boxSizing: 'border-box',
      display: 'flex',
      gap: 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 420,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    style: {
      fontSize: 32
    }
  }, "\u0417\u0430\u043B\u0438\u0448\u0438\u043B\u0438\u0441\u044C \u043F\u0438\u0442\u0430\u043D\u043D\u044F?"), /*#__PURE__*/React.createElement(TextField, {
    placeholder: "\u0412\u0430\u0448\u0435 \u0456\u043C\u02BC\u044F",
    style: {
      alignSelf: 'stretch'
    }
  }), /*#__PURE__*/React.createElement(TextField, {
    placeholder: "\u0422\u0435\u043B\u0435\u0444\u043E\u043D",
    style: {
      alignSelf: 'stretch'
    }
  }), /*#__PURE__*/React.createElement(Checkbox, {
    checked: true,
    label: "\u042F \u043F\u043E\u0433\u043E\u0434\u0436\u0443\u044E\u0441\u044C \u0437 \u0443\u043C\u043E\u0432\u0430\u043C\u0438 \u043E\u0431\u0440\u043E\u0431\u043A\u0438 \u0434\u0430\u043D\u0438\u0445"
  }), /*#__PURE__*/React.createElement(Button, {
    style: {
      alignSelf: 'flex-start'
    }
  }, "\u0417\u0430\u043F\u0438\u0441\u0430\u0442\u0438\u0441\u044F")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, QUESTIONS.map(([q, a], i) => /*#__PURE__*/React.createElement(FaqRow, {
    key: q,
    question: q,
    answer: a,
    open: open === i,
    onToggle: () => setOpen(open === i ? -1 : i)
  })))));
}
Object.assign(window, {
  Faq
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Faq.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Formats.jsx
try { (() => {
const {
  SectionHeading,
  FormatCard,
  FeatureItem,
  Button,
  Pagination
} = window.JustSchoolDesignSystem_efd9c8;
const icon = /*#__PURE__*/React.createElement("img", {
  src: "../../assets/icons/message-circle.svg",
  alt: "",
  width: "20"
});
const META = text => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    height: 35,
    borderRadius: 8,
    background: 'var(--color-yellow-color-yellow-50)',
    padding: '8px 12px',
    boxSizing: 'border-box',
    alignSelf: 'flex-start'
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    width: 18,
    height: 18,
    borderRadius: 9,
    background: 'var(--js-gold)',
    flexShrink: 0
  }
}), /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: 'var(--font-core)',
    fontWeight: 600,
    fontSize: 12,
    color: 'var(--js-ink)'
  }
}, text));
const CARDS = [{
  title: 'Розмовні клуби',
  subtitle: '(для учнів)',
  features: ['Розмовна практика англійської на актуальні теми.'],
  meta: null
}, {
  title: 'Групові заняття',
  subtitle: '(для учнів)',
  features: ['Динамічний формат навчання за доступнішою ціною.'],
  meta: '60 хв'
}, {
  title: 'Just Premium',
  subtitle: '(для учнів)',
  features: ['Безлімітний доступ до Speaking Club.'],
  meta: null
}, {
  title: 'Англійська для дорослих',
  subtitle: '(для учнів)',
  features: ['Розмовна практика англійської на актуальні теми.'],
  meta: 'Тривалість: 30 хвилин'
}];
function Formats() {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Formats",
    style: {
      width: 1440,
      padding: '80px 140px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 33,
      alignItems: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, null, "\u0424\u043E\u0440\u043C\u0430\u0442\u0438 \u0432\u0438\u0432\u0447\u0435\u043D\u043D\u044F \u0430\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u043E\u0457 \u043C\u043E\u0432\u0438 \u043E\u043D\u043B\u0430\u0439\u043D"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignSelf: 'stretch',
      alignItems: 'center'
    }
  }, CARDS.map(c => /*#__PURE__*/React.createElement(FormatCard, {
    key: c.title,
    title: c.title,
    subtitle: c.subtitle,
    icon: icon,
    features: c.features.map((f, i) => /*#__PURE__*/React.createElement(FeatureItem, {
      key: i
    }, f)),
    footer: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignSelf: 'stretch'
      }
    }, c.meta ? META(c.meta) : null, /*#__PURE__*/React.createElement(Button, {
      style: {
        alignSelf: 'stretch'
      }
    }, "\u0414\u0456\u0437\u043D\u0430\u0442\u0438\u0441\u044F \u0431\u0456\u043B\u044C\u0448\u0435"))
  }))), /*#__PURE__*/React.createElement(Pagination, {
    count: 3,
    active: 0
  }));
}
Object.assign(window, {
  Formats
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Formats.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
const {
  NavItem,
  HeaderButton,
  Logo
} = window.JustSchoolDesignSystem_efd9c8;
function Header() {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'relative',
      width: 1440,
      height: 123,
      background: 'var(--js-white)',
      borderRadius: 24,
      boxShadow: 'var(--shadow-header)',
      flexShrink: 0,
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 79,
      top: 50
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    height: 18,
    basePath: "../../assets/brand"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 239,
      top: 49,
      display: 'flex',
      gap: 28,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(NavItem, {
    active: true,
    hasMenu: true
  }, "\u041F\u0440\u043E\u0434\u0443\u043A\u0442\u0438"), /*#__PURE__*/React.createElement(NavItem, {
    hasMenu: true
  }, "\u0424\u043E\u0440\u043C\u0438 \u043D\u0430\u0432\u0447\u0430\u043D\u043D\u044F"), /*#__PURE__*/React.createElement(NavItem, {
    hasMenu: true
  }, "Justsmart"), /*#__PURE__*/React.createElement(NavItem, null, "\u0411\u043B\u043E\u0433"), /*#__PURE__*/React.createElement(NavItem, null, "\u0422\u0435\u0441\u0442 \u0440\u0456\u0432\u043D\u044F"), /*#__PURE__*/React.createElement(NavItem, null, "\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u0438")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 1012,
      top: 49,
      display: 'flex',
      gap: 4,
      alignItems: 'center',
      fontFamily: 'var(--font-core)',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '20px',
      color: 'var(--js-ink)'
    }
  }, "UA", /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 6 L8 11 L13 6",
    fill: "var(--js-ink)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 1073,
      top: 40,
      display: 'flex',
      gap: 16,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(HeaderButton, {
    scheme: "secondary"
  }, "\u0423\u0432\u0456\u0439\u0442\u0438"), /*#__PURE__*/React.createElement(HeaderButton, null, "\u0417\u0430\u0440\u0435\u0454\u0441\u0442\u0440\u0443\u0432\u0430\u0442\u0438\u0441\u044F")));
}
Object.assign(window, {
  Header
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
const {
  CtaPanel,
  StatChip,
  TrustChip
} = window.JustSchoolDesignSystem_efd9c8;
const CHIPS = [['Гнучкий графік занять', 'rgb(235,244,255)'], ['Інтерактивна платформа', 'var(--js-lilac)'], ['Індивідуально або в групах', 'var(--js-mint)'], ['Перший урок безплатний', 'var(--js-peach-050)'], ['З гарантією результату', 'var(--js-butter)'], ['4.9/5 оцінка на незалежних платформах', 'var(--js-violet-mid)']];
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Hero",
    style: {
      position: 'relative',
      width: 1440,
      height: 850,
      background: 'var(--js-white)',
      flexShrink: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 1045,
      top: 326,
      width: 400,
      height: 300,
      opacity: 0.5,
      borderRadius: '50%',
      background: 'var(--js-apricot)',
      transform: 'rotate(15deg)'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/hero-brush.png",
    alt: "",
    style: {
      position: 'absolute',
      left: 670,
      top: 400,
      width: 812,
      height: 'auto',
      opacity: 0.9,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/hero-student.png",
    alt: "",
    style: {
      position: 'absolute',
      left: 888,
      top: 202,
      width: 414,
      height: 440,
      objectFit: 'cover',
      objectPosition: '65% 50%'
    }
  }), /*#__PURE__*/React.createElement(StatChip, {
    style: {
      position: 'absolute',
      left: 1121,
      top: 206
    },
    width: 218,
    value: "3 800 000+",
    caption: "\u0443\u0441\u043F\u0456\u0448\u043D\u043E \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0445 \u0437\u0430\u043D\u044F\u0442\u044C",
    background: "var(--js-mint)",
    rotate: 5.7
  }), /*#__PURE__*/React.createElement(StatChip, {
    style: {
      position: 'absolute',
      left: 769,
      top: 204
    },
    width: 197,
    value: "17 000+",
    caption: "\u0430\u043A\u0442\u0438\u0432\u043D\u0438\u0445 \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u0456\u0432",
    background: "var(--js-lilac)",
    rotate: -2
  }), /*#__PURE__*/React.createElement(StatChip, {
    style: {
      position: 'absolute',
      left: 787,
      top: 417
    },
    width: 228,
    value: "1 700+",
    caption: "\u0434\u043E\u0441\u0432\u0456\u0434\u0447\u0435\u043D\u0438\u0445 \u0432\u0438\u043A\u043B\u0430\u0434\u0430\u0447\u0456\u0432 \u0443 \u043A\u043E\u043C\u0430\u043D\u0434\u0456",
    background: "var(--js-apricot)",
    rotate: 9
  }), /*#__PURE__*/React.createElement(StatChip, {
    style: {
      position: 'absolute',
      left: 1152,
      top: 402
    },
    width: 242,
    value: "95%",
    caption: "\u0441\u0442\u0443\u0434\u0435\u043D\u0442\u0456\u0432 \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u044E\u0442\u044C \u043D\u0430\u0441 \u0434\u0440\u0443\u0437\u044F\u043C",
    background: "var(--js-butter)",
    rotate: -3.3
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 852,
      top: 626,
      width: 486,
      height: 79,
      borderRadius: 20,
      background: 'var(--js-white)',
      boxShadow: 'var(--shadow-soft)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      padding: '8px 12px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 58,
      borderRadius: 12,
      boxShadow: 'var(--shadow-lifted)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '13px 10px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 8,
      background: 'var(--js-violet-mid)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 24,
      color: 'var(--js-white)'
    }
  }, "e"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 600,
      fontSize: 20,
      color: 'var(--js-black)'
    }
  }, "4.6"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 500,
      fontSize: 18,
      color: 'var(--js-black)'
    }
  }, "/5"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 600,
      fontSize: 20,
      color: 'var(--js-black)'
    }
  }, "AppStore")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 140,
      top: 228,
      width: 608,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 56,
      lineHeight: 1.1,
      color: 'var(--js-orange-brand)'
    }
  }, "\u0417\u0430\u0433\u043E\u0432\u043E\u0440\u0456\u0442\u044C \u0430\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u043E\u044E \u0432\u0456\u043B\u044C\u043D\u043E \u0437 JustSchool"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-core)',
      fontWeight: 600,
      fontSize: 24,
      lineHeight: '100%',
      color: 'var(--js-black)'
    }
  }, "\u041A\u0443\u0440\u0441\u0438 \u0430\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u043E\u0457 \u0437 \u0433\u0430\u0440\u0430\u043D\u0442\u0456\u0454\u044E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0443")), /*#__PURE__*/React.createElement(CtaPanel, {
    style: {
      position: 'absolute',
      left: 140,
      top: 500
    },
    headline: "\u041E\u0442\u0440\u0438\u043C\u0430\u0439\u0442\u0435 \u0431\u0435\u0437\u043A\u043E\u0448\u0442\u043E\u0432\u043D\u0438\u0439 \u0434\u0435\u043C\u043E-\u0443\u0440\u043E\u043A \u0442\u0430 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u0438\u0439 \u043F\u043B\u0430\u043D \u0440\u043E\u0437\u0432\u0438\u0442\u043A\u0443."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: -13,
      top: 747,
      width: 1453,
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, CHIPS.map(([label, tint]) => /*#__PURE__*/React.createElement(TrustChip, {
    key: label,
    iconBackground: tint,
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", null, label)))));
}
Object.assign(window, {
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Numbers.jsx
try { (() => {
const {
  SectionHeading,
  StatCard
} = window.JustSchoolDesignSystem_efd9c8;
function Numbers() {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Numbers",
    style: {
      width: 1440,
      padding: '48px 140px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 33,
      alignItems: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, null, "JustSchool \u2014 \u043E\u043D\u043B\u0430\u0439\u043D-\u0448\u043A\u043E\u043B\u0430 \u0430\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u043E\u0457 \u043C\u043E\u0432\u0438, \u044F\u043A\u0456\u0439 \u0434\u043E\u0432\u0456\u0440\u044F\u044E\u0442\u044C"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1152,
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    style: {
      width: 566
    },
    value: "100 000+",
    caption: "\u0432\u0438\u043F\u0443\u0441\u043A\u043D\u0438\u043A\u0456\u0432, \u044F\u043A\u0456 \u0434\u043E\u0441\u044F\u0433\u043B\u0438 \u0441\u0432\u043E\u0457\u0445 \u0446\u0456\u043B\u0435\u0439"
  }), /*#__PURE__*/React.createElement(StatCard, {
    style: {
      flex: 1
    },
    value: "3 800 000+",
    caption: "\u0443\u0441\u043F\u0456\u0448\u043D\u043E \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0445 \u0437\u0430\u043D\u044F\u0442\u044C",
    background: "var(--js-mint)",
    color: "var(--js-black)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    style: {
      flex: 1
    },
    value: "1 700+",
    caption: "\u0434\u043E\u0441\u0432\u0456\u0434\u0447\u0435\u043D\u0438\u0445 \u0432\u0438\u043A\u043B\u0430\u0434\u0430\u0447\u0456\u0432 \u0443 \u043A\u043E\u043C\u0430\u043D\u0434\u0456",
    background: "var(--js-apricot)",
    color: "var(--js-black)"
  }), /*#__PURE__*/React.createElement(StatCard, {
    style: {
      flex: 1
    },
    value: "17 000+",
    caption: "\u0430\u043A\u0442\u0438\u0432\u043D\u0438\u0445 \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u0456\u0432",
    background: "var(--js-lilac)",
    color: "var(--js-black)"
  }), /*#__PURE__*/React.createElement(StatCard, {
    style: {
      flex: 1
    },
    value: "95%",
    caption: "\u0441\u0442\u0443\u0434\u0435\u043D\u0442\u0456\u0432 \u0440\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u044E\u0442\u044C \u043D\u0430\u0441 \u0434\u0440\u0443\u0437\u044F\u043C",
    background: "var(--js-butter)",
    color: "var(--js-black)"
  }))));
}
Object.assign(window, {
  Numbers
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Numbers.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Reviews.jsx
try { (() => {
const {
  SectionHeading,
  Link,
  Icon
} = window.JustSchoolDesignSystem_efd9c8;
function ReviewCard() {
  return /*#__PURE__*/React.createElement("article", {
    style: {
      width: 480,
      borderRadius: 24,
      background: 'var(--js-white)',
      boxShadow: 'var(--shadow-card)',
      padding: 24,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/photo-f3d023628063d73f.jpg",
    alt: "",
    width: "48",
    height: "48",
    style: {
      borderRadius: '50%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 600,
      fontSize: 16,
      color: 'var(--js-ink)'
    }
  }, "\u0410\u043D\u0434\u0440\u0456\u0439 \u041A\u043E\u0432\u0430\u043B\u044C"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 400,
      fontSize: 12,
      color: 'var(--js-grey-600)'
    }
  }, "3 \u0442\u0438\u0436\u043D\u0456 \u0442\u043E\u043C\u0443")), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 2
    }
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(Icon, {
    key: i,
    name: "Star",
    size: 16,
    style: {
      color: 'var(--js-gold)'
    }
  })))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-core)',
      fontWeight: 400,
      fontSize: 14,
      lineHeight: 1.35,
      color: 'var(--js-ink)'
    }
  }, "\u0414\u043E\u0431\u0440\u043E\u0433\u043E \u0434\u043D\u044F! \u0417\u0430\u0439\u043C\u0430\u044E\u0441\u044C \u0431\u0456\u0437\u043D\u0435\u0441-\u0430\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u043E\u044E, \u0431\u043E \u043F\u0440\u0430\u0446\u044E\u044E \u0437 \u0430\u043C\u0435\u0440\u0438\u043A\u0430\u043D\u0446\u044F\u043C\u0438. \u0423\u0440\u043E\u043A\u0438 \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E \u043F\u0440\u0430\u043A\u0442\u0438\u0447\u043D\u0456. \u0406\u0437 \u0432\u0438\u043A\u043B\u0430\u0434\u0430\u0447\u0435\u043C \u0437\u043D\u0430\u0439\u0448\u043B\u0438 \u0441\u043F\u0456\u043B\u044C\u043D\u0443 \u043C\u043E\u0432\u0443 \u0432\u0456\u0434\u0440\u0430\u0437\u0443, \u0430\u0434\u0436\u0435 \u043C\u0438 \u043E\u0434\u043D\u043E\u043B\u0456\u0442\u043A\u0438."), /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: 'flex-start',
      borderRadius: 8,
      background: 'var(--js-peach-050)',
      padding: '6px 10px',
      fontFamily: 'var(--font-core)',
      fontWeight: 600,
      fontSize: 12,
      color: 'var(--js-orange-brand)'
    }
  }, "\u0431\u0456\u0437\u043D\u0435\u0441-\u0430\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u0430"));
}
function Reviews() {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Reviews",
    style: {
      width: 1440,
      padding: '80px 140px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      alignItems: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, null, "\u0412\u0456\u0434\u0433\u0443\u043A\u0438 \u043D\u0430\u0448\u0438\u0445 \u0443\u0447\u043D\u0456\u0432 \u043F\u0440\u043E \u0443\u0440\u043E\u043A\u0438 \u0430\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u043E\u0457 \u043C\u043E\u0432\u0438"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 40,
      alignSelf: 'stretch'
    }
  }, /*#__PURE__*/React.createElement(ReviewCard, null), /*#__PURE__*/React.createElement(ReviewCard, null), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-core)',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: 1.35,
      color: 'var(--js-ink)'
    }
  }, "\u041F\u043E\u043D\u0430\u0434 100 000 \u0432\u0438\u043F\u0443\u0441\u043A\u043D\u0438\u043A\u0456\u0432 \u0432\u0436\u0435 \u043F\u0440\u043E\u0439\u0448\u043B\u0438 \u0446\u0435\u0439 \u0448\u043B\u044F\u0445 \u0440\u0430\u0437\u043E\u043C \u0437 \u043D\u0430\u043C\u0438."), /*#__PURE__*/React.createElement(Link, {
    variant: "arrow"
  }, "\u0412\u0441\u0456 \u0432\u0456\u0434\u0433\u0443\u043A\u0438"))));
}
Object.assign(window, {
  Reviews
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Reviews.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteFooter.jsx
try { (() => {
const {
  Logo,
  SocialLinks,
  Link
} = window.JustSchoolDesignSystem_efd9c8;
const LINKS = ['Відгуки', 'Відгуки працівників', 'F.A.Q', 'Блог', 'Наші партнери', 'Фонд “Діти героїв”', 'Про компанію', 'Вакансії', 'Ціни', 'Наші викладачі', 'Робота викладача'];
const COURSES = ['Курси англійської мови в Києві', 'Англійська для дорослих', 'Англійська для дітей', 'Розмовні клуби', 'Just Premium', 'Бізнес-англійська'];
function Column(props) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: props.width,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 18,
      lineHeight: '25px',
      color: 'var(--js-black)'
    }
  }, props.title), props.items.map(i => /*#__PURE__*/React.createElement(Link, {
    key: i,
    variant: "plain"
  }, i)));
}
function SiteFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    "data-screen-label": "Footer",
    style: {
      width: 1440,
      flexShrink: 0,
      background: 'var(--js-white)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 143px 40px',
      display: 'flex',
      gap: 64,
      alignItems: 'flex-start',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 232,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    height: 18,
    basePath: "../../assets/brand"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: '20px',
      color: 'var(--js-black)',
      whiteSpace: 'pre-line'
    }
  }, 'Англійська — це просто,\nколи з JustSchool'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/brand/justsmart.svg",
    alt: "JustSmart",
    style: {
      width: 120,
      height: 'auto'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 500,
      fontSize: 12,
      color: 'var(--js-grey-600)'
    }
  }, "\u043F\u0440\u043E\u0441\u0442\u043E \u043A\u043B\u0430\u0441 \u0432 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0456")), /*#__PURE__*/React.createElement(SocialLinks, {
    items: ["facebook", "facebook", "facebook", "globe"],
    globeSrc: "../../assets/icons/social-globe.svg"
  })), /*#__PURE__*/React.createElement(Column, {
    title: "\u041D\u0430\u0448\u0456 \u043A\u0443\u0440\u0441\u0438",
    items: COURSES,
    width: 300
  }), /*#__PURE__*/React.createElement(Column, {
    title: "\u041F\u043E\u0441\u0438\u043B\u0430\u043D\u043D\u044F",
    items: LINKS,
    width: 220
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 232,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 700,
      fontSize: 18,
      lineHeight: '25px',
      color: 'var(--js-black)'
    }
  }, "\u0417\u0430\u043B\u0438\u0448\u0438\u043B\u0438\u0441\u044C \u043F\u0438\u0442\u0430\u043D\u043D\u044F?"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 400,
      fontSize: 11,
      lineHeight: 1.4,
      color: 'var(--js-grey-600)'
    }
  }, "JUSTSPEAK LTD"))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 57,
      background: 'rgb(233,233,233)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 143px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-core)',
      fontWeight: 400,
      fontSize: 14,
      color: 'rgb(94,94,94)'
    }
  }, "\xA9 2018\u20132024 JustSchool"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 20,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Link, {
    variant: "plain",
    style: {
      fontWeight: 500,
      fontSize: 14,
      color: 'var(--js-black)'
    }
  }, "\u041F\u043E\u043B\u0456\u0442\u0438\u043A\u0430 \u043A\u043E\u043D\u0444\u0456\u0434\u0435\u043D\u0446\u0456\u0439\u043D\u043E\u0441\u0442\u0456"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 17,
      background: 'var(--js-black)'
    }
  }), /*#__PURE__*/React.createElement(Link, {
    variant: "plain",
    style: {
      fontWeight: 500,
      fontSize: 14,
      color: 'var(--js-black)'
    }
  }, "\u0414\u043E\u0433\u043E\u0432\u0456\u0440-\u043E\u0444\u0435\u0440\u0442\u0430"))));
}
Object.assign(window, {
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Steps.jsx
try { (() => {
const {
  SectionHeading,
  StepCard
} = window.JustSchoolDesignSystem_efd9c8;
const meta = text => /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: 'var(--font-core)',
    fontWeight: 600,
    fontSize: 14,
    color: 'var(--js-ink)'
  }
}, text);
const STEPS = [{
  step: 1,
  title: 'Залиште заявку',
  body: "Заповніть коротку форму або зателефонуйте нам. Менеджер зв'яжеться з вами найближчим часом, з'ясує ваші цілі та підбере зручний час для першого уроку.",
  meta: '1-2 хвилини'
}, {
  step: 2,
  body: 'На першому занятті викладач проведе діагностику рівня англійської мови за шкалою CEFR та порекомендує оптимальну програму навчання. Ви побачите формат уроків зсередини та зрозумієте, чи підходить вам підхід JustSchool.',
  meta: '30-40 хвилин'
}, {
  step: 3,
  body: 'Після пробного уроку ви вибираєте формат: індивідуальні чи групові заняття — і стартуєте за зручним розкладом. Доступ до платформи, матеріалів і особистого кабінету відкривається одразу після першої оплати.',
  meta: 'Старт одразу'
}];
function Steps() {
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Steps",
    style: {
      width: 1440,
      padding: '80px 140px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 33,
      alignItems: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, null, "\u042F\u043A \u0440\u043E\u0437\u043F\u043E\u0447\u0430\u0442\u0438 \u0432\u0438\u0432\u0447\u0435\u043D\u043D\u044F \u0430\u043D\u0433\u043B\u0456\u0439\u0441\u044C\u043A\u043E\u0457 \u043C\u043E\u0432\u0438 \u043E\u043D\u043B\u0430\u0439\u043D"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignSelf: 'stretch',
      alignItems: 'center'
    }
  }, STEPS.map(s => /*#__PURE__*/React.createElement(StepCard, {
    key: s.step,
    step: s.step,
    title: s.title,
    body: s.body,
    meta: meta(s.meta)
  }))));
}
Object.assign(window, {
  Steps
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Steps.jsx", error: String((e && e.message) || e) }); }

if (__ds_scope.__ds_default_components_icons_icon_data_12stud1$1nb03e1 === undefined) __ds_scope.__ds_default_components_icons_icon_data_12stud1$1nb03e1 = __ds_scope.__ds_default_components_icons_icon_data_12stud1 !== undefined ? __ds_scope.__ds_default_components_icons_icon_data_12stud1 : __ds_scope.icons;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.ActionButton = __ds_scope.ActionButton;

__ds_ns.AddAction = __ds_scope.AddAction;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.CircleButton = __ds_scope.CircleButton;

__ds_ns.CellHeadline = __ds_scope.CellHeadline;

__ds_ns.CellMain = __ds_scope.CellMain;

__ds_ns.CellTextRightIcon = __ds_scope.CellTextRightIcon;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.SocialLinks = __ds_scope.SocialLinks;

__ds_ns.HeaderButton = __ds_scope.HeaderButton;

__ds_ns.Link = __ds_scope.Link;

__ds_ns.NavItem = __ds_scope.NavItem;

__ds_ns.Pagination = __ds_scope.Pagination;

__ds_ns.StudentMenu = __ds_scope.StudentMenu;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.CtaPanel = __ds_scope.CtaPanel;

__ds_ns.FaqRow = __ds_scope.FaqRow;

__ds_ns.FeatureItem = __ds_scope.FeatureItem;

__ds_ns.FormatCard = __ds_scope.FormatCard;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.StatChip = __ds_scope.StatChip;

__ds_ns.StepCard = __ds_scope.StepCard;

__ds_ns.TrustChip = __ds_scope.TrustChip;

})();
