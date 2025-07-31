import { ReactNode } from 'react';

// Base component props
export interface WebflowComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  'data-w-id'?: string;
}

// Layout props
export interface ResponsiveProps {
  xs?: boolean | string | number;
  sm?: boolean | string | number;
  md?: boolean | string | number;
  lg?: boolean | string | number;
  xl?: boolean | string | number;
  '2xl'?: boolean | string | number;
}

// Container props
export interface WContainerProps extends WebflowComponentProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | string;
  padding?: boolean;
}

// Grid props
export interface WRowProps extends WebflowComponentProps {
  gap?: string | number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
}

export interface WColProps extends WebflowComponentProps, ResponsiveProps {
  span?: number | 'auto';
  offset?: number;
  order?: number;
}

// Button props
export interface WButtonProps extends WebflowComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

// Typography props
export interface WHeadingProps extends WebflowComponentProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
}

export interface WTextProps extends WebflowComponentProps {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  italic?: boolean;
  underline?: boolean;
  lineThrough?: boolean;
}

// Image props
export interface WImageProps extends WebflowComponentProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

// Link props
export interface WLinkProps extends WebflowComponentProps {
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  external?: boolean;
  underline?: boolean;
  color?: string;
}

// Form props
export interface WFormProps extends WebflowComponentProps {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  method?: 'GET' | 'POST';
  action?: string;
  noValidate?: boolean;
}

export interface WInputProps extends WebflowComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline';
  error?: boolean;
  helperText?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export interface WTextareaProps extends WebflowComponentProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  rows?: number;
  cols?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outline';
  error?: boolean;
  helperText?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}

// Section props
export interface WSectionProps extends WebflowComponentProps {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'white' | 'gray' | 'primary' | 'secondary' | string;
  fullHeight?: boolean;
}

// Card props
export interface WCardProps extends WebflowComponentProps {
  variant?: 'default' | 'outlined' | 'elevated' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickable?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

// Navigation props
export interface WNavbarProps extends WebflowComponentProps {
  brand?: ReactNode;
  sticky?: boolean;
  transparent?: boolean;
  shadow?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

// Modal props
export interface WModalProps extends WebflowComponentProps {
  open: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
  backdrop?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

// Tabs props
export interface WTabsProps extends WebflowComponentProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
}

export interface WTabProps extends WebflowComponentProps {
  value: string;
  disabled?: boolean;
}

export interface WTabPanelProps extends WebflowComponentProps {
  value: string;
}

// Accordion props
export interface WAccordionProps extends WebflowComponentProps {
  multiple?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
}

export interface WAccordionItemProps extends WebflowComponentProps {
  value: string;
  disabled?: boolean;
}

// Slider props
export interface WSliderProps extends WebflowComponentProps {
  autoplay?: boolean;
  interval?: number;
  infinite?: boolean;
  dots?: boolean;
  arrows?: boolean;
  slidesToShow?: number;
  slidesToScroll?: number;
  responsive?: Array<{
    breakpoint: number;
    settings: Partial<WSliderProps>;
  }>;
}

// Theme context
export interface WebflowTheme {
  colors: Record<string, any>;
  typography: Record<string, any>;
  spacing: Record<string, any>;
  breakpoints: Record<string, string>;
  shadows: Record<string, string>;
  borders: Record<string, any>;
  animations: Record<string, any>;
}

export interface WebflowProviderProps {
  theme?: Partial<WebflowTheme>;
  children: ReactNode;
}