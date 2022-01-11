function fn() {
    foo: for (const e of list) {
        if (a) {
            break
        }
        if (a) {
            break foo
        }
        if (a) {
            continue
        }
        if (a) {
            continue foo
        }
    }
    if (a) {
        return
    }
    if (a) {
        return foo
    }
}
