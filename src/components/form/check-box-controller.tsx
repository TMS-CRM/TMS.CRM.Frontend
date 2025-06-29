/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { FormControl, FormHelperText } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { Controller, useFormContext } from 'react-hook-form';
import type { CheckboxControllerProps, ErrorObject } from '../../types/form';

const CheckboxController: React.FC<CheckboxControllerProps> = (props: CheckboxControllerProps) => {
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

        return (
          <FormControl>
            <Checkbox
              id={props.name}
              checked={!!field.value}
              onChange={(event) => {
                field.onChange(event.target.checked);
                props.onChange?.(event);
              }}
              icon={<CheckBoxOutlineBlankIcon sx={{ color: '#7E92A2' }} />}
              checkedIcon={<CheckBoxIcon sx={{ color: '#2dc8a8' }} />}
            />
            <FormHelperText error>{error?.message as React.ReactNode}</FormHelperText>
          </FormControl>
        );
      }}
    />
  );
};

export default CheckboxController;
