import { marked } from 'marked';

export function timelineBounds(points) {
  const dated = points.filter(p => Number.isFinite(p.year));
  if (!dated.length) return null;
  return { min: Math.min(...dated.map(p => p.year)), max: Math.max(...dated.map(p => p.year_end ?? p.year)) };
}
export function visibleEvents(points, year, includeUndated = true) {
  return points.filter(p => p.year == null ? includeUndated : p.year <= year)
    .sort((a, b) => (a.year ?? Infinity) - (b.year ?? Infinity));
}
export function nextTimelineYear(year, bounds, step = 4) {
  return bounds ? Math.min(bounds.max, Math.max(bounds.min, year + step)) : null;
}
export function formatRecordDate(record) {
  if (record.normalization_status === 'verified' && record.date_precision === 'day' && record.event_date)
    return `${record.event_date} (verified Western date)`;
  if (record.date_precision === 'range') return `c. ${record.year_start}–${record.year_end} (inferred)`;
  return record.original_date || 'Date unrecorded';
}
export function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// Marked's renderer sees text tokens only; URLs and HTML attributes never enter the glossary matcher.
export function renderGlossaryMarkdown(text, terms = []) {
  // Short homographs such as Zi (字/子) and Li (厘/李) need context and remain unlinked.
  const names = terms.map(t => t.term).filter(t => t?.length > 2).sort((a,b) => b.length-a.length);
  const regex = names.length ? new RegExp(`\\b(${names.map(t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})\\b`,'gi') : null;
  const renderer = new marked.Renderer();
  renderer.text = value => regex ? value.replace(regex, match => `<span class="glossary-term text-cinnabar dark:text-red-400 cursor-help border-b border-dashed" data-term-key="${escapeHtml(match.toLowerCase())}">${escapeHtml(match)}</span>`) : value;
  return marked.parse(text || '', { renderer });
}

export function treeLayout(people) {
  const naturalParent = new Map();
  for (const person of people) for (const child of person.children || []) naturalParent.set(child, person.id);
  const adoptedParent = new Map();
  for (const person of people) for (const child of person.adopted_children || []) adoptedParent.set(child, person.id);
  return { naturalParent, adoptedParent,
    renderedChildren: person => [...(person.children || []), ...(person.adopted_children || []).filter(id => !naturalParent.has(id))],
    adoptionReferences: person => (person.adopted_children || []).filter(id => naturalParent.has(id)) };
}

export function validateData(data, tree) {
  const errors = [], pages = new Map(data.pages.map(p => [p.page_id,p]));
  if (pages.size !== data.pages.length) errors.push('Duplicate page ID');
  for (const p of data.pages) {
    if (new Set(p.columns.map(c=>c.id)).size !== p.columns.length) errors.push(`${p.page_id}: duplicate column`);
    for (const c of p.columns) if (c.map_data) {
      const r = c.map_data;
      if (r.page_ref!==p.page_id || r.column_ref!==c.id) errors.push(`${p.page_id}/${c.id}: record provenance`);
      if (!r.original_calendar || !r.original_date || !r.date_precision || !r.normalization_status) errors.push(`${p.page_id}/${c.id}: missing calendar evidence`);
      if (r.event_date && (r.normalization_status!=='verified'||r.date_precision!=='day'||!r.source_url)) errors.push(`${p.page_id}/${c.id}: unverified exact date`);
    }
  }
  const points = new Map(data.migration.points.map(p=>[p.id,p]));
  if (points.size !== data.migration.points.length) errors.push('Duplicate map point');
  for (const p of points.values()) {
    if (!pages.has(p.page_ref) || !p.column_refs?.every(c=>pages.get(p.page_ref).columns.some(x=>x.id===c))) errors.push(`${p.id}: invalid source`);
    if (!p.event_type || !p.evidence || !p.date_label || !p.coordinate_precision) errors.push(`${p.id}: missing evidence`);
    if (p.year!==null && !Number.isFinite(p.year)) errors.push(`${p.id}: invalid year`);
    if (p.year==null && p.event_date) errors.push(`${p.id}: unknown date has exact day`);
    if (p.year_end != null && p.year_end<p.year) errors.push(`${p.id}: reversed range`);
  }
  for(const path of data.migration.paths) if(!points.has(path.fromId)||!points.has(path.toId)||!path.evidence||!path.caption) errors.push('Unsupported map path');
  const people = new Map(tree.people.map(p=>[p.id,p]));
  if (people.size!==tree.people.length) errors.push('Duplicate person ID');
  const naturalCounts=new Map();
  for (const p of tree.people) {
    if (p.page_ref&&!pages.has(p.page_ref)) errors.push(`${p.id}: invalid page`);
    for (const id of [...(p.children||[]),...(p.adopted_children||[])]) {
      if (!people.has(id)) errors.push(`${p.id}: missing child ${id}`);
      else if (people.get(id).generation !== p.generation+1) errors.push(`${p.id}: generation mismatch ${id}`);
    }
    for (const id of p.children||[]) naturalCounts.set(id,(naturalCounts.get(id)||0)+1);
  }
  for (const [id,count] of naturalCounts) if(count>1) errors.push(`${id}: multiple natural parents`);
  const reached=new Set();
  function visit(id, stack=new Set()) {
    if(stack.has(id)){errors.push(`${id}: biological/adoption cycle`);return;}
    if(reached.has(id))return;
    reached.add(id);const p=people.get(id);if(!p)return;
    for(const child of [...(p.children||[]),...(p.adopted_children||[])]) visit(child,new Set(stack).add(id));
  }
  visit(tree.root_id);
  for(const id of people.keys())if(!reached.has(id))errors.push(`${id}: unreachable person`);
  return errors;
}
