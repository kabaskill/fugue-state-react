import { useEffect } from "react";
import abcjs from "abcjs";

const SheetMusic = ({ id, notation }) => {
  useEffect(() => {
    abcjs.renderAbc(id, notation, { selectionColor: "#000000" });
  }, [notation]);

  return <div id={id} className="w-full h-full"></div>;
};

export default SheetMusic;
