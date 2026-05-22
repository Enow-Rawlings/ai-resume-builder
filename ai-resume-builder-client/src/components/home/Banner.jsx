import React from "react";

const Banner = () => {
  return (
      <div
        className="w-full py-2.5 font-medium text-sm text-white text-center"
        style={{ backgroundImage: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}
      >
        <p>
          <span className="px-3 py-1 rounded-md text-[#282427]/600 bg-white mr-2">
            New
          </span>
          AI Feature Added
        </p>
    </div>
  );
};

export default Banner;
