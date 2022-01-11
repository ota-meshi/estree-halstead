function * fn () {
    yield 42
    yield * [42]
    yield (42, 1)
}
