import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export function clearAuthCookies(store: ReadonlyRequestCookies) {
  store.delete("sessionId");
  store.delete("deviceId");
  store.delete("refreshToken");
}

export function cookieSetter({
  store,
  key,
  value,
  expiresAt,
}: {
  store: ReadonlyRequestCookies;
  key: string;
  value: string;
  expiresAt: number;
}) {
  store.set(key, value, {
    expires: expiresAt,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
}
