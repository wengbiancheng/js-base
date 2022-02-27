// 如果放的是普通值，会将这个
// Promise.resolve(1).then(data => {
//     console.log("得到的值是", data);
// });


// function returnPromise() {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve("promise resolve测试");
//         }, 2000);
//     });
// }
// Promise.resolve(returnPromise()).then(data => {
//     console.log("resolve promise 得到的值是", data);
// });


// Promise.resolve 和 Promise.reject
// Promise.race 、Promise.catch 、Promise.try方法


