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

function test() {
  console.log("test");
  function sayHello() {
    console.log("hello");
  }
}

test.sayHello();