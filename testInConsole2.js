// let testObject = {
//   fisrtNode: {
//     name: "fisrtNode",
//     layer: 1,
//     secondNode: {
//       name: "secondNode",
//       layer: 2,
//       thirdNode: {
//         name: "thirdNode",
//         layer: 3,
//       },
//     },
//   },
// };

// let childObject = testObject.fisrtNode.secondNode;
// childObject.plugsAttributes = { test: "test" };
// console.log(childObject);

// function test() {
//   console.log("test");
//   function sayHello() {
//     console.log("hello");
//   }
// }

// test.sayHello();

// class MyClass {
//   outProperty = "outProperty";

//   constructor() {
//     this.myProperty = "Hello, world!";
//   }

//   myMethod() {
//     console.log(this.myProperty);
//     console.log(this.outProperty);
//   }
// }

// const myObject = new MyClass();
// myObject.myMethod(); // 输出 "Hello, world!"

// class Person {
//   sayHello() {
//     console.log("Hello, world!");
//   }
// }

// Person.prototype.sayHello = function (name) {
//   this.sayHello();
//   console.log("by " + name + "!");
// };

// const person = new Person();
// person.sayHello("Bob");

// const filterArrray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((item) => {
//   return ![1, 3, 5, 7, 9].includes(item);
// });
// console.log(filterArrray);

// function test() {
//   if (this.scope) {
//     console.log(test.scope);
//   }
// }

// test.scope = "scope";

// let test2 = {};
// test2["hello"].type = "type";
// console.log(test2);

// let object = { myMap: new Map() };

// let mapKeyObject = { key: "key" };
// object.myMap.set(mapKeyObject, "world");
// console.log(object.myMap.get(mapKeyObject));

// class FatherClass {
//   constructor(backImage) {
//     this.backImage = backImage;
//   }

//   showMyBackImage = () => {
//     console.log(this.backImage);
//   };
// }

// class ChildClass extends FatherClass {
//   constructor() {
//     super("backImage from child");
//   }
// }

// let initFatherClass = new FatherClass("backImage from father");

// let initChildClass = new ChildClass();
// initChildClass.showMyBackImage();

// console.log(initFatherClass instanceof FatherClass);
// console.log(initFatherClass instanceof ChildClass);
// console.log(initChildClass instanceof FatherClass);

let testObject = {
  name: "testObject",
  sayHello: function () {
    console.log("hello");
  },
  detectAttribute: function () {
    console.log("something" in this);
    console.log("name" in this);
  },
};

testObject.detectAttribute();
