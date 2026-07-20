import { describe, it, expect } from 'vitest';
import { DisplayUrlPipe } from './display-url.pipe';

describe('DisplayUrlPipe', () => {
  const pipe = new DisplayUrlPipe();

  it('strips mailto: prefix', () => {
    expect(pipe.transform('mailto:gabriele@example.com')).toBe('gabriele@example.com');
  });

  it('strips https:// prefix', () => {
    expect(pipe.transform('https://github.com/user')).toBe('github.com/user');
  });

  it('strips http:// prefix', () => {
    expect(pipe.transform('http://example.com')).toBe('example.com');
  });

  it('strips trailing slash', () => {
    expect(pipe.transform('https://linkedin.com/in/user/')).toBe('linkedin.com/in/user');
  });

  it('does not alter paths without trailing slash', () => {
    expect(pipe.transform('https://github.com/user/repo')).toBe('github.com/user/repo');
  });
});
