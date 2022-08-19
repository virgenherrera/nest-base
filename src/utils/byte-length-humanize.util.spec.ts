import { byteLengthHumanize } from './byte-length-humanize.util';

describe(`UT:${byteLengthHumanize.name}`, () => {
  it('Should not Throw', () => {
    expect(() => byteLengthHumanize(1024)).not.toThrow();
  });

  it('Should return the correct value', () => {
    expect(byteLengthHumanize(1024)).toBe('1.00 KB');
  });

  it('Should return the correct value', () => {
    expect(byteLengthHumanize(1025 * 1024)).toBe('1.00 MB');
  });

  it('Should return the correct value', () => {
    expect(byteLengthHumanize(1025 * 1024 * 1024)).toBe('1.00 GB');
  });

  it('Should return the correct value', () => {
    expect(byteLengthHumanize(1025 * 1024 * 1024 * 1024)).toBe('1.00 TB');
  });
});
