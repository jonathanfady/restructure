const obj = {};
for (let i = 0; i < 1000000; i++) {
  obj[`key${i}`] = i;
}

// Approach 1: for-in loop
let startTime = performance.now();
let keys = [];
for (let key in obj) {
  keys.push(key);
}
let endTime = performance.now();
console.log(`for-in loop took ${endTime - startTime} milliseconds`);

// Approach 2: for-of loop with keys
startTime = performance.now();
keys = [];
for (let key of Object.keys(obj)) {
  keys.push(key);
}
endTime = performance.now();
console.log(`for-of loop with keys took ${endTime - startTime} milliseconds`);

// Approach 3: for-of loop with entries
startTime = performance.now();
keys = [];
for (let [key, value] of Object.entries(obj)) {
  keys.push(key);
}
endTime = performance.now();
console.log(`for-of loop with entries took ${endTime - startTime} milliseconds`);

// String interpolation
let start = performance.now();
for (let i = 0; i < 100000; i++) {
  const str = `Hello, ${i} world!`;
}
let end = performance.now();
console.log(`String interpolation took ${end - start} milliseconds`);

// String concatenation
start = performance.now();
for (let i = 0; i < 100000; i++) {
  const str = 'Hello, ' + i + ' world!';
}
end = performance.now();
console.log(`String concatenation took ${end - start} milliseconds`);
