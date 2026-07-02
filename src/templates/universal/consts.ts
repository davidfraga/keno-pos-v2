export const NL = '\n';
//const encondigs = ['GB2312', 'GBK'];
export const DEFAULT_LINE = {
  // encoding: 'ISO-8859-1'
};

export const BOLDER = {
  ...DEFAULT_LINE,
  widthtimes: 1,
  heigthtimes: 1,
  fonttype: 3
};

export const BOLD = {
  ...DEFAULT_LINE,
  widthtimes: 1,
  heigthtimes: 0,
  size: 32
};

export const BOLD2X = {
  ...DEFAULT_LINE,
  widthtimes: 1,
  heigthtimes: 2
};

export const SMALL_BOLD = {
  ...DEFAULT_LINE,
  widthtimes: 0,
  heigthtimes: 0,
  fonttype: 1
};

export const FULL_LINE = `----------------${NL}`;
