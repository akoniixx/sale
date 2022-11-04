/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import { AnyObjectSchema } from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enableReinitial?: boolean;
  defaultValues: Record<string, any>;
  children: JSX.Element | JSX.Element[];
  schema: AnyObjectSchema;
  style?: ViewStyle;
}

export const Form = ({
  defaultValues = {},
  children,
  schema,
  enableReinitial,
}: Props): JSX.Element => {
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (enableReinitial) {
      methods.reset(defaultValues);
    }
  }, [defaultValues, enableReinitial, methods]);

  return <FormProvider {...methods}>{children}</FormProvider>;
};
