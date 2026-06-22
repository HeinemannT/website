import React from 'react';
import { getLesson } from '../curriculum.js';
import { LessonShell } from '../components/LessonShell.jsx';
import { Lead, Objectives, Stage } from '../components/prose.jsx';
import { CodeExercise } from '../components/CodeExercise.jsx';
import { MarkComplete } from '../components/MarkComplete.jsx';

const lesson = getLesson('0.1');
const readings = [
  { kind: 'FREE', title: 'JavaScript First Steps — MDN', note: 'Mozilla’s gentle, authoritative intro to variables, functions, and arrays.', href: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps' },
  { kind: 'FREE', title: 'The Modern JavaScript Tutorial (javascript.info)', note: 'The best free, structured course — read “An Introduction” and “JavaScript Fundamentals”.', href: 'https://javascript.info/' },
  { kind: 'FREE', title: 'freeCodeCamp — JavaScript Algorithms and Data Structures', note: 'A free, hands-on course if you want lots of practice.', href: 'https://www.freecodecamp.org/learn/' },
];

export default function LessonJSPrimer() {
  return (
    <LessonShell lesson={lesson} readings={readings}>
      <Lead>You don’t need to be a programmer to take this course — but a few times along the way you’ll write a short piece of JavaScript to build a model yourself. This page gives you everything you’ll need, from scratch. If you already code, skip it.</Lead>

      <p className="measure">Programming sounds intimidating and mostly isn’t. A program is just a list of instructions a computer follows exactly. You’ll only ever use a handful of building blocks, and you’ll practise each one right here, in a box that runs your code and checks it. You can’t break anything — experiment freely, and reach for <strong>Show solution</strong> whenever you’re stuck.</p>

      <Objectives items={[
        'Read and write a simple JavaScript function that returns a value.',
        'Use variables, arrays, loops, and conditions.',
        'Run code, read the result, and fix a mistake — with zero prior experience.',
      ]} />

      <Stage n={1} kicker="The one idea" title="A function takes input and returns output" />
      <p className="measure">Almost everything you’ll write is a <em>function</em>: a little machine that takes some inputs and hands back a result. Here’s the whole shape:</p>
      <p className="measure"><span style={{ fontFamily: 'monospace', background: '#f0ece2', borderRadius: '6px', padding: '2px 6px' }}>function double(x) &#123; return x * 2; &#125;</span></p>
      <p className="measure">That reads: “a function called <em>double</em>, which takes one input <em>x</em>, and gives back <em>x</em> times two.” The word <span style={{ fontFamily: 'monospace' }}>return</span> is how a function hands its answer back — forget it and the function gives nothing. <span style={{ fontFamily: 'monospace' }}>*</span> means multiply, <span style={{ fontFamily: 'monospace' }}>/</span> divide, <span style={{ fontFamily: 'monospace' }}>+</span> and <span style={{ fontFamily: 'monospace' }}>-</span> as you’d expect. Try it: write a function that adds two numbers.</p>

      <CodeExercise
        id="0.1-add"
        title="Your first function"
        prompt="Make addTwo return the sum of its two inputs, a and b."
        entry="addTwo"
        starter={`function addTwo(a, b) {
  // TODO: return a plus b
  return 0;
}`}
        solution={`function addTwo(a, b) {
  return a + b;
}`}
        test={(fn) => (fn(2, 3) === 5 && fn(-1, 1) === 0)
          ? { pass: true, summary: 'Correct — addTwo(2, 3) gives 5. You just wrote and ran a program.' }
          : { pass: false, summary: `addTwo(2, 3) gave ${fn(2, 3)} (should be 5). Replace the TODO with: return a + b;` }}
      />

      <Stage n={2} kicker="Collections" title="Arrays, and looping over them" />
      <p className="measure">An <em>array</em> is an ordered list, written with square brackets: <span style={{ fontFamily: 'monospace' }}>[10, 20, 30]</span>. Risk work is full of lists — a list of risks, of losses, of outcomes — so you’ll often want to walk through one. The cleanest way is <span style={{ fontFamily: 'monospace' }}>for (const item of list)</span>, which runs the same step for every item:</p>
      <p className="measure"><span style={{ fontFamily: 'monospace', background: '#f0ece2', borderRadius: '6px', padding: '2px 6px' }}>let total = 0; for (const x of [1, 2, 3]) &#123; total = total + x; &#125;</span></p>
      <p className="measure">After that runs, <span style={{ fontFamily: 'monospace' }}>total</span> is 6. (<span style={{ fontFamily: 'monospace' }}>let</span> makes a value you can change; <span style={{ fontFamily: 'monospace' }}>const</span> makes one you won’t.) Now add up a whole list yourself.</p>

      <CodeExercise
        id="0.1-sum"
        title="Add up a list"
        prompt="Return the sum of all the numbers in the array xs. Start total at 0 and loop, adding each number."
        entry="sumList"
        starter={`function sumList(xs) {
  let total = 0;
  // TODO: loop over xs and add each number to total
  return total;
}`}
        solution={`function sumList(xs) {
  let total = 0;
  for (const x of xs) {
    total = total + x;
  }
  return total;
}`}
        test={(fn) => (fn([1, 2, 3, 4]) === 10 && fn([]) === 0)
          ? { pass: true, summary: 'Correct — sumList([1,2,3,4]) gives 10. This exact pattern powers the Monte Carlo engine later.' }
          : { pass: false, summary: `sumList([1,2,3,4]) gave ${fn([1, 2, 3, 4])} (should be 10). Loop with for (const x of xs) and do total = total + x.` }}
      />

      <Stage n={3} kicker="Decisions" title="Conditions, and a coin to flip" />
      <p className="measure">To make a choice, use <span style={{ fontFamily: 'monospace' }}>if</span>. Comparisons give you <span style={{ fontFamily: 'monospace' }}>true</span> or <span style={{ fontFamily: 'monospace' }}>false</span>: <span style={{ fontFamily: 'monospace' }}>&gt;</span> greater than, <span style={{ fontFamily: 'monospace' }}>&lt;</span> less than, <span style={{ fontFamily: 'monospace' }}>===</span> equal. And one special tool you’ll use constantly in risk: <span style={{ fontFamily: 'monospace' }}>Math.random()</span> gives a fresh random number between 0 and 1 each time it’s called — that’s how we simulate chance. “A 30% chance” is just <span style={{ fontFamily: 'monospace' }}>Math.random() &lt; 0.3</span>. Try returning a simple true/false.</p>

      <CodeExercise
        id="0.1-if"
        title="A simple test"
        prompt="Return true if spent is greater than budget, otherwise false."
        entry="isOverBudget"
        starter={`function isOverBudget(spent, budget) {
  // TODO: return whether spent is greater than budget
  return false;
}`}
        solution={`function isOverBudget(spent, budget) {
  return spent > budget;
}`}
        test={(fn) => (fn(120, 100) === true && fn(80, 100) === false)
          ? { pass: true, summary: 'Correct — spending 120 against a budget of 100 returns true. You can now read every code box in this course.' }
          : { pass: false, summary: `isOverBudget(120, 100) gave ${String(fn(120, 100))} (should be true). The whole answer is: return spent > budget;` }}
      />

      <p className="measure">That’s genuinely all the JavaScript you need: functions that return values, arrays and loops, and conditions. Every “build it” box later combines just these, with a helper or two handed to you. When something looks unfamiliar, come back here — and lean on the free tutorials below to go deeper at your own pace.</p>

      <MarkComplete lessonId="0.1" label="I’ve got the basics — mark complete" />
    </LessonShell>
  );
}
