// These are used by the save function as the fallback for empty heights, so they
// stay in JavaScript rather than being passed from PHP. Changing them changes the
// saved content, so it requires a block deprecation. Keep them in sync with
// `FSB_DEFAULT_SPACER_HEIGHT` and `FSB_DEFAULT_SPACER_HEIGHT_UNIT` in PHP.
export const DEFAULT_SPACER_HEIGHT = 100;
export const DEFAULT_SPACER_HEIGHT_UNIT = 'px';
