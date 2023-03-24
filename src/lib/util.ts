import { DataFactory, NamedNode, Parser, Quad } from "n3";
import * as jsonld from 'jsonld';
import { ContextParser } from "jsonld-context-parser";
import { addContext } from "./properties";
import { writable } from "svelte/store";

export type ToolTipContent = { content: string, hovered: boolean };
export const toolTipContent = writable({ content: "", hovered: false });

type RecordOf<TKey extends any[], TValue> = Record<TKey[number], TValue>;

const factory = DataFactory;
export type Namespace<TKey extends any[], TValue, IValue> =
  { namespace: TValue, custom: (input: IValue) => TValue } & RecordOf<TKey, TValue>;

/**
 * Creates a function that expands local names from the given base URI,
 * and exports the given local names as properties on the returned object.
 */
export function createNamespace<TKey extends string, TValue, IValue extends string>(
  baseUri: string,
  toValue: (expanded: string) => TValue,
  ...localNames: TKey[]):
  Namespace<typeof localNames, TValue, IValue> {
  const expanded: Namespace<typeof localNames, TValue, IValue> = {} as any;
  // Expose the main namespace
  expanded.namespace = toValue(baseUri);
  expanded.custom = (v) => toValue(baseUri + v);
  // Expose the listed local names as properties
  for (const localName of localNames) {
    (expanded as RecordOf<TKey[], TValue>)[localName] = toValue(`${baseUri}${localName}`);
  }
  return expanded;
}

/**
 * Creates a function that expands local names from the given base URI into strings,
 * and exports the given local names as properties on the returned object.
 */
export function createUriNamespace<T extends string>(baseUri: string, ...localNames: T[]):
  Namespace<typeof localNames, string, string> {
  return createNamespace(baseUri, (expanded): string => expanded, ...localNames);
}

/**
 * Creates a function that expands local names from the given base URI into named nodes,
 * and exports the given local names as properties on the returned object.
 */
export function createTermNamespace<T extends string>(baseUri: string, ...localNames: T[]):
  Namespace<typeof localNames, NamedNode, string> {
  return createNamespace(baseUri, factory.namedNode, ...localNames);
}

/**
 * Creates a function that expands local names from the given base URI into string,
 * and exports the given local names as properties on the returned object.
 * Under the `terms` property, it exposes the expanded local names as named nodes.
 */
export function createUriAndTermNamespace<T extends string>(baseUri: string, ...localNames: T[]):
  Namespace<typeof localNames, string, string> & { terms: Namespace<typeof localNames, NamedNode, string> } {
  return Object.assign(createUriNamespace(baseUri, ...localNames),
    { terms: createTermNamespace(baseUri, ...localNames) });
}

export const TREE = createUriAndTermNamespace('https://w3id.org/tree#',
  'Collection',
  'member',
  'view',
  'value',
  'relation',
  'PrefixRelation',
  'SubstringRelation',
  'SuffixRelation',
  'GreaterThanRelation',
  'GreaterThanOrEqualRelation',
  'LessThanRelation',
  'LessThanOrEqualToRelation',
  'EqualToRelation',
  'GeospatiallyContainsRelation',
  'path',
  'node',
  'shape',
  'search',
  'ConditionalImport',
  'import',
  'importStream',
  'remainingItems',
  'zoom',
  'latitudeTile',
  'longitudeTile',
);


export const RDF = createUriAndTermNamespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  'type',
  'Class',
  'Property',
  'nil',
  'rest',
  'first',
);

export const RDFS = createUriAndTermNamespace('http://www.w3.org/2000/01/rdf-schema#',
  'label',
  'comment',
  'domain',
  'range',
  'isDefinedBy',
  'Class',
  'subClassOf'
);

export async function curlQuads(url: string, init?: RequestInit, mfetch?: typeof fetch): Promise<Quad[]> {
  if (!url) return [];
  try {
    const f = mfetch || fetch;
    const doc = await f(url, init);
    const docText = await doc.text();
    let quads;
    try {
      quads = new Parser({ baseIRI: url }).parse(docText);
    } catch (ex: any) {
      const json = JSON.parse(docText);
      const myParser = new ContextParser();
      myParser.parse(json["@context"]).then(addContext);

      const things = await jsonld.toRDF(json, { format: "application/n-quads" });
      quads = new Parser({ baseIRI: url }).parse(<string><any>things);
    }
    if (!quads) {
      throw "Failed to parse quads";
    }
    console.log("Got", quads.length, "quads for", url);
    return quads;
  } catch (e: any) {
    console.error("Failed to get quads from", url, e.toString());
    return []
  }
}

