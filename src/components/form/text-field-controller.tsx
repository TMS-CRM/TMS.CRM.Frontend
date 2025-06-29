/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { TextFieldProps } from '@mui/material';
import { FormControl, FormHelperText, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { ErrorObject, TextFieldControllerProps } from '../../types/form';

const TextFieldController: React.FC<TextFieldControllerProps & TextFieldProps> = (props: TextFieldControllerProps & TextFieldProps) => {
  const { control } = useFormContext();

  function getObjectValueFromPath(obj: unknown, path: string): ErrorObject | undefined {
    return path.split('.').reduce((acc, part) => acc && (acc as Record<string, unknown>)[part], obj) as ErrorObject | undefined;
  }

  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field, formState: { errors } }) => {
        const error = getObjectValueFromPath(errors, props.name);

        return (
          <FormControl fullWidth>
            <TextField
              {...props}
              id={props.name}
              error={!!error}
              helperText={error?.message}
              multiline={props.multiline}
              rows={props.rows}
              placeholder={props.placeholder}
              {...field}
            />
            <FormHelperText error>{error?.message as React.ReactNode}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

export default TextFieldController;
