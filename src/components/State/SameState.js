import React, { useState } from "react";

const SameState = () => {
  const [num, setNum] = useState(1);
  console.log("SameState render", num);

  return (
    <div>
      <button onClick={() => setNum(2)}>Set Number: 2</button>
      <button onClick={() => setNum(3)}>Set Number: 3</button>
    </div>
  );
};
export default SameState;
