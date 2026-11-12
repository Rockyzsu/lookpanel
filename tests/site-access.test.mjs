import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { moduleUrl } from "./compile.mjs";

const i18n = moduleUrl("export const t = (text) => text;");
const network = moduleUrl(
  readFileSync("src/lib/network.ts", "utf8").replace(
    '"@/i18n"',
    JSON.stringify(i18n),
  ),
);
const api = await import(
  moduleUrl(
    readFileSync("src/views/home/api.ts", "utf8")
      .replace('"@/i18n"', JSON.stringify(i18n))
      .replace('"@/lib/network"', JSON.stringify(network)),
  )
);

test("site probes use the website origin when an egress endpoint is unavailable", () => {
  assert.equal(
    api.siteProbeUrl({ domain: "www.amazon.com", url: "https://ignored.test" }),
    "https://www.amazon.com/",
  );
  assert.equal(
    api.siteProbeUrl({ url: "https://api.ip.sb/jsonip" }),
    "https://api.ip.sb/jsonip",
  );
});

test("site reachability is independent from egress-IP parsing", async () => {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(url);
    return new Response(null, { status: 404 });
  };
  try {
    assert.equal(
      await api.probeSite({
        domain: "www.amazon.com",
        icon: "",
        name: "Amazon",
        method: "cftrace",
      }),
      true,
    );
    assert.deepEqual(calls, ["https://www.amazon.com/"]);
  } finally {
    globalThis.fetch = original;
  }
});

test("site reachability reports transport failure as inaccessible", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new TypeError("offline");
  };
  try {
    assert.equal(
      await api.probeSite({
        domain: "www.example.com",
        icon: "",
        name: "Example",
        method: "cftrace",
      }),
      false,
    );
  } finally {
    globalThis.fetch = original;
  }
});

test("site inspection reuses a successful egress response as reachability", async () => {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(url);
    return new Response("ip=1.1.1.1\nloc=SG\n", { status: 200 });
  };
  try {
    const result = await api.inspectSite({
      domain: "www.example.com",
      icon: "",
      name: "Example",
      method: "cftrace",
    });
    assert.equal(result.reachable, true);
    assert.equal(result.geo?.ip, "1.1.1.1");
    assert.deepEqual(calls, ["https://www.example.com/cdn-cgi/trace"]);
  } finally {
    globalThis.fetch = original;
  }
});

test("restricted egress providers only receive connectivity probes", async () => {
  const catalog = JSON.parse(readFileSync("src/views/home/sites.json", "utf8"));
  const names = [
    "shein.com",
    "aliexpress.com",
    "bybit.com",
    "etsy.com",
    "amazon.com",
    "ebay.com",
    "1password.com",
  ];
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, mode: init.mode });
    return new Response(null);
  };
  try {
    for (const name of names) {
      const site = catalog.find((entry) => entry.name === name);
      assert.ok(site);
      const result = await api.inspectSite(site);
      assert.equal(result.reachable, true);
      assert.equal(result.geo, undefined);
      assert.deepEqual(calls.at(-1), {
        url: `https://${site.domain}/`,
        mode: "no-cors",
      });
    }
    assert.equal(calls.length, names.length);
  } finally {
    globalThis.fetch = original;
  }
});

test("IPv6 failures are not retried as website probes", async () => {
  const catalog = JSON.parse(readFileSync("src/views/home/sites.json", "utf8"));
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(url);
    throw new TypeError("IPv6 unavailable");
  };
  try {
    for (const name of ["ipify IPv6", "Cloudflare IPv6"]) {
      const site = catalog.find((entry) => entry.name === name);
      const before = calls.length;
      assert.deepEqual(await api.inspectSite(site), { reachable: false });
      assert.equal(calls.length, before + 1);
      assert.equal(api.siteFailureLabel(site), "home.ipv6ProbeUnavailable");
    }
  } finally {
    globalThis.fetch = original;
  }
});
