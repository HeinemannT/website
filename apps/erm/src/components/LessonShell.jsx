import React from 'react';
import { neighbours } from '../curriculum.js';
import { navigate } from '../router.js';
import { useStore } from '../store.jsx';
import { Readings } from './prose.jsx';
import { Retrieval } from './Retrieval.jsx';

export function LessonShell({ lesson, retrieval, readings, children }) {
  const { isComplete } = useStore();
  const { prev, next } = neighbours(lesson.id);
  const done = isComplete(lesson.id);

  return (
    <main>
      <div className="eyebrow">{lesson.partN} · Lesson {lesson.id}</div>
      <h1>{lesson.title}</h1>
      {done && (
        <div className="done-banner">
          ✓ Lesson complete — its artifact is saved to your risk operating model.
        </div>
      )}

      {children}

      {retrieval && <Retrieval items={retrieval} />}
      {readings && <Readings items={readings} />}

      <div className="navbtns ui">
        {prev
          ? <a onClick={() => navigate(`#/lesson/${prev.id}`)}>← {prev.id} · {prev.title}</a>
          : <span />}
        {next
          ? <a onClick={() => navigate(`#/lesson/${next.id}`)}>{next.id} · {next.title} →</a>
          : <span />}
      </div>
    </main>
  );
}
