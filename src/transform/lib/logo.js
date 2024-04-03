import { Colors } from "assemblyscript/util/terminal.js";
export default (stream) => {
    const colors = new Colors(stream);
    stream.write(colors.blue(String.raw `
     __ __                                __   
    / // /_ _____  ___ ______ _  ___  ___/ /__ 
   / _  / // / _ \/ -_) __/  ' \/ _ \/ _  / -_)
  /_//_/\_, / .__/\__/_/ /_/_/_/\___/\_,_/\__/ 
       /___/_/                                 
`));
    stream.write("\n");
};
//# sourceMappingURL=logo.js.map