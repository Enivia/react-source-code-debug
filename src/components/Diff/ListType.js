import React from "react";

const ListType = () => {
  const [toggle, setToggle] = React.useState(true);

  return (
    <div>
      <div>
        Current: {toggle.toString()}
        <button onClick={() => setToggle((d) => !d)}>Toggle</button>
      </div>

      {toggle ? [<p key="a">a</p>, <p key="b">b</p>] : [<div key="a">a</div>, <div key="b">b</div>]}
    </div>
  );
};
export default ListType;
