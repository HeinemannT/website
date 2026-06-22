import React from 'react';
import { useRoute, navigate } from './router.js';
import { getLesson } from './curriculum.js';
import { Sidebar } from './components/Sidebar.jsx';
import { Home } from './components/Home.jsx';
import { LESSON_COMPONENTS } from './lessons/index.js';
import { LessonShell } from './components/LessonShell.jsx';
import { GlossaryPage } from './components/Glossary.jsx';

function Placeholder({ lesson }) {
  return (
    <LessonShell lesson={lesson}>
      <p className="lead">This lesson is on its way.</p>
      <p className="measure">
        The course is being built part by part. The structure, your saved work, and the lessons already published stay
        exactly as they are — this one will appear here when it’s ready, in the same shape as the lessons you’ve seen:
        understand it, quantify what’s measurable, then build the artifact for your organization.
      </p>
    </LessonShell>
  );
}

export default function App() {
  const route = useRoute();
  let activeId = null;
  let content;

  if (route.view === 'lesson') {
    const lesson = getLesson(route.id);
    if (!lesson) {
      content = <main><h1>Not found</h1><p><a onClick={() => navigate('#/')}>Back to the course</a></p></main>;
    } else {
      activeId = lesson.id;
      const Comp = LESSON_COMPONENTS[lesson.id];
      content = Comp ? <Comp /> : <Placeholder lesson={lesson} />;
    }
  } else if (route.view === 'glossary') {
    content = <GlossaryPage />;
  } else {
    content = <Home />;
  }

  return (
    <div className="app">
      <Sidebar activeId={activeId} />
      {content}
    </div>
  );
}
