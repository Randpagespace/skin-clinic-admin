import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { sealSession, openSession, parseLoginData } from "../src/lib/session-codec.ts";

const key = randomBytes(32);
const user = { staffId: 7, name: "테스트 직원", role: "DIRECTOR", accessToken: "test-only-token", accessTokenExpiresAt: new Date(Date.now() + 3600_000).toISOString(), mustChangePassword: false, remember: false };

test("valid session preserves identity and password-change restriction without exposing access token", async () => {
  const pending = { ...user, mustChangePassword: true };
  const cookie = await sealSession(pending, key);
  assert.equal(cookie.includes(user.accessToken), false);
  assert.deepEqual(await openSession(cookie, key), pending);
});
test("modified and foreign-key cookies cannot authenticate", async () => {
  const cookie = await sealSession(user, key);
  const pieces = cookie.split('.');
  pieces[3] = (pieces[3][0] === 'A' ? 'B' : 'A') + pieces[3].slice(1);
  assert.equal(await openSession(pieces.join('.'), key), null);
  assert.equal(await openSession(cookie, randomBytes(32)), null);
});
test("expired backend token cannot authorize a session", async () => {
  const cookie = await sealSession({ ...user, accessTokenExpiresAt: new Date(Date.now() - 1000).toISOString() }, key);
  assert.equal(await openSession(cookie, key), null);
});
test("missing credentials and unsupported roles are rejected at the backend response boundary", () => {
  assert.throws(() => parseLoginData({ ...user, accessToken: '' }));
  assert.throws(() => parseLoginData({ ...user, role: 'ADMIN' }));
  assert.throws(() => parseLoginData({ ...user, mustChangePassword: undefined }));
  assert.throws(() => parseLoginData({ ...user, accessTokenExpiresAt: 'invalid' }));
});
