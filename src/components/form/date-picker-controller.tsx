/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { FormControl, FormHelperText, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Controller, useFormContext } from 'react-hook-form';
import type { DatePickerControllerProps, ErrorObject } from '../../types/form';

const DatePickerController: React.FC<DatePickerControllerProps> = (props: DatePickerControllerProps) => {
  const { control } = useFormContext();

  function getObjectValueFromPath(obj: unknown, path: string): ErrorObject | undefined {
    return path.split('.').reduce((acc, part) => (acc && (acc as Record<string, unknown>)[part]) ?? undefined, obj) as ErrorObject | undefined;
  }

  const { label, minDate, maxDate, clearable, name } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState: { errors } }) => {
        const error = getObjectValueFromPath(errors, name);

        return (
          <FormControl fullWidth>
            <DateTimePicker
              label={label}
              minDate={minDate}
              maxDate={maxDate}
              value={field.value ?? null}
              onChange={(val) => field.onChange(val)}
              enableAccessibleFieldDOMStructure={false}
              slots={{ textField: TextField }}
              slotProps={{
                textField: {
                  error: !!error,
                  helperText: error?.message,
                  InputProps: {
                    sx: { fontSize: { xs: 14, sm: 16 } },
                  },
                },
                actionBar: {
                  actions: clearable ? ['clear', 'accept'] : ['accept'],
                },
              }}
            />
          </FormControl>
        );
      }}
    />
  );
};

export default DatePickerController;
