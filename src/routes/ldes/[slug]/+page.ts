import type { Quad, Term } from 'n3';
import type { PageLoad } from './$types';
import { TREE, RDF, curlQuads } from '$lib/util';

export type LdesView = {
  ldes: string;
  view: string;
  url: string;
};

export type LdesRelation = {
  ty: string;
  ref: string;
  path?: string;
  values?: string[];
};

function getTy(inp: string): string {
  switch (inp) {
    case TREE.GreaterThanOrEqualRelation: return "is greater than or equal to";
    case TREE.custom("EqualThanRelation"): return "equals";
    case TREE.custom("GreaterThanRelation"): return "is greater than";
    case TREE.custom("LessThanRelation"): return "is less than";
    case TREE.custom("LessThanOrEqualRelation"): return "is less than or equal to";
  }
  return "??";
}

function findRelation(triples: Quad[], id: Term): LdesRelation | undefined {
  const mTy = triples.find(q => q.subject.equals(id) && q.predicate.equals(RDF.terms.type))?.object.value
  if (!mTy) return;

  const ty = getTy(mTy);
  const ref = triples.find(q => q.subject.equals(id) && q.predicate.equals(TREE.terms.node))?.object.value;
  if (!ref) return;

  const path = triples.find(q => q.subject.equals(id) && q.predicate.equals(TREE.terms.path))?.object.value;
  const values = triples.filter(q => q.subject.equals(id) && q.predicate.equals(TREE.terms.value)).map(q => q.object.value);

  return { ref, ty, path, values };
}

export const load = (async ({ params }) => {
  let triples: Quad[] = [];
  let members: Term[] = [];
  let views: LdesView[] = [];
  let relations: LdesRelation[] = [];
  let error: any;

  console.log(params.slug);

  try {
    triples = await curlQuads(params.slug, { redirect: "follow" }, fetch);

    for (let triple of triples) {
      if (triple.predicate.equals(TREE.terms.view)) {
        const ldes = triple.subject.value;
        const url = triple.object.value;

        views.push({ ldes, url, view: url });
      }

      if (triple.predicate.equals(TREE.terms.relation)) {
        const relation = findRelation(triples, triple.object);
        if (relation) {
          relations.push(relation);
        }
      }
      if (triple.predicate.equals(TREE.terms.member)) {
        members.push(triple.object);
      }
    }
  } catch (ex) {
    error = ex;
  }
  return {
    triples: triples,
    error,
    members,
    views, relations
  };
}) satisfies PageLoad;


export const ssr = false;
export const prerender = false;
