declare module "*.svg" {
    const content: Element<React.SVGAttributes<SVGElement>>;
    export default content;
  }

declare module '*.png' {
  const content: any;
  export default content;
}