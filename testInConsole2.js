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

function test() {
  if (this.scope) {
    console.log(test.scope);
  }
}

test.scope = "scope";
