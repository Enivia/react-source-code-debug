import React, { useState } from "react";

const arrs = [
  ["a", "b", "c", "d"],
  ["d", "a", "b", "c"],
];

const ListNodeMove = () => {
  const [index, setIndex] = useState(0);

  return (
    <div>
      <button onClick={() => setIndex(index === 0 ? 1 : 0)}>toggle</button>
      <ul>
        {arrs[index].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
export default ListNodeMove;
