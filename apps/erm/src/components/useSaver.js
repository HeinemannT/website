import { useState } from 'react';
import { useStore } from '../store.jsx';

/* Shared save behaviour for tools: persist an artifact + mark the lesson complete. */
export function useSaver(lessonId, artifactId) {
  const { saveArtifact, markComplete, hasArtifact } = useStore();
  const [justSaved, setJustSaved] = useState(false);
  const save = (payload = {}) => {
    saveArtifact(artifactId, payload);
    markComplete(lessonId);
    setJustSaved(true);
  };
  return { save, justSaved, saved: hasArtifact(artifactId) };
}
