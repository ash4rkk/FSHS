import { useState } from "react";
// unicafe: 1.14*

const App = () => {
  // Anecdotes 1.13*
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));
  const handleClick = () => {
    const randomNumber = Math.floor(Math.random() * anecdotes.length);
    console.log(randomNumber);
    setSelected(randomNumber);
  };
  const handleVote = () => {
    const copyOfVotes = [...votes];
    copyOfVotes[selected] += 1;
    setVotes(copyOfVotes);
  };
  const votesMax = () => {
    return votes.indexOf(Math.max(...votes));
  };
  console.log(votesMax());
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>{votes[selected]}</p>
      <button onClick={handleClick}>next anecdote</button>
      <button onClick={handleVote}>vote</button>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[votesMax()]}</p>
      <p>has {votes[votesMax()]} votes</p>
    </div>
  );
};
export default App;
