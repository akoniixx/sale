import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import { ViewStyle } from 'react-native';
import Button from '../Button/Button';

interface Props {
  title: string;
  testID?: string;
  disabled?: boolean;
  style?: ViewStyle;
  secondary?: boolean;
  radius?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any, e: unknown, reset: unknown) => void;
}

export const SubmitButton = ({
  title,
  disabled = false,
  onSubmit,
  style,
  radius,
}: Props): JSX.Element => {
  const { handleSubmit, reset } = useFormContext();
  return (
    <Button
      style={style}
      onPress={handleSubmit((data, e) => {
        onSubmit(data, e, reset);
      })}
      radius={radius}
      title={title}
      disabled={disabled}
    />
  );
};

SubmitButton.propTypes = {
  title: PropTypes.string,
  disable: PropTypes.bool,
  modal: PropTypes.bool,
  style: PropTypes.object,
  fontSize: PropTypes.string,
  testID: PropTypes.string,
};
