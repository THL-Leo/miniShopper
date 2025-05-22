import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Button } from '../../components/common/Button';
import { COLORS } from '../../constants/design';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPress} />
    );

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPress} />
    );

    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator when loading prop is true', () => {
    const onPress = jest.fn();
    const { queryByText, getByTestId } = render(
      <Button title="Test Button" onPress={onPress} loading={true} />
    );

    expect(queryByText('Test Button')).toBeNull();
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button title="Test Button" onPress={onPress} disabled={true} testID="button" />
    );

    const button = getByTestId('button');
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('applies different styles for different variants', () => {
    const onPress = jest.fn();
    const { rerender, getByTestId } = render(
      <Button title="Test Button" onPress={onPress} variant="primary" testID="button" />
    );

    let button = getByTestId('button');
    expect(button.props.style.backgroundColor).toBe(COLORS.primary);

    rerender(
      <Button title="Test Button" onPress={onPress} variant="secondary" testID="button" />
    );
    button = getByTestId('button');
    expect(button.props.style.backgroundColor).toBe(COLORS.secondary);

    rerender(
      <Button title="Test Button" onPress={onPress} variant="outline" testID="button" />
    );
    button = getByTestId('button');
    expect(button.props.style.backgroundColor).toBe('transparent');
    expect(button.props.style.borderWidth).toBe(1);
  });
}); 