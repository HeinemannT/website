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
  const [menuOpen, setMenuOpen] = React.useState(false);
  // Close the mobile drawer whenever the route changes.
  React.useEffect(() => { setMenuOpen(false); }, [route]);
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
    <>
      <header className="topbar ui">
        <button className="hamb" aria-label="Open course menu" aria-expanded={menuOpen}
                onClick={() => setMenuOpen(o => !o)}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="tb-title" onClick={() => navigate('#/')}>Enterprise Risk Management</span>
      </header>
      <div className="app">
        <Sidebar activeId={activeId} open={menuOpen} onClose={() => setMenuOpen(false)} />
        {content}
      </div>
      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
    </>
  );
}
