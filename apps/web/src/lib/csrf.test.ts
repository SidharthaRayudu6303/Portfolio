import test, { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateCsrfToken, verifyCsrfToken } from './csrf.ts';

describe('CSRF Security Utilities', () => {
  it('should generate a 64-character hex cryptographically secure token', () => {
    const token1 = generateCsrfToken();
    const token2 = generateCsrfToken();

    assert.strictEqual(typeof token1, 'string');
    assert.strictEqual(token1.length, 64);
    assert.strictEqual(typeof token2, 'string');
    assert.strictEqual(token2.length, 64);
    assert.notStrictEqual(token1, token2);
  });

  it('should accept matching cookie and header CSRF tokens', () => {
    const token = generateCsrfToken();
    const isValid = verifyCsrfToken(token, token);
    assert.strictEqual(isValid, true);
  });

  it('should reject when either cookie or header token is missing', () => {
    const token = generateCsrfToken();
    assert.strictEqual(verifyCsrfToken(undefined, token), false);
    assert.strictEqual(verifyCsrfToken(token, undefined), false);
    assert.strictEqual(verifyCsrfToken(null, token), false);
    assert.strictEqual(verifyCsrfToken(token, null), false);
    assert.strictEqual(verifyCsrfToken('', token), false);
    assert.strictEqual(verifyCsrfToken(token, ''), false);
  });

  it('should reject mismatched CSRF tokens', () => {
    const tokenA = generateCsrfToken();
    const tokenB = generateCsrfToken();
    assert.strictEqual(verifyCsrfToken(tokenA, tokenB), false);
  });

  it('should reject tokens with length mismatch safely', () => {
    const tokenA = generateCsrfToken();
    const shortToken = tokenA.slice(0, 32);
    assert.strictEqual(verifyCsrfToken(tokenA, shortToken), false);
  });
});
