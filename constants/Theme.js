const tintColor = '#0d0d0d';

const palette = {
  primary: tintColor,
  secondary: '#ff4b34',
  tertiary: '#33ba20',
  quaternary: '#ffd111',
  active: tintColor,
  inActive: '#bababa',
  gray: '#f5f5f5',
  darkGray: '#838283',
  white: '#fff',
  transparent: 'transparent',
  error: '#d32f2f'
};

const app = {
  backgroundColor: palette.white
};

const header = {
  backgroundColor: palette.primary
};

const tab = {
  backgroundColor: palette.white
};

const surface = {
  backgroundColor: palette.white,
  borderRadius: 5,
  overflow: 'hidden'
};

const text = {
  fontSize: 13
};

const p = {
  ...text,
  fontSize: 15
};

const generateHeadings = color =>
  [30, 27, 24, 20, 17].reduce((pv, cv, i) => {
    return {
      ...pv,
      [`h${i + 1}`]: {
        ...text,
        fontSize: cv,
        color
      }
    };
  }, {});

export const Theme = {
  paper: {
    colors: palette
  },

  palette,

  app,
  header,
  tab,

  surface,

  text,
  p,
  ...generateHeadings(),

  innerSpacing: 20,
  innerPadding: 25,
  innerBorderRadius: 7,
  shadow: {
    elevation: 4,
    // ios shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2
  }
};

export const DarkTheme = {
  paper: {
    colors: palette
  },

  palette,

  app: {
    ...app,
    backgroundColor: tintColor
  },
  header: {
    ...header,
    backgroundColor: tintColor
  },
  tab,

  surface: {
    ...surface,
    backgroundColor: '#3a3a3a'
  },

  text: {
    ...text,
    color: palette.white
  },
  p: {
    ...p,
    color: palette.white
  },
  ...generateHeadings(palette.white)
};
