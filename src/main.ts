interface Item {
  id: number;
  parent: number | string;
  type?: string | null;
}

interface TreeStoreInterface {
  getAll: () => Item[];
  getItem: (id: number) => Item;
  getChildren: (id: number) => Item[];
  getAllChildren: (id: number) => Item[];
  getAllParents: (id: number) => Item[];
}

export class TreeStore implements TreeStoreInterface {
  itemArray: Item[];
  itemMap: Map<number, Item>;
  stack: Item[];
  result: Item[];

  constructor(itemArray: Item[]) {
    this.itemArray = itemArray;
    this.itemMap = new Map();
    this.itemArray.forEach((item) => this.itemMap.set(item.id, item));
    this.stack = [];
    this.result = [];
  }

  getAll() {
    return this.itemArray;
  }

  getItem(id: number) {
    return this.itemMap.get(id)!;
  }

  getChildren(id: number) {
    return this.itemArray.filter((item) => item.parent === id);
  }

  getAllChildren(id: number) {
    this.stack = [this.getItem(id)];
    this.result = [];

    while (this.stack.length > 0) {
      const node = this.stack.pop();
      const children = this.getChildren(node?.id!);

      this.result.push(...children);
      if (children.length > 0) this.stack.push(...children);
    }

    return this.result;
  }

  getAllParents(id: number) {
    this.stack = [this.getItem(id)];
    this.result = [];

    while (this.stack.length > 0) {
      const node = this.stack.pop();
      const parent = this.itemArray.find((item) => node?.parent === item.id);
      if (parent) this.result.push(parent);
      if (parent?.parent !== "root") this.stack.push(parent!);
    }

    return this.result;
  }
}

const items = [
  { id: 1, parent: "root" },
  { id: 2, parent: 1, type: "test" },
  { id: 3, parent: 1, type: "test" },

  { id: 4, parent: 2, type: "test" },
  { id: 5, parent: 2, type: "test" },
  { id: 6, parent: 2, type: "test" },

  { id: 7, parent: 4, type: null },
  { id: 8, parent: 4, type: null },
];

const ts = new TreeStore(items);

console.log("ts.getAll()", ts.getAll());
console.log("ts.getItem(7)", ts.getItem(7));
console.log("ts.getChildren(4) ", ts.getChildren(4));
console.log("ts.getChildren(5) ", ts.getChildren(5));
console.log("ts.getChildren(2) ", ts.getChildren(2));
console.log("ts.getAllChildren(2)  ", ts.getAllChildren(2));
console.log("ts.getAllParents(7)  ", ts.getAllParents(7));
