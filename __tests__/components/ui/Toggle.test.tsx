import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from '@/components/ui/Toggle';

describe('Toggle Component', () => {
  it('renders correctly', () => {
    render(<Toggle checked={false} onChange={jest.fn()} label="Test Toggle" />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('displays checked state', () => {
    render(<Toggle checked={true} onChange={jest.fn()} label="Test Toggle" />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Toggle checked={false} onChange={handleChange} label="Test Toggle" />);

    const toggle = screen.getByRole('switch');
    await user.click(toggle);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with opposite value', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Toggle checked={true} onChange={handleChange} label="Test Toggle" />);

    const toggle = screen.getByRole('switch');
    await user.click(toggle);

    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <Toggle
        checked={false}
        onChange={handleChange}
        label="Test Toggle"
        disabled
      />
    );

    const toggle = screen.getByRole('switch');
    await user.click(toggle);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('applies disabled class when disabled', () => {
    render(
      <Toggle
        checked={false}
        onChange={jest.fn()}
        label="Test Toggle"
        disabled
      />
    );
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveClass('cursor-not-allowed');
    expect(toggle).toHaveClass('opacity-50');
  });

  it('applies correct background color when checked', () => {
    render(<Toggle checked={true} onChange={jest.fn()} label="Test Toggle" />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveClass('bg-amber-600');
  });

  it('applies correct background color when unchecked', () => {
    render(<Toggle checked={false} onChange={jest.fn()} label="Test Toggle" />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveClass('bg-gray-700');
  });
});
