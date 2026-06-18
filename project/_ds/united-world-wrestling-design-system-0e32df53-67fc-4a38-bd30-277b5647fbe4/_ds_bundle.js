/* @ds-bundle: {"format":3,"namespace":"UnitedWorldWrestlingDesignSystem_0e32df","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Stat","sourcePath":"components/display/Stat.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"963235e581eb","components/buttons/IconButton.jsx":"1aa9fdd765f0","components/display/Avatar.jsx":"2c83c595e7d1","components/display/Badge.jsx":"9f93bdb586c8","components/display/Card.jsx":"37ee0355f029","components/display/Stat.jsx":"bbf53c91c0e2","components/display/Tag.jsx":"841db9eba92c","components/forms/Checkbox.jsx":"5d48ff323dc3","components/forms/Input.jsx":"aabb1bf2a616","components/forms/Radio.jsx":"9df11c1767ea","components/forms/Select.jsx":"017544e72d67","components/forms/Switch.jsx":"80d5d0388b5b","components/navigation/Tabs.jsx":"c4be2fd5410c","ui_kits/website/athlete.jsx":"96490759d8f3","ui_kits/website/chrome.jsx":"b8523a776505","ui_kits/website/event.jsx":"81fb33b90ed3","ui_kits/website/home.jsx":"5ca5f4f4f71c","ui_kits/website/icons.jsx":"4cbfd37b04ee"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.UnitedWorldWrestlingDesignSystem_0e32df = window.UnitedWorldWrestlingDesignSystem_0e32df || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let _injected = false;
function injectStyles() {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const css = `
  .uww-btn {
    --_bg: var(--color-action);
    --_fg: #fff;
    --_bd: transparent;
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    font-family: var(--font-display); font-stretch: 75%; font-weight: 800;
    text-transform: uppercase; letter-spacing: .04em;
    border: var(--border-thick) solid var(--_bd);
    background: var(--_bg); color: var(--_fg);
    border-radius: var(--radius-md);
    cursor: pointer; white-space: nowrap; text-decoration: none;
    transition: background var(--duration-fast) var(--ease-out),
                color var(--duration-fast) var(--ease-out),
                border-color var(--duration-fast) var(--ease-out),
                transform var(--duration-fast) var(--ease-out);
  }
  .uww-btn:active { transform: translateY(1px); }
  .uww-btn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .uww-btn[disabled] { opacity: .45; cursor: not-allowed; transform: none; }

  .uww-btn--sm { font-size: 13px; padding: 7px 14px; }
  .uww-btn--md { font-size: 15px; padding: 10px 20px; }
  .uww-btn--lg { font-size: 18px; padding: 14px 28px; }
  .uww-btn--pill { border-radius: var(--radius-pill); }
  .uww-btn--block { display: flex; width: 100%; }

  .uww-btn--primary { --_bg: var(--color-action); --_fg: #fff; --_bd: transparent; }
  .uww-btn--primary:hover:not([disabled]) { --_bg: var(--color-action-hover); }
  .uww-btn--secondary { --_bg: var(--uww-ink); --_fg: #fff; --_bd: transparent; }
  .uww-btn--secondary:hover:not([disabled]) { --_bg: var(--ink-800); }
  .uww-btn--outline { --_bg: transparent; --_fg: var(--uww-ink); --_bd: var(--border-strong); }
  .uww-btn--outline:hover:not([disabled]) { --_bg: var(--surface-muted); --_bd: var(--uww-ink); }
  .uww-btn--ghost { --_bg: transparent; --_fg: var(--color-action); --_bd: transparent; }
  .uww-btn--ghost:hover:not([disabled]) { --_bg: var(--orange-50); }
  .uww-btn--onInk { --_bg: var(--color-primary); --_fg: var(--uww-ink); --_bd: transparent; }
  .uww-btn--onInk:hover:not([disabled]) { --_bg: var(--uww-orange-bright); }
  `;
  const el = document.createElement('style');
  el.id = 'uww-btn-styles';
  el.textContent = css;
  document.head.appendChild(el);
}

/**
 * UWW Button — the primary action control. Condensed, uppercase, athletic.
 */
function Button({
  variant = 'primary',
  size = 'md',
  pill = false,
  block = false,
  leadingIcon = null,
  trailingIcon = null,
  as = 'button',
  className = '',
  children,
  ...rest
}) {
  injectStyles();
  const Tag = as;
  const classes = ['uww-btn', `uww-btn--${variant}`, `uww-btn--${size}`, pill ? 'uww-btn--pill' : '', block ? 'uww-btn--block' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: classes
  }, rest), leadingIcon ? /*#__PURE__*/React.createElement("span", {
    className: "uww-btn__icon",
    "aria-hidden": "true"
  }, leadingIcon) : null, children, trailingIcon ? /*#__PURE__*/React.createElement("span", {
    className: "uww-btn__icon",
    "aria-hidden": "true"
  }, trailingIcon) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let _injected = false;
function injectStyles() {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const css = `
  .uww-iconbtn {
    --_bg: transparent; --_fg: var(--uww-ink); --_bd: transparent;
    display: inline-flex; align-items: center; justify-content: center;
    border: var(--border-hairline) solid var(--_bd);
    background: var(--_bg); color: var(--_fg);
    border-radius: var(--radius-md); cursor: pointer; padding: 0;
    transition: background var(--duration-fast) var(--ease-out),
                color var(--duration-fast) var(--ease-out),
                border-color var(--duration-fast) var(--ease-out);
  }
  .uww-iconbtn:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  .uww-iconbtn[disabled] { opacity: .4; cursor: not-allowed; }
  .uww-iconbtn--sm { width: 32px; height: 32px; }
  .uww-iconbtn--md { width: 40px; height: 40px; }
  .uww-iconbtn--lg { width: 48px; height: 48px; }
  .uww-iconbtn--round { border-radius: var(--radius-circle); }

  .uww-iconbtn--ghost:hover:not([disabled]) { --_bg: var(--surface-muted); }
  .uww-iconbtn--solid { --_bg: var(--color-action); --_fg: #fff; }
  .uww-iconbtn--solid:hover:not([disabled]) { --_bg: var(--color-action-hover); }
  .uww-iconbtn--outline { --_bd: var(--border-default); }
  .uww-iconbtn--outline:hover:not([disabled]) { --_bd: var(--uww-ink); --_bg: var(--surface-muted); }
  .uww-iconbtn--onInk { --_fg: #fff; }
  .uww-iconbtn--onInk:hover:not([disabled]) { --_bg: rgba(255,255,255,.14); }
  `;
  const el = document.createElement('style');
  el.id = 'uww-iconbtn-styles';
  el.textContent = css;
  document.head.appendChild(el);
}

/**
 * Square/round icon-only button. Always pass an accessible `label`.
 */
function IconButton({
  variant = 'ghost',
  size = 'md',
  round = false,
  label,
  className = '',
  children,
  ...rest
}) {
  injectStyles();
  const classes = ['uww-iconbtn', `uww-iconbtn--${variant}`, `uww-iconbtn--${size}`, round ? 'uww-iconbtn--round' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    className: classes,
    "aria-label": label,
    title: label
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let _injected = false;
function injectStyles() {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const css = `
  .uww-avatar { position: relative; display: inline-flex; flex: none; }
  .uww-avatar__img {
    width: 100%; height: 100%; border-radius: 50%; object-fit: cover;
    background: var(--uww-ink); color: #fff; display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-stretch: 75%; font-weight: 800; text-transform: uppercase;
    overflow: hidden;
  }
  .uww-avatar--ring .uww-avatar__img { box-shadow: 0 0 0 2px var(--surface-page), 0 0 0 4px var(--_ring, var(--color-primary)); }
  .uww-avatar__flag {
    position: absolute; bottom: -2px; right: -2px; font-size: 10px; font-weight: 700;
    font-family: var(--font-sans);
    background: var(--surface-page); color: var(--uww-ink); border-radius: var(--radius-xs);
    padding: 1px 4px; box-shadow: var(--shadow-xs); letter-spacing: .02em;
  }
  `;
  const el = document.createElement('style');
  el.id = 'uww-avatar-styles';
  el.textContent = css;
  document.head.appendChild(el);
}
const SIZES = {
  sm: 32,
  md: 44,
  lg: 64,
  xl: 96
};
const RINGS = {
  gold: '#F7941E',
  silver: '#C9CDD9',
  bronze: '#B0490C',
  primary: 'var(--color-primary)'
};

/**
 * Athlete avatar — photo or initials, with optional medal ring + country code.
 */
function Avatar({
  src,
  name = '',
  size = 'md',
  ring,
  country,
  fontScale = 0.4,
  className = '',
  ...rest
}) {
  injectStyles();
  const px = SIZES[size] || size;
  const initials = name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('');
  const ringColor = ring ? RINGS[ring] || ring : null;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['uww-avatar', ring ? 'uww-avatar--ring' : '', className].filter(Boolean).join(' '),
    style: {
      width: px,
      height: px,
      '--_ring': ringColor || undefined
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    className: "uww-avatar__img",
    src: src,
    alt: name
  }) : /*#__PURE__*/React.createElement("span", {
    className: "uww-avatar__img",
    style: {
      fontSize: px * fontScale
    },
    "aria-label": name
  }, initials), country ? /*#__PURE__*/React.createElement("span", {
    className: "uww-avatar__flag"
  }, country) : null);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let _injected = false;
function injectStyles() {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const css = `
  .uww-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--font-display); font-stretch: 75%; font-weight: 800;
    text-transform: uppercase; letter-spacing: .07em;
    border-radius: var(--radius-sm); line-height: 1; white-space: nowrap;
  }
  .uww-badge--sm { font-size: 10px; padding: 4px 7px; }
  .uww-badge--md { font-size: 12px; padding: 5px 9px; }
  .uww-badge--neutral { background: var(--gray-100); color: var(--gray-700); }
  .uww-badge--primary { background: var(--orange-50); color: var(--orange-700); }
  .uww-badge--solid   { background: var(--color-action); color: #fff; }
  .uww-badge--ink     { background: var(--uww-ink); color: #fff; }
  .uww-badge--success { background: var(--color-success-bg); color: var(--color-success); }
  .uww-badge--warning { background: var(--color-warning-bg); color: #946a00; }
  .uww-badge--danger  { background: var(--color-danger-bg); color: var(--color-danger); }
  .uww-badge--info    { background: var(--color-info-bg); color: var(--color-info); }
  .uww-badge--live    { background: var(--color-danger); color: #fff; }
  .uww-badge__dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
  .uww-badge--live .uww-badge__dot { background: #fff; animation: uww-pulse 1.4s ease-in-out infinite; }
  @keyframes uww-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.7); } }
  @media (prefers-reduced-motion: reduce) { .uww-badge--live .uww-badge__dot { animation: none; } }
  `;
  const el = document.createElement('style');
  el.id = 'uww-badge-styles';
  el.textContent = css;
  document.head.appendChild(el);
}

/**
 * Status badge. Use `variant="live"` for an animated live-match indicator.
 */
function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  children,
  ...rest
}) {
  injectStyles();
  const showDot = dot || variant === 'live';
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ['uww-badge', `uww-badge--${variant}`, `uww-badge--${size}`, className].filter(Boolean).join(' ')
  }, rest), showDot ? /*#__PURE__*/React.createElement("span", {
    className: "uww-badge__dot",
    "aria-hidden": "true"
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let _injected = false;
function injectStyles() {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const css = `
  .uww-card {
    background: var(--surface-card);
    border: var(--border-hairline) solid var(--border-subtle);
    border-radius: var(--radius-lg); overflow: hidden;
    box-shadow: var(--shadow-card); display: flex; flex-direction: column;
    transition: transform var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out);
  }
  .uww-card--interactive { cursor: pointer; }
  .uww-card--interactive:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
  .uww-card--flat { box-shadow: none; }
  .uww-card--ink { background: var(--surface-ink); border-color: var(--border-on-ink); color: #fff; }
  .uww-card__media { position: relative; display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; background: var(--gray-100); }
  .uww-card__accent { height: 4px; background: var(--color-primary); }
  .uww-card__body { padding: var(--space-7); display: flex; flex-direction: column; gap: 8px; }
  .uww-card--ink .uww-card__body { color: #fff; }
  `;
  const el = document.createElement('style');
  el.id = 'uww-card-styles';
  el.textContent = css;
  document.head.appendChild(el);
}

/**
 * Content card. Compose freely, or pass `media`/`accent` for the common layout.
 */
function Card({
  variant = 'default',
  interactive = false,
  accent = false,
  media = null,
  padded = true,
  className = '',
  children,
  ...rest
}) {
  injectStyles();
  const cls = ['uww-card', variant !== 'default' ? `uww-card--${variant}` : '', interactive ? 'uww-card--interactive' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), accent ? /*#__PURE__*/React.createElement("div", {
    className: "uww-card__accent",
    style: typeof accent === 'string' ? {
      background: accent
    } : undefined
  }) : null, media ? typeof media === 'string' ? /*#__PURE__*/React.createElement("img", {
    className: "uww-card__media",
    src: media,
    alt: ""
  }) : /*#__PURE__*/React.createElement("div", {
    className: "uww-card__media"
  }, media) : null, padded ? /*#__PURE__*/React.createElement("div", {
    className: "uww-card__body"
  }, children) : children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let _injected = false;
function injectStyles() {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const css = `
  .uww-stat { display: flex; flex-direction: column; gap: 2px; font-family: var(--font-sans); }
  .uww-stat__value {
    font-family: var(--font-display); font-stretch: 75%; font-weight: 800;
    line-height: .92; color: var(--color-ink); letter-spacing: -.01em;
    display: flex; align-items: baseline; gap: 6px;
  }
  .uww-stat__value--md { font-size: 40px; }
  .uww-stat__value--lg { font-size: 62px; }
  .uww-stat__value--sm { font-size: 28px; }
  .uww-stat__unit { font-size: .42em; font-weight: 700; color: var(--color-primary); }
  .uww-stat__label {
    font-family: var(--font-display); font-stretch: 75%; font-weight: 700;
    text-transform: uppercase; letter-spacing: .1em; font-size: 12px; color: var(--color-text-muted);
  }
  .uww-stat--onInk .uww-stat__value { color: #fff; }
  .uww-stat--onInk .uww-stat__label { color: rgba(255,255,255,.7); }
  `;
  const el = document.createElement('style');
  el.id = 'uww-stat-styles';
  el.textContent = css;
  document.head.appendChild(el);
}

/**
 * Big-number statistic (medal counts, athletes, nations).
 */
function Stat({
  value,
  unit,
  label,
  size = 'md',
  onInk = false,
  className = '',
  ...rest
}) {
  injectStyles();
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['uww-stat', onInk ? 'uww-stat--onInk' : '', className].filter(Boolean).join(' ')
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: `uww-stat__value uww-stat__value--${size}`
  }, value, unit ? /*#__PURE__*/React.createElement("span", {
    className: "uww-stat__unit"
  }, unit) : null), label ? /*#__PURE__*/React.createElement("span", {
    className: "uww-stat__label"
  }, label) : null);
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Stat.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let _injected = false;
function injectStyles() {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const css = `
  .uww-tag {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--font-sans); font-weight: 600; font-size: 13px;
    color: var(--color-text); background: var(--surface-card);
    border: var(--border-hairline) solid var(--border-default);
    border-radius: var(--radius-pill); padding: 5px 12px; line-height: 1.1; white-space: nowrap;
    transition: border-color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out);
  }
  .uww-tag--active { background: var(--uww-ink); border-color: var(--uww-ink); color: #fff; }
  .uww-tag--accent { background: var(--orange-50); border-color: var(--orange-200); color: var(--orange-700); }
  button.uww-tag { cursor: pointer; }
  button.uww-tag:hover { border-color: var(--uww-ink); }
  button.uww-tag.uww-tag--active:hover { background: var(--ink-800); }
  .uww-tag__remove { display: inline-flex; cursor: pointer; opacity: .6; }
  .uww-tag__remove:hover { opacity: 1; }
  `;
  const el = document.createElement('style');
  el.id = 'uww-tag-styles';
  el.textContent = css;
  document.head.appendChild(el);
}

/**
 * Pill tag / filter chip. Renders as a <button> when `onClick` is provided.
 */
function Tag({
  variant = 'default',
  active = false,
  leadingIcon = null,
  onRemove,
  onClick,
  className = '',
  children,
  ...rest
}) {
  injectStyles();
  const v = active ? 'active' : variant;
  const cls = ['uww-tag', v !== 'default' ? `uww-tag--${v}` : '', className].filter(Boolean).join(' ');
  const Tag = onClick ? 'button' : 'span';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    onClick: onClick
  }, rest), leadingIcon ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-flex'
    }
  }, leadingIcon) : null, children, onRemove ? /*#__PURE__*/React.createElement("span", {
    className: "uww-tag__remove",
    role: "button",
    "aria-label": "Remove",
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6L6 18M6 6l12 12"
  }))) : null);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let _injected = false;
function injectStyles() {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const css = `
  .uww-check { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; font-family: var(--font-sans); font-size: 15px; color: var(--color-text); }
  .uww-check input { position: absolute; opacity: 0; width: 0; height: 0; }
  .uww-check__box {
    width: 20px; height: 20px; flex: none; border-radius: var(--radius-xs);
    border: var(--border-thick) solid var(--border-strong); background: var(--surface-card);
    display: flex; align-items: center; justify-content: center; color: #fff;
    transition: background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out);
  }
  .uww-check__box svg { opacity: 0; transform: scale(.5); transition: opacity var(--duration-fast), transform var(--duration-fast) var(--ease-out); }
  .uww-check input:checked + .uww-check__box { background: var(--color-action); border-color: var(--color-action); }
  .uww-check input:checked + .uww-check__box svg { opacity: 1; transform: scale(1); }
  .uww-check input:focus-visible + .uww-check__box { box-shadow: var(--focus-ring); }
  .uww-check input:disabled + .uww-check__box { background: var(--surface-muted); border-color: var(--border-default); }
  .uww-check--disabled { color: var(--color-text-muted); cursor: not-allowed; }
  `;
  const el = document.createElement('style');
  el.id = 'uww-check-styles';
  el.textContent = css;
  document.head.appendChild(el);
}

/**
 * Checkbox with brand-orange checked fill.
 */
function Checkbox({
  label,
  disabled = false,
  className = '',
  ...rest
}) {
  injectStyles();
  return /*#__PURE__*/React.createElement("label", {
    className: ['uww-check', disabled ? 'uww-check--disabled' : '', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "uww-check__box",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  }))), label ? /*#__PURE__*/React.createElement("span", null, label) : null);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let _injected = false;
function injectStyles() {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const css = `
  .uww-field { display: flex; flex-direction: column; gap: 6px; font-family: var(--font-sans); }
  .uww-field__label {
    font-family: var(--font-display); font-stretch: 75%; font-weight: 700;
    text-transform: uppercase; letter-spacing: .08em; font-size: 12px;
    color: var(--color-ink);
  }
  .uww-field__req { color: var(--color-action); margin-left: 2px; }
  .uww-input {
    font-family: var(--font-sans); font-size: 15px; color: var(--color-text);
    background: var(--surface-card);
    border: var(--border-hairline) solid var(--border-default);
    border-radius: var(--radius-md); padding: 10px 12px; width: 100%;
    transition: border-color var(--duration-fast) var(--ease-out),
                box-shadow var(--duration-fast) var(--ease-out);
  }
  .uww-input::placeholder { color: var(--color-text-subtle); }
  .uww-input:hover { border-color: var(--border-strong); }
  .uww-input:focus { outline: none; border-color: var(--color-primary); box-shadow: var(--focus-ring); }
  .uww-input[disabled] { background: var(--surface-muted); color: var(--color-text-muted); cursor: not-allowed; }
  .uww-field--error .uww-input { border-color: var(--color-danger); }
  .uww-field--error .uww-input:focus { box-shadow: 0 0 0 3px rgba(237,28,36,.30); }
  .uww-field__hint { font-size: 12px; color: var(--color-text-muted); }
  .uww-field--error .uww-field__hint { color: var(--color-danger); }
  .uww-input__wrap { position: relative; display: flex; align-items: center; }
  .uww-input__wrap .uww-input { padding-left: var(--_pl, 12px); }
  .uww-input__lead { position: absolute; left: 12px; display: flex; color: var(--color-text-muted); pointer-events: none; }
  `;
  const el = document.createElement('style');
  el.id = 'uww-input-styles';
  el.textContent = css;
  document.head.appendChild(el);
}

/**
 * Labelled text input with hint / error states.
 */
function Input({
  label,
  hint,
  error = false,
  required = false,
  leadingIcon = null,
  id,
  className = '',
  ...rest
}) {
  injectStyles();
  const inputId = id || (label ? `uww-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: ['uww-field', error ? 'uww-field--error' : '', className].filter(Boolean).join(' ')
  }, label ? /*#__PURE__*/React.createElement("label", {
    className: "uww-field__label",
    htmlFor: inputId
  }, label, required ? /*#__PURE__*/React.createElement("span", {
    className: "uww-field__req"
  }, "*") : null) : null, /*#__PURE__*/React.createElement("div", {
    className: "uww-input__wrap",
    style: leadingIcon ? {
      '--_pl': '38px'
    } : undefined
  }, leadingIcon ? /*#__PURE__*/React.createElement("span", {
    className: "uww-input__lead"
  }, leadingIcon) : null, /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    className: "uww-input",
    "aria-invalid": error || undefined
  }, rest))), hint ? /*#__PURE__*/React.createElement("span", {
    className: "uww-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let _injected = false;
function injectStyles() {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const css = `
  .uww-radio { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; font-family: var(--font-sans); font-size: 15px; color: var(--color-text); }
  .uww-radio input { position: absolute; opacity: 0; width: 0; height: 0; }
  .uww-radio__dot {
    width: 20px; height: 20px; flex: none; border-radius: 50%;
    border: var(--border-thick) solid var(--border-strong); background: var(--surface-card);
    display: flex; align-items: center; justify-content: center;
    transition: border-color var(--duration-fast) var(--ease-out);
  }
  .uww-radio__dot::after {
    content: ""; width: 10px; height: 10px; border-radius: 50%; background: var(--color-action);
    transform: scale(0); transition: transform var(--duration-fast) var(--ease-out);
  }
  .uww-radio input:checked + .uww-radio__dot { border-color: var(--color-action); }
  .uww-radio input:checked + .uww-radio__dot::after { transform: scale(1); }
  .uww-radio input:focus-visible + .uww-radio__dot { box-shadow: var(--focus-ring); }
  .uww-radio input:disabled + .uww-radio__dot { background: var(--surface-muted); border-color: var(--border-default); }
  .uww-radio--disabled { color: var(--color-text-muted); cursor: not-allowed; }
  `;
  const el = document.createElement('style');
  el.id = 'uww-radio-styles';
  el.textContent = css;
  document.head.appendChild(el);
}

/**
 * Radio button with brand-orange selected dot.
 */
function Radio({
  label,
  disabled = false,
  className = '',
  ...rest
}) {
  injectStyles();
  return /*#__PURE__*/React.createElement("label", {
    className: ['uww-radio', disabled ? 'uww-radio--disabled' : '', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio",
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "uww-radio__dot",
    "aria-hidden": "true"
  }), label ? /*#__PURE__*/React.createElement("span", null, label) : null);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let _injected = false;
function injectStyles() {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const css = `
  .uww-select-field { display: flex; flex-direction: column; gap: 6px; font-family: var(--font-sans); }
  .uww-select-field__label {
    font-family: var(--font-display); font-stretch: 75%; font-weight: 700;
    text-transform: uppercase; letter-spacing: .08em; font-size: 12px; color: var(--color-ink);
  }
  .uww-select-wrap { position: relative; display: flex; align-items: center; }
  .uww-select {
    appearance: none; -webkit-appearance: none;
    font-family: var(--font-sans); font-size: 15px; color: var(--color-text);
    background: var(--surface-card);
    border: var(--border-hairline) solid var(--border-default);
    border-radius: var(--radius-md); padding: 10px 38px 10px 12px; width: 100%; cursor: pointer;
    transition: border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
  }
  .uww-select:hover { border-color: var(--border-strong); }
  .uww-select:focus { outline: none; border-color: var(--color-primary); box-shadow: var(--focus-ring); }
  .uww-select[disabled] { background: var(--surface-muted); color: var(--color-text-muted); cursor: not-allowed; }
  .uww-select-wrap__caret {
    position: absolute; right: 12px; pointer-events: none; color: var(--color-text-muted);
    display: flex;
  }
  `;
  const el = document.createElement('style');
  el.id = 'uww-select-styles';
  el.textContent = css;
  document.head.appendChild(el);
}

/**
 * Styled native select. Pass <option>s as children, or `options` array.
 */
function Select({
  label,
  options,
  id,
  className = '',
  children,
  ...rest
}) {
  injectStyles();
  const selId = id || (label ? `uww-sel-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: ['uww-select-field', className].filter(Boolean).join(' ')
  }, label ? /*#__PURE__*/React.createElement("label", {
    className: "uww-select-field__label",
    htmlFor: selId
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    className: "uww-select-wrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    className: "uww-select"
  }, rest), options ? options.map(o => {
    const value = typeof o === 'string' ? o : o.value;
    const text = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: value,
      value: value
    }, text);
  }) : children), /*#__PURE__*/React.createElement("span", {
    className: "uww-select-wrap__caret",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  })))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let _injected = false;
function injectStyles() {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const css = `
  .uww-switch { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; font-family: var(--font-sans); font-size: 15px; color: var(--color-text); }
  .uww-switch input { position: absolute; opacity: 0; width: 0; height: 0; }
  .uww-switch__track {
    width: 42px; height: 24px; flex: none; border-radius: var(--radius-pill);
    background: var(--gray-300); position: relative;
    transition: background var(--duration-base) var(--ease-out);
  }
  .uww-switch__track::after {
    content: ""; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px;
    border-radius: 50%; background: #fff; box-shadow: var(--shadow-sm);
    transition: transform var(--duration-base) var(--ease-out);
  }
  .uww-switch input:checked + .uww-switch__track { background: var(--color-action); }
  .uww-switch input:checked + .uww-switch__track::after { transform: translateX(18px); }
  .uww-switch input:focus-visible + .uww-switch__track { box-shadow: var(--focus-ring); }
  .uww-switch input:disabled + .uww-switch__track { opacity: .5; }
  .uww-switch--disabled { color: var(--color-text-muted); cursor: not-allowed; }
  `;
  const el = document.createElement('style');
  el.id = 'uww-switch-styles';
  el.textContent = css;
  document.head.appendChild(el);
}

/**
 * Toggle switch with brand-orange "on" state.
 */
function Switch({
  label,
  disabled = false,
  className = '',
  ...rest
}) {
  injectStyles();
  return /*#__PURE__*/React.createElement("label", {
    className: ['uww-switch', disabled ? 'uww-switch--disabled' : '', className].filter(Boolean).join(' ')
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "uww-switch__track",
    "aria-hidden": "true"
  }), label ? /*#__PURE__*/React.createElement("span", null, label) : null);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
let _injected = false;
function injectStyles() {
  if (_injected || typeof document === 'undefined') return;
  _injected = true;
  const css = `
  .uww-tabs { display: flex; gap: 4px; border-bottom: var(--border-hairline) solid var(--border-subtle); }
  .uww-tab {
    appearance: none; background: none; border: none; cursor: pointer;
    font-family: var(--font-display); font-stretch: 75%; font-weight: 800;
    text-transform: uppercase; letter-spacing: .05em; font-size: 15px;
    color: var(--color-text-muted); padding: 12px 16px; position: relative;
    transition: color var(--duration-fast) var(--ease-out);
  }
  .uww-tab::after {
    content: ""; position: absolute; left: 12px; right: 12px; bottom: -1px; height: var(--border-accent);
    background: var(--color-primary); border-radius: 2px 2px 0 0;
    transform: scaleX(0); transform-origin: center; transition: transform var(--duration-base) var(--ease-out);
  }
  .uww-tab:hover { color: var(--color-ink); }
  .uww-tab--active { color: var(--color-ink); }
  .uww-tab--active::after { transform: scaleX(1); }
  .uww-tab:focus-visible { outline: none; box-shadow: var(--focus-ring); border-radius: var(--radius-sm); }
  .uww-tab__count { font-family: var(--font-sans); font-size: 12px; font-weight: 700; color: var(--color-text-subtle); margin-left: 6px; }
  .uww-tabs--ink { border-bottom-color: var(--border-on-ink); }
  .uww-tabs--ink .uww-tab { color: rgba(255,255,255,.6); }
  .uww-tabs--ink .uww-tab--active, .uww-tabs--ink .uww-tab:hover { color: #fff; }
  `;
  const el = document.createElement('style');
  el.id = 'uww-tabs-styles';
  el.textContent = css;
  document.head.appendChild(el);
}

/**
 * Underline tab bar. Controlled via `value`/`onChange`, or uncontrolled with `defaultValue`.
 */
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = 'default',
  className = '',
  ...rest
}) {
  injectStyles();
  const norm = items.map(it => typeof it === 'string' ? {
    value: it,
    label: it
  } : it);
  const [internal, setInternal] = React.useState(defaultValue ?? (norm[0] && norm[0].value));
  const active = value !== undefined ? value : internal;
  const select = v => {
    if (value === undefined) setInternal(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ['uww-tabs', variant === 'ink' ? 'uww-tabs--ink' : '', className].filter(Boolean).join(' '),
    role: "tablist"
  }, rest), norm.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.value,
    role: "tab",
    "aria-selected": active === it.value,
    className: ['uww-tab', active === it.value ? 'uww-tab--active' : ''].filter(Boolean).join(' '),
    onClick: () => select(it.value)
  }, it.label, it.count != null ? /*#__PURE__*/React.createElement("span", {
    className: "uww-tab__count"
  }, it.count) : null)));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/athlete.jsx
try { (() => {
/* UWW website UI kit — Athlete profile screen */
const {
  Button,
  Badge,
  Tag,
  Tabs,
  Stat,
  Avatar
} = window.UnitedWorldWrestlingDesignSystem_0e32df;
const {
  PhotoPanel,
  Container
} = window.UWWChrome;
const {
  Trophy,
  MapPin,
  ChevronRight
} = window.UWWIcons;
const MEDALS = [{
  yr: '2024',
  ev: 'Olympic Games — Paris',
  wc: '97 kg FS',
  medal: 'gold'
}, {
  yr: '2023',
  ev: 'World Championships — Belgrade',
  wc: '97 kg FS',
  medal: 'gold'
}, {
  yr: '2022',
  ev: 'World Championships — Belgrade',
  wc: '97 kg FS',
  medal: 'silver'
}, {
  yr: '2021',
  ev: 'Olympic Games — Tokyo',
  wc: '97 kg FS',
  medal: 'silver'
}, {
  yr: '2019',
  ev: 'World Championships — Nur-Sultan',
  wc: '97 kg FS',
  medal: 'bronze'
}];
const MEDAL_COLOR = {
  gold: '#F7941E',
  silver: '#9AA0B2',
  bronze: '#B0490C'
};
function Athlete({
  onNav
}) {
  const [tab, setTab] = React.useState('medals');
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PhotoPanel, {
    tone: "corporate",
    style: {
      minHeight: 300
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      position: 'relative',
      minHeight: 300,
      display: 'flex',
      alignItems: 'flex-end',
      gap: 28,
      paddingTop: 48,
      paddingBottom: 30
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Kyle Snyder",
    country: "USA",
    size: 148,
    ring: "gold",
    fontScale: 0.34,
    style: {
      boxShadow: 'var(--shadow-lg)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "solid"
  }, "Freestyle"), /*#__PURE__*/React.createElement(Badge, {
    variant: "ink"
  }, "97 kg")), /*#__PURE__*/React.createElement("h1", {
    style: {
      color: '#fff',
      fontSize: 64,
      margin: 0,
      lineHeight: .88
    }
  }, "Kyle Snyder"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      marginTop: 12,
      color: 'rgba(255,255,255,.85)',
      fontSize: 15,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(MapPin, {
    size: 16
  }), " United States"), /*#__PURE__*/React.createElement("span", null, "Born 1995 \xB7 Woodbine, MD"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    pill: true,
    leadingIcon: /*#__PURE__*/React.createElement(Trophy, {
      size: 17
    })
  }, "Follow athlete")))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--uww-ink)',
      borderBottom: '1px solid rgba(255,255,255,.1)'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      display: 'flex',
      gap: 52,
      padding: '24px 28px'
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: "2",
    unit: "OG",
    label: "Olympic medals",
    onInk: true
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "6",
    unit: "WC",
    label: "World medals",
    onInk: true
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "68",
    unit: "\u20134",
    label: "Senior record",
    onInk: true
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "11",
    label: "Career titles",
    onInk: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(Tabs, {
    items: ['Biography', 'Results', 'Medals'],
    value: tab === 'medals' ? 'Medals' : tab,
    onChange: v => setTab(v)
  }))), /*#__PURE__*/React.createElement(Container, {
    style: {
      padding: '32px 28px',
      display: 'grid',
      gridTemplateColumns: '1fr 300px',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 24,
      color: 'var(--color-ink)',
      margin: '0 0 16px'
    }
  }, "Medal history"), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, MEDALS.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '15px 18px',
      background: '#fff',
      borderBottom: i < MEDALS.length - 1 ? '1px solid var(--border-subtle)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: '50%',
      background: MEDAL_COLOR[m.medal],
      flex: 'none',
      boxShadow: '0 0 0 4px ' + MEDAL_COLOR[m.medal] + '22'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '75%',
      fontWeight: 800,
      fontSize: 20,
      color: 'var(--color-ink)',
      width: 52
    }
  }, m.yr), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      color: 'var(--color-ink)'
    }
  }, m.ev), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--color-text-muted)'
    }
  }, m.wc)), /*#__PURE__*/React.createElement(Badge, {
    variant: m.medal === 'gold' ? 'solid' : 'neutral',
    size: "sm",
    style: {
      textTransform: 'capitalize'
    }
  }, m.medal))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 24,
      color: 'var(--color-ink)',
      margin: '0 0 16px'
    }
  }, "Disciplines"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    variant: "accent"
  }, "Freestyle"), /*#__PURE__*/React.createElement(Tag, null, "97 kg"), /*#__PURE__*/React.createElement(Tag, null, "Senior")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      padding: 18,
      background: 'var(--surface-cream)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '75%',
      fontWeight: 800,
      textTransform: 'uppercase',
      fontSize: 12,
      letterSpacing: '.1em',
      color: 'var(--color-text-muted)',
      marginBottom: 8
    }
  }, "Next bout"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 17,
      color: 'var(--color-ink)'
    }
  }, "vs A. Sadulaev"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--color-text-muted)',
      marginTop: 2
    }
  }, "Worlds Final \xB7 74 kg \xB7 18:30"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    style: {
      marginTop: 10,
      paddingLeft: 0
    },
    trailingIcon: /*#__PURE__*/React.createElement(ChevronRight, {
      size: 15
    }),
    onClick: () => onNav('results')
  }, "View event")))));
}
Object.assign(window, {
  UWWAthlete: Athlete
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/athlete.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/chrome.jsx
try { (() => {
/* UWW website UI kit — shared chrome: Header, Footer, PhotoPanel, Container */
const {
  Button,
  IconButton
} = window.UnitedWorldWrestlingDesignSystem_0e32df;
const {
  Menu,
  Search,
  User,
  Globe,
  MapPin,
  ArrowRight
} = window.UWWIcons;
const NAV = ['News', 'Events', 'Results', 'Athletes', 'Disciplines', 'Watch'];

/* Treated photographic placeholder — navy-darkened, subject spotlight, emblem ghost.
   Mirrors the guide's photo treatment; swap for real athlete imagery in production. */
function PhotoPanel({
  tone = 'corporate',
  label,
  children,
  style
}) {
  const grad = {
    corporate: 'linear-gradient(125deg,#04003F 0%,#1a0b46 45%,#7a330b 100%)',
    world: 'linear-gradient(125deg,#04003F 0%,#10256b 50%,#0089CF 120%)',
    continental: 'linear-gradient(125deg,#2a0a1e 0%,#651142 55%,#AB2F63 120%)',
    steel: 'linear-gradient(125deg,#11142A 0%,#343A4C 100%)'
  }[tone] || tone;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: grad,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(circle at 62% 38%, rgba(245,130,32,.30), transparent 55%)'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/uww-emblem.svg",
    alt: "",
    style: {
      position: 'absolute',
      right: '-3%',
      bottom: '-12%',
      height: '125%',
      opacity: 0.10,
      filter: 'grayscale(0.2)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(4,0,63,0) 35%, rgba(4,0,63,.55) 100%)'
    }
  }), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 14,
      bottom: 12,
      fontFamily: 'var(--font-sans)',
      fontSize: 11,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,.55)'
    }
  }, label) : null, children);
}
function Container({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '0 28px',
      ...style
    }
  }, children);
}
function Header({
  onNav,
  current
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--uww-ink)',
      color: '#fff',
      borderBottom: '1px solid rgba(255,255,255,.10)'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      height: 68
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav('home'),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      cursor: 'pointer',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/uww-emblem.svg",
    alt: "UWW",
    style: {
      height: 40
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '75%',
      fontWeight: 800,
      textTransform: 'uppercase',
      lineHeight: .9,
      color: '#fff',
      fontSize: 15,
      letterSpacing: '.01em'
    }
  }, "United World", /*#__PURE__*/React.createElement("br", null), "Wrestling")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 2,
      marginLeft: 14
    }
  }, NAV.map(n => {
    const active = current === n.toLowerCase();
    return /*#__PURE__*/React.createElement("a", {
      key: n,
      onClick: () => onNav(n.toLowerCase()),
      style: {
        cursor: 'pointer',
        padding: '10px 13px',
        fontFamily: 'var(--font-display)',
        fontStretch: '75%',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '.05em',
        fontSize: 14,
        color: active ? '#fff' : 'rgba(255,255,255,.66)',
        borderBottom: active ? '3px solid var(--uww-orange)' : '3px solid transparent'
      }
    }, n);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    variant: "onInk",
    label: "Search"
  }, /*#__PURE__*/React.createElement(Search, {
    size: 20
  })), /*#__PURE__*/React.createElement(IconButton, {
    variant: "onInk",
    label: "Language"
  }, /*#__PURE__*/React.createElement(Globe, {
    size: 20
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "onInk",
    size: "sm",
    leadingIcon: /*#__PURE__*/React.createElement(User, {
      size: 16
    })
  }, "Sign in"))));
}
function Footer() {
  const cols = {
    Compete: ['Events', 'Results', 'Rankings', 'Rules'],
    Discover: ['News', 'Athletes', 'Disciplines', 'Watch UWW+'],
    Organisation: ['About UWW', 'Governance', 'Development', 'Anti-Doping']
  };
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--uww-ink)',
      color: 'rgba(255,255,255,.7)',
      paddingTop: 56
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: 32,
      paddingBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/uww-logo-lockup.svg",
    alt: "UWW",
    style: {
      height: 96,
      filter: 'brightness(0) invert(1)',
      opacity: .92
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      lineHeight: 1.6,
      marginTop: 14,
      maxWidth: 230,
      display: 'flex',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      marginTop: 1,
      color: 'var(--uww-orange)'
    }
  }, /*#__PURE__*/React.createElement(MapPin, {
    size: 15
  })), "Rue du Ch\xE2teau 6, 1804 Corsier-sur-Vevey, Switzerland")), Object.entries(cols).map(([h, items]) => /*#__PURE__*/React.createElement("div", {
    key: h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '75%',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '.1em',
      fontSize: 12,
      color: '#fff',
      marginBottom: 14
    }
  }, h), items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it,
    style: {
      display: 'block',
      color: 'rgba(255,255,255,.66)',
      fontSize: 14,
      padding: '5px 0',
      cursor: 'pointer'
    }
  }, it))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,.1)'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 56,
      fontSize: 12,
      color: 'rgba(255,255,255,.5)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 United World Wrestling 2026 \u2014 All rights reserved"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit',
      cursor: 'pointer'
    }
  }, "Privacy"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit',
      cursor: 'pointer'
    }
  }, "Terms"), /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'inherit',
      cursor: 'pointer'
    }
  }, "Contact")))));
}
Object.assign(window, {
  UWWChrome: {
    Header,
    Footer,
    PhotoPanel,
    Container
  }
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/event.jsx
try { (() => {
/* UWW website UI kit — Event / Results screen (World Championship blue theme) */
const {
  Button,
  Badge,
  Tag,
  Tabs,
  Avatar
} = window.UnitedWorldWrestlingDesignSystem_0e32df;
const {
  PhotoPanel,
  Container
} = window.UWWChrome;
const {
  Calendar,
  MapPin,
  Filter,
  ChevronRight
} = window.UWWIcons;
const WEIGHTS = ['57 kg', '65 kg', '74 kg', '86 kg', '97 kg', '125 kg'];
const RESULTS = [{
  wc: '74 kg',
  round: 'Final',
  a: {
    n: 'Kyle Snyder',
    c: 'USA'
  },
  b: {
    n: 'Abdulrashid Sadulaev',
    c: 'AIN'
  },
  sa: 6,
  sb: 4,
  by: 'Decision'
}, {
  wc: '74 kg',
  round: 'Bronze',
  a: {
    n: 'Zaurbek Sidakov',
    c: 'AIN'
  },
  b: {
    n: 'Tajmuraz Salkazanov',
    c: 'SVK'
  },
  sa: 8,
  sb: 1,
  by: 'Tech. Sup.'
}, {
  wc: '65 kg',
  round: 'Final',
  a: {
    n: 'Rahul Aware',
    c: 'IND'
  },
  b: {
    n: 'Daton Fix',
    c: 'USA'
  },
  sa: 3,
  sb: 5,
  by: 'Decision'
}, {
  wc: '65 kg',
  round: 'Semifinal',
  a: {
    n: 'Ismail Musukaev',
    c: 'HUN'
  },
  b: {
    n: 'Sebastian Rivera',
    c: 'PUR'
  },
  sa: 10,
  sb: 0,
  by: 'Tech. Sup.'
}, {
  wc: '57 kg',
  round: 'Final',
  a: {
    n: 'Zelimkhan Abakarov',
    c: 'ALB'
  },
  b: {
    n: 'Aman Sehrawat',
    c: 'IND'
  },
  sa: 2,
  sb: 6,
  by: 'Decision'
}];
function ResultRow({
  r
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '78px 1fr 64px 120px',
      alignItems: 'center',
      gap: 14,
      padding: '14px 18px',
      background: '#fff',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "neutral",
    size: "sm"
  }, r.round), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(Competitor, {
    p: r.a,
    win: r.sa > r.sb
  }), /*#__PURE__*/React.createElement(Competitor, {
    p: r.b,
    win: r.sb > r.sa
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Score, {
    v: r.sa,
    win: r.sa > r.sb
  }), /*#__PURE__*/React.createElement(Score, {
    v: r.sb,
    win: r.sb > r.sa
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--color-text-muted)',
      textAlign: 'right',
      fontWeight: 600
    }
  }, r.by));
}
function Competitor({
  p,
  win
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: p.n,
    country: p.c,
    size: 28,
    ring: win ? 'gold' : undefined
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: win ? 800 : 600,
      fontSize: 14,
      color: win ? 'var(--color-ink)' : 'var(--color-text)'
    }
  }, p.n), win ? /*#__PURE__*/React.createElement(Badge, {
    variant: "primary",
    size: "sm",
    style: {
      marginLeft: 2
    }
  }, "W") : null);
}
function Score({
  v,
  win
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '75%',
      fontWeight: 800,
      fontSize: 19,
      color: win ? 'var(--color-primary)' : 'var(--color-text-subtle)'
    }
  }, v);
}
function Event() {
  const [tab, setTab] = React.useState('results');
  const [wc, setWc] = React.useState('74 kg');
  const shown = RESULTS.filter(r => r.wc === wc);
  return /*#__PURE__*/React.createElement("div", {
    className: "theme-world"
  }, /*#__PURE__*/React.createElement(PhotoPanel, {
    tone: "world",
    style: {
      minHeight: 230
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      position: 'relative',
      minHeight: 230,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      paddingTop: 34,
      paddingBottom: 26
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/uww-emblem-world.png",
    alt: "World Championship",
    style: {
      height: 56
    }
  }), /*#__PURE__*/React.createElement(Badge, {
    variant: "live"
  }, "Live")), /*#__PURE__*/React.createElement("h1", {
    style: {
      color: '#fff',
      fontSize: 52,
      margin: 0,
      lineHeight: .92
    }
  }, "World Championships 2025"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 22,
      marginTop: 14,
      color: 'rgba(255,255,255,.85)',
      fontSize: 14,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(MapPin, {
    size: 16
  }), " Belgrade, Serbia"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Calendar, {
    size: 16
  }), " 14\u201322 September")))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 68,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(Tabs, {
    items: [{
      value: 'overview',
      label: 'Overview'
    }, {
      value: 'results',
      label: 'Results',
      count: 48
    }, {
      value: 'bracket',
      label: 'Bracket'
    }, {
      value: 'athletes',
      label: 'Athletes'
    }],
    value: tab,
    onChange: setTab
  }))), /*#__PURE__*/React.createElement(Container, {
    style: {
      padding: '32px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      color: 'var(--color-text-muted)',
      fontFamily: 'var(--font-display)',
      fontStretch: '75%',
      fontWeight: 800,
      textTransform: 'uppercase',
      fontSize: 13,
      letterSpacing: '.06em',
      marginRight: 4
    }
  }, /*#__PURE__*/React.createElement(Filter, {
    size: 15
  }), " Weight"), WEIGHTS.map(w => /*#__PURE__*/React.createElement(Tag, {
    key: w,
    active: wc === w,
    onClick: () => setWc(w)
  }, w))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '78px 1fr 64px 120px',
      gap: 14,
      padding: '11px 18px',
      background: 'var(--surface-sunken)',
      fontFamily: 'var(--font-display)',
      fontStretch: '75%',
      fontWeight: 800,
      textTransform: 'uppercase',
      fontSize: 11,
      letterSpacing: '.08em',
      color: 'var(--color-text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Round"), /*#__PURE__*/React.createElement("span", null, "Bout \u2014 ", wc, " Freestyle"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'center'
    }
  }, "Score"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right'
    }
  }, "Win by")), shown.length ? shown.map((r, i) => /*#__PURE__*/React.createElement(ResultRow, {
    key: i,
    r: r
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28,
      textAlign: 'center',
      color: 'var(--color-text-muted)',
      background: '#fff'
    }
  }, "No bouts recorded for this weight yet."))));
}
Object.assign(window, {
  UWWEvent: Event
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/event.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/home.jsx
try { (() => {
/* UWW website UI kit — Home screen */
const {
  Button,
  Badge,
  Tag,
  Card,
  Stat,
  Avatar
} = window.UnitedWorldWrestlingDesignSystem_0e32df;
const {
  PhotoPanel,
  Container
} = window.UWWChrome;
const {
  Play,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Ticket
} = window.UWWIcons;
const MATCHES = [{
  live: true,
  wc: '74 kg FS',
  round: 'Final',
  a: {
    n: 'K. Snyder',
    c: 'USA'
  },
  b: {
    n: 'A. Sadulaev',
    c: 'AIN'
  },
  sa: 4,
  sb: 6
}, {
  live: true,
  wc: '57 kg WW',
  round: 'Semifinal',
  a: {
    n: 'S. Hildebrandt',
    c: 'USA'
  },
  b: {
    n: 'Y. Susaki',
    c: 'JPN'
  },
  sa: 2,
  sb: 2
}, {
  live: false,
  wc: '97 kg GR',
  round: 'Final',
  a: {
    n: 'M. Lőrincz',
    c: 'HUN'
  },
  b: {
    n: 'A. Aleksanyan',
    c: 'ARM'
  },
  t: '18:30'
}, {
  live: false,
  wc: '125 kg FS',
  round: 'Bronze',
  a: {
    n: 'T. Akgül',
    c: 'TUR'
  },
  b: {
    n: 'A. Zare',
    c: 'IRI'
  },
  t: '19:05'
}];
const NEWS = [{
  tone: 'world',
  tag: 'World Championships',
  title: 'Belgrade set to host a record field for 2025 Worlds',
  meta: 'Sep 14 · 4 min read'
}, {
  tone: 'corporate',
  tag: 'Feature',
  title: 'Inside the rise of women\u2019s wrestling across Africa',
  meta: 'Sep 12 · 6 min read'
}, {
  tone: 'continental',
  tag: 'Rankings',
  title: 'Greco-Roman rankings shake up ahead of Continental finals',
  meta: 'Sep 11 · 3 min read'
}];
function MatchCard({
  m
}) {
  const Row = ({
    p,
    score,
    win
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: p.n.replace('. ', ' '),
    country: p.c,
    size: 32
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 14,
      color: 'var(--color-ink)',
      flex: 1
    }
  }, p.n), score != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '75%',
      fontWeight: 800,
      fontSize: 20,
      color: win ? 'var(--color-action)' : 'var(--color-text-muted)'
    }
  }, score) : null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '0 0 268px',
      background: '#fff',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '75%',
      fontWeight: 800,
      textTransform: 'uppercase',
      fontSize: 12,
      letterSpacing: '.06em',
      color: 'var(--color-text-muted)'
    }
  }, m.wc, " \xB7 ", m.round), m.live ? /*#__PURE__*/React.createElement(Badge, {
    variant: "live",
    size: "sm"
  }, "Live") : /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 12,
      color: 'var(--color-text-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Clock, {
    size: 13
  }), m.t)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(Row, {
    p: m.a,
    score: m.sa,
    win: m.sa > m.sb
  }), /*#__PURE__*/React.createElement(Row, {
    p: m.b,
    score: m.sb,
    win: m.sb > m.sa
  })));
}
function Home({
  onNav
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PhotoPanel, {
    tone: "world",
    label: "Photo: Belgrade 2025",
    style: {
      minHeight: 520
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: 520,
      paddingTop: 40,
      paddingBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "live"
  }, "Live now"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'rgba(255,255,255,.8)',
      fontFamily: 'var(--font-display)',
      fontStretch: '75%',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.12em',
      fontSize: 13
    }
  }, "World Wrestling Championships \xB7 Belgrade")), /*#__PURE__*/React.createElement("h1", {
    style: {
      color: '#fff',
      fontSize: 92,
      lineHeight: .9,
      margin: 0,
      maxWidth: 880,
      textShadow: '0 2px 30px rgba(0,0,0,.3)'
    }
  }, "The world", /*#__PURE__*/React.createElement("br", null), "comes to ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--uww-orange)'
    }
  }, "wrestle")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,.85)',
      fontSize: 19,
      maxWidth: 540,
      marginTop: 20,
      lineHeight: 1.5
    }
  }, "Ten days. Three styles. 700 athletes from 95 nations chasing gold on the sport's biggest stage."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    pill: true,
    leadingIcon: /*#__PURE__*/React.createElement(Play, {
      size: 18
    })
  }, "Watch live"), /*#__PURE__*/React.createElement(Button, {
    variant: "onInk",
    size: "lg",
    pill: true,
    leadingIcon: /*#__PURE__*/React.createElement(Ticket, {
      size: 18
    })
  }, "Buy tickets")))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-muted)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      padding: '24px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 22,
      color: 'var(--color-ink)'
    }
  }, "Today on the mat"), /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav('results'),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      cursor: 'pointer',
      color: 'var(--color-link)',
      fontFamily: 'var(--font-display)',
      fontStretch: '75%',
      fontWeight: 800,
      textTransform: 'uppercase',
      fontSize: 14,
      letterSpacing: '.05em'
    }
  }, "All results ", /*#__PURE__*/React.createElement(ChevronRight, {
    size: 15
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      overflowX: 'auto',
      paddingBottom: 4
    }
  }, MATCHES.map((m, i) => /*#__PURE__*/React.createElement(MatchCard, {
    key: i,
    m: m
  }))))), /*#__PURE__*/React.createElement(Container, {
    style: {
      padding: '56px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStretch: '75%',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.14em',
      fontSize: 13,
      color: 'var(--color-primary)',
      marginBottom: 6
    }
  }, "Latest"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 40,
      color: 'var(--color-ink)'
    }
  }, "News & stories")), /*#__PURE__*/React.createElement(Button, {
    variant: "outline"
  }, "All news")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 22
    }
  }, NEWS.map((n, i) => /*#__PURE__*/React.createElement(Card, {
    key: i,
    accent: true,
    interactive: true,
    media: /*#__PURE__*/React.createElement(PhotoPanel, {
      tone: n.tone,
      style: {
        height: '100%'
      }
    })
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "ink",
    size: "sm"
  }, n.tag), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '2px 0 0',
      fontSize: 21,
      color: 'var(--color-ink)',
      lineHeight: 1.05
    }
  }, n.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--color-text-subtle)',
      marginTop: 4
    }
  }, n.meta))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--gradient-corporate)'
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      padding: '52px 28px',
      display: 'flex',
      gap: 56,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 320
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      color: '#fff',
      margin: 0,
      fontSize: 36
    }
  }, "One global", /*#__PURE__*/React.createElement("br", null), "federation"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,.8)',
      fontSize: 15,
      marginTop: 12
    }
  }, "Governing freestyle, Greco-Roman and women's wrestling worldwide.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 48,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: "184",
    label: "Federations",
    size: "lg",
    onInk: true
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "3",
    unit: "STYLES",
    label: "Disciplines",
    size: "lg",
    onInk: true
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "120",
    unit: "YRS",
    label: "Of competition",
    size: "lg",
    onInk: true
  })))));
}
Object.assign(window, {
  UWWHome: Home
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/icons.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* UWW website UI kit — icon set (Lucide-style 1.75px stroke, substituted set).
   Real UWW.org uses a comparable thin-stroke line icon system. */
const I = (paths, fill) => ({
  size = 20,
  stroke = 2,
  ...p
} = {}) => /*#__PURE__*/React.createElement("svg", _extends({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: fill ? 'currentColor' : 'none',
  stroke: fill ? 'none' : 'currentColor',
  strokeWidth: stroke,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, p), paths);
const Menu = I(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
  x1: "3",
  y1: "6",
  x2: "21",
  y2: "6"
}), /*#__PURE__*/React.createElement("line", {
  x1: "3",
  y1: "12",
  x2: "21",
  y2: "12"
}), /*#__PURE__*/React.createElement("line", {
  x1: "3",
  y1: "18",
  x2: "21",
  y2: "18"
})));
const Search = I(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
  cx: "11",
  cy: "11",
  r: "7"
}), /*#__PURE__*/React.createElement("line", {
  x1: "21",
  y1: "21",
  x2: "16.65",
  y2: "16.65"
})));
const Play = I(/*#__PURE__*/React.createElement("path", {
  d: "M8 5v14l11-7z"
}), true);
const ArrowRight = I(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
  d: "M5 12h14"
}), /*#__PURE__*/React.createElement("path", {
  d: "M13 6l6 6-6 6"
})));
const ChevronRight = I(/*#__PURE__*/React.createElement("path", {
  d: "M9 6l6 6-6 6"
}));
const ChevronDown = I(/*#__PURE__*/React.createElement("path", {
  d: "M6 9l6 6 6-6"
}));
const Calendar = I(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
  x: "3",
  y: "4",
  width: "18",
  height: "18",
  rx: "2"
}), /*#__PURE__*/React.createElement("line", {
  x1: "16",
  y1: "2",
  x2: "16",
  y2: "6"
}), /*#__PURE__*/React.createElement("line", {
  x1: "8",
  y1: "2",
  x2: "8",
  y2: "6"
}), /*#__PURE__*/React.createElement("line", {
  x1: "3",
  y1: "10",
  x2: "21",
  y2: "10"
})));
const Clock = I(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "9"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 7v5l3 2"
})));
const Trophy = I(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
  d: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"
}), /*#__PURE__*/React.createElement("path", {
  d: "M5 4H3v2a3 3 0 0 0 3 3M19 4h2v2a3 3 0 0 1-3 3"
})));
const User = I(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "8",
  r: "4"
}), /*#__PURE__*/React.createElement("path", {
  d: "M4 21a8 8 0 0 1 16 0"
})));
const Ticket = I(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
  d: "M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V7z"
}), /*#__PURE__*/React.createElement("line", {
  x1: "13",
  y1: "5",
  x2: "13",
  y2: "19"
})));
const MapPin = I(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
  d: "M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "10",
  r: "2.5"
})));
const Globe = I(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "9"
}), /*#__PURE__*/React.createElement("path", {
  d: "M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"
})));
const Filter = I(/*#__PURE__*/React.createElement("path", {
  d: "M3 5h18l-7 8v6l-4-2v-4z"
}));
const Medal = I(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "15",
  r: "6"
}), /*#__PURE__*/React.createElement("path", {
  d: "M9 9L6 3M15 9l3-6M9.5 3h5"
})));
Object.assign(window, {
  UWWIcons: {
    Menu,
    Search,
    Play,
    ArrowRight,
    ChevronRight,
    ChevronDown,
    Calendar,
    Clock,
    Trophy,
    User,
    Ticket,
    MapPin,
    Globe,
    Filter,
    Medal
  }
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/icons.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
