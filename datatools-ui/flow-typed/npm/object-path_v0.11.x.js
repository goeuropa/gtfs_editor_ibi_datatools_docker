// flow-typed signature: 8e08c7b448e19eef73737b79fa31c8ae
// flow-typed version: <<STUB>>/object-path_v0.11.4/flow_v0.53.1

declare module 'object-path' {
  declare module.exports: {
    ensureExists(obj: ?Object | Array<any>, string | Array<string>, ?any): ?any,
    get(obj: ?Object | Array<any>, string | Array<string>): ?any,
    set(obj: ?Object | Array<any>, string, any): ?any
  }
}
