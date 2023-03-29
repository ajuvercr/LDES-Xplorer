import { writable, type Readable, type Writable } from "svelte/store";
import { RDFS, curlQuads } from "./util";
import type { Quad } from "n3";
import { ContextParser, type JsonLdContextNormalized } from "jsonld-context-parser";

export type Property = {
  name: string;
  url: string;
  description?: string;
}

const curls: { [url: string]: Promise<Quad[]> } = {};
const properties: { [url: string]: Writable<Property> } = {};
const contexts: JsonLdContextNormalized[] = [];

async function setup() {
  const myParser = new ContextParser();
  const ctx = await myParser.parse("http://prefix.cc/context.jsonld");
  contexts.push(ctx);
}

try {
  setup()
} catch (ex: any) { }

async function curl(url: string): Promise<Quad[]> {
  const parsed = new URL(url);
  parsed.hash = "";

  const easyUrl = parsed.toString();
  if (easyUrl in curls) {
    console.log("Cached curl!", easyUrl);
    return curls[easyUrl];
  }
  console.log("Looking for", easyUrl);
  curls[easyUrl] = curlQuads(easyUrl);

  return curls[easyUrl];
}

function checkCtx(st: Writable<Property>) {
  st.update(x => {
    const ctx = contexts.find(c => x.url != c.compactIri(x.url, true));

    if (ctx) {
      x.name = ctx.compactIri(x.url);
    }

    return x;
  });
}

async function getInfo(url: string, st: Writable<Property>, noLookup: boolean) {
  try {
    checkCtx(st);

    if (noLookup) return;
    const quads = await curl(url);
    for (let quad of quads) {
      if (quad.subject.value === url) {
        if (quad.predicate.equals(RDFS.terms.label)) {
          st.update(x => {
            x.name = quad.object.value;
            return x;
          });
        }

        if (quad.predicate.equals(RDFS.terms.comment)) {
          st.update(x => {
            x.description = quad.object.value;
            return x;
          });
        }
      }
    }
  } catch (ex: any) {
    throw ex;
  }
}

export function addContext(ctx: JsonLdContextNormalized) {
  contexts.push(ctx);

  Object.values(properties).forEach(checkCtx);
}

export function getProperty(url: string, noLookup?: boolean): Readable<Property> {
  if (!properties[url]) {
    const st = writable({ name: url.slice(), url: url.slice() });
    properties[url] = st;
    getInfo(url, st, !!noLookup);
  }

  return properties[url];
}
