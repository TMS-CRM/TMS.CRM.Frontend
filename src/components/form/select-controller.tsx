/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { ErrorObject, SelectControllerProps } from '../../types/form';

const SelectController: React.FC<SelectControllerProps> = (props: SelectControllerProps) => {
  const { control } = useFormContext();

  function getObjectValueFromPath(obj: unknown, path: string): ErrorObject {
    return path.split('.').reduce((acc, part) => acc && (acc as Record<string, unknown>)[part], obj) as ErrorObject;
  }

  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field, formState: { errors } }) => {
        const error = getObjectValueFromPath(errors, props.name);
        const labelId = `${props.name}-label`;

        return (
          <FormControl fullWidth error={!!error}>
            <InputLabel id={labelId} disabled={props.disabled} shrink={props.forceShrink}>
              {props.label}
            </InputLabel>
            <Select
              id={props.name}
              label={props.label}
              labelId={labelId}
              value={field.value ?? ''}
              onChange={(event) => {
                field.onChange(event);
                props.onChange?.(event);
              }}
              IconComponent={KeyboardArrowDownIcon}
              sx={{ width: '100%' }}
            >
              {props.options
                ?.sort((a, b) => a.label?.localeCompare(b.label) ?? 0)
                .map(({ value, label, customLabel, disabled }) => (
                  <MenuItem key={value} value={value} disabled={disabled}>
                    {customLabel ?? label}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText>{error?.message}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

export default SelectController;
