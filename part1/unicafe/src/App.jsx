import { useState } from "react";
// unicafe: 1.11*
const Button = ({ handleClick, feedback }) => {
  return <button onClick={handleClick}> {feedback}</button>;
};
const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};
const Statistict = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  const average = () => {
    if (all === 0) return 0;
    const av = ((good - bad) / all).toFixed(2);
    return av;
  };

  const positive = () => {
    if (all === 0) return 0;
    const pos = ((good / all) * 100).toFixed(2) + " %";
    return pos;
  };
  if (all === 0) return <p>No feedback!</p>;
  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average()} />
          <StatisticLine text="positive" value={positive()} />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const addToGood = () => {
    setGood(good + 1);
  };

  const addToNeutral = () => {
    setNeutral(neutral + 1);
  };

  const addToBad = () => {
    setBad(bad + 1);
  };
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={addToGood} feedback="good" />
      <Button handleClick={addToNeutral} feedback="neutral" />
      <Button handleClick={addToBad} feedback="bad" />
      <Statistict good={good} neutral={neutral} bad={bad} />
    </div>
  );
};
export default App;
