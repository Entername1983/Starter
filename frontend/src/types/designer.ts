export interface IColorPalette {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
  }
}

export interface IBorderStyle {
  id: string
  name: string
  width: string
  style:
    | 'solid'
    | 'dashed'
    | 'dotted'
    | 'double'
    | 'groove'
    | 'ridge'
    | 'inset'
    | 'outset'
  radius: string
}

export interface IFontSettings {
  id: string
  name: string
  fontFamily: string
  fontSize: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
    '5xl': string
  }
  fontWeight: {
    normal: string
    medium: string
    semibold: string
    bold: string
    extrabold: string
    black: string
  }
}

export interface ISpacingSettings {
  id: string
  name: string
  padding: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  margin: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  gap: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
}

export interface IUIPreset {
  id: string
  name: string
  type:
    | 'sidebar'
    | 'navbar'
    | 'mobile-sidebar'
    | 'mobile-navbar'
    | 'card-grid'
    | 'dashboard'
    | 'neo-brutalist'
    | 'pixel-retro'
    | 'synthwave'
  description: string
  isMobile: boolean
}

export interface IColorPaletteHistory {
  id: string
  name: string
  colors: IColorPalette['colors']
  timestamp: number
}

export interface IDesignerState {
  selectedColorPalette: IColorPalette | null
  selectedBorderStyle: IBorderStyle | null
  selectedFontSettings: IFontSettings | null
  selectedSpacingSettings: ISpacingSettings | null
  selectedUIPreset: IUIPreset | null
  customColors: Partial<IColorPalette['colors']>
  customBorder: Partial<IBorderStyle>
  customFont: Partial<IFontSettings>
  customSpacing: Partial<ISpacingSettings>
  colorPaletteHistory: IColorPaletteHistory[]
  isDarkMode: boolean
}
