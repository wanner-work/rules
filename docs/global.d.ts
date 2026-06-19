import getMDXComponents from "@/methods/getMDXComponents";

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
