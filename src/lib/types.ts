// place files you want to import through the `$lib` alias in this folder.
export type CardItem = {
  img?: string;
  name?: string;
  handle?: string;
  info?: string;
  pronouns?: string;
  blank?: boolean;
}

export type Clicked = {
  left: number;
  top: number;
  width: number;
  height: number;
  ratio: number;
  src: string;
  alt: string;
};