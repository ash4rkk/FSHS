const PersonForm = ({
  handleSubmit,
  nameValue,
  onNameChange,
  numberValue,
  onNumberChange,
}) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={nameValue} onChange={onNameChange} />
        </div>{" "}
        <div>
          number: <input value={numberValue} onChange={onNumberChange} />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  );
};

export default PersonForm;
