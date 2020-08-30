// Another user defined script (except main.js)

const arr = [1, 2, 3];
let [one, two, three] = arr;

const obj1 = {
  foo: 'bar',
  x: 42
};
const obj2 = {
  foo: 'bar',
  y: 5
};
const merge = (...objects) => ({
  ...objects
});

let mergedObj = merge(obj1, obj2);
console.log(mergedObj);
