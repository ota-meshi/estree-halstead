v = function fn1() {}
v = function fn2(a) {}
v = function fn3(a, a2) {}
v = function * fn4() {}
v = async function * fn5() {}
const object = {
    fn1() {},
    fn2(a) {},
    fn3(a, a2) {},
    *fn4() {},
    async fn5() {}
}
