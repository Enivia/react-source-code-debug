import React from "react";

const DuplicatedKey = () => {
  const [toggle, setToggle] = React.useState(true);

  return (
    <div>
      <div>
        Current: {toggle.toString()}
        <button onClick={() => setToggle((d) => !d)}>Toggle</button>
      </div>

      {toggle ? [<p key="a">a</p>, <p key="a">a</p>] : [<p key="b">b</p>, <p key="b">b</p>]}
    </div>
  );
};
export default DuplicatedKey;
