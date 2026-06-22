import LessonJSPrimer from './LessonJSPrimer.jsx';
import LessonMathPrimer from './LessonMathPrimer.jsx';
import Orientation from './Orientation.jsx';
import Lesson11 from './Lesson11.jsx';
import Lesson12 from './Lesson12.jsx';
import Lesson13 from './Lesson13.jsx';
import Lesson14 from './Lesson14.jsx';
import Lesson2a from './Lesson2a.jsx';
import Lesson2b from './Lesson2b.jsx';
import Lesson2c from './Lesson2c.jsx';
import Lesson2d from './Lesson2d.jsx';
import Lesson2e from './Lesson2e.jsx';
import Lesson2f from './Lesson2f.jsx';
import Lesson2g from './Lesson2g.jsx';
import Lesson30 from './Lesson30.jsx';
import Lesson31 from './Lesson31.jsx';
import Lesson32 from './Lesson32.jsx';
import Lesson33 from './Lesson33.jsx';
import Lesson34 from './Lesson34.jsx';
import Lesson35 from './Lesson35.jsx';
import Lesson36 from './Lesson36.jsx';
import Lesson37 from './Lesson37.jsx';
import Lesson38 from './Lesson38.jsx';
import Lesson39 from './Lesson39.jsx';
import Lesson41 from './Lesson41.jsx';
import Lesson42 from './Lesson42.jsx';
import Lesson43 from './Lesson43.jsx';
import Lesson44 from './Lesson44.jsx';
import Lesson45 from './Lesson45.jsx';
import Lesson46 from './Lesson46.jsx';
import Lesson47 from './Lesson47.jsx';
import Lesson48 from './Lesson48.jsx';
import Lesson5a from './Lesson5a.jsx';
import Lesson5b from './Lesson5b.jsx';
import Lesson5c from './Lesson5c.jsx';
import Lesson5d from './Lesson5d.jsx';
import Lesson5e from './Lesson5e.jsx';

/* Registry of built lessons. As each lesson is authored it gets registered here;
   lessons not yet present render a "coming soon" placeholder so the shell stays navigable. */
export const LESSON_COMPONENTS = {
  '0.1': LessonJSPrimer,
  '0.2': LessonMathPrimer,
  '1.0': Orientation,
  '1.1': Lesson11,
  '1.2': Lesson12,
  '1.3': Lesson13,
  '1.4': Lesson14,
  '2a': Lesson2a,
  '2b': Lesson2b,
  '2c': Lesson2c,
  '2d': Lesson2d,
  '2e': Lesson2e,
  '2f': Lesson2f,
  '2g': Lesson2g,
  '3.0': Lesson30,
  '3.1': Lesson31,
  '3.2': Lesson32,
  '3.3': Lesson33,
  '3.4': Lesson34,
  '3.5': Lesson35,
  '3.6': Lesson36,
  '3.7': Lesson37,
  '3.8': Lesson38,
  '3.9': Lesson39,
  '4.1': Lesson41,
  '4.2': Lesson42,
  '4.3': Lesson43,
  '4.4': Lesson44,
  '4.5': Lesson45,
  '4.6': Lesson46,
  '4.7': Lesson47,
  '4.8': Lesson48,
  '5a': Lesson5a,
  '5b': Lesson5b,
  '5c': Lesson5c,
  '5d': Lesson5d,
  '5e': Lesson5e,
};

export function hasLesson(id) { return !!LESSON_COMPONENTS[id]; }
