import { cn } from '@/lib/utils/cn';

describe('cn utility', () => {
  it('merges multiple class names', () => {
    expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3');
  });

  it('filters out falsy values', () => {
    expect(cn('class1', undefined, 'class2', null, false, 'class3')).toBe(
      'class1 class2 class3'
    );
  });

  it('handles empty input', () => {
    expect(cn()).toBe('');
  });

  it('handles only falsy values', () => {
    expect(cn(undefined, null, false)).toBe('');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    const isDisabled = false;

    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe(
      'base active'
    );
  });
});
