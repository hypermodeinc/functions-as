import { Colors } from "assemblyscript/util/terminal.js";
import { WriteStream as FSWriteStream } from "fs";
import { WriteStream as TTYWriteStream } from "tty";

export default (stream: FSWriteStream | TTYWriteStream, svg = false) => {
  if (svg) {
    writeMarkdownLogo(stream);
  } else {
    writeAsciiLogo(stream);
  }
};

function writeAsciiLogo(stream: FSWriteStream | TTYWriteStream) {
  const logo = String.raw`
     __ __                                __   
    / // /_ _____  ___ ______ _  ___  ___/ /__ 
   / _  / // / _ \/ -_) __/  ' \/ _ \/ _  / -_)
  /_//_/\_, / .__/\__/_/ /_/_/_/\___/\_,_/\__/ 
       /___/_/                                 
`;
  const colors = new Colors(stream as { isTTY: boolean });
  stream.write(colors.blue(logo) + "\n");
}

function writeMarkdownLogo(stream: FSWriteStream | TTYWriteStream) {
  const url =
    "https://raw.githubusercontent.com/gohypermode/.github/main/hypermode.svg";
  stream.write(`![Hypermode](${url})\n\n`);
}
