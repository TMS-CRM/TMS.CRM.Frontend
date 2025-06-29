import type { JSX } from 'react';

export interface ControllerProps {
  name: string;
  label?: string;
  rows?: number;
  disabled?: boolean;
  skeletonOnLoading?: boolean;
  loading?: boolean;
  onChange?: (value: object) => void;
  placeholder?: string;
  className?: string;
}

export interface TextFieldControllerProps extends ControllerProps {
  type?: string;
  startAdornment?: JSX.Element;
  endAdornment?: JSX.Element;
  multiline?: boolean;
}

export interface CheckboxControllerProps {
  name: string;
  completed?: boolean;
  onChange?: (value: object) => void;
  className?: string;
}

export interface SelectControllerProps extends ControllerProps {
  options: SelectOption[] | null;
  forceShrink?: boolean;
}

export interface ErrorObject {
  message: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
  customLabel?: JSX.Element | null;
  disabled?: boolean;
}

export interface DatePickerControllerProps {
  name: string;
  label?: string;
  clearable?: boolean;
  loading?: boolean;
  skeletonOnLoading?: boolean;
  minDate?: Date;
  maxDate?: Date;
}
