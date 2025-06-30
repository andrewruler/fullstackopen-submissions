import { useState } from 'react';

const Button = (props) => (
  <button onClick={props.onClick}>{props.children}</button>
);

const StatisticLine = (props) => (
  <>
    <td>{props.children}</td>
    <td>{props.value}</td>
  </>
);

const Statistics = (props) => (
  <>
    <h1>statistics</h1>
    <table>
      <tbody>
        <tr><StatisticLine value={props.good}>good</StatisticLine></tr>
        <tr><StatisticLine value={props.neutral}>neutral</StatisticLine></tr>
        <tr><StatisticLine value={props.bad}>bad</StatisticLine></tr>
        <tr><StatisticLine value={props.all}>all</StatisticLine></tr>
        <tr><StatisticLine value={props.average}>average</StatisticLine></tr>
        <tr><StatisticLine value={props.positive}>positive</StatisticLine></tr>
      </tbody>
    </table>
  </>
);

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const all = good + neutral + bad;
  const average = all === 0 ? 0 : (good - bad) / all;
  const positive = all === 0 ? 0 : (good / all) * 100;

  return (
    <>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)}>good</Button>
      <Button onClick={() => setNeutral(neutral + 1)}>neutral</Button>
      <Button onClick={() => setBad(bad + 1)}>bad</Button>
      {all !== 0 && (
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          all={all}
          average={average}
          positive={positive}
        />
      )}
    </>
  );
};

export default App;
