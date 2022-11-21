// https://github.com/microsoft/TypeScript/pull/47607
function makeBox<T>(value: T) {
    return { value };
};

// TODO: https://github.com/microsoft/TypeScript/issues/50161#issuecomment-1249500875
const makeStringBox = /*@__IGNORE__*/(makeBox/*@__IGNORE__*/)<string>;  // (value: string) => { value: string }
const stringBox = makeStringBox('abc');  // { value: string }

const ErrorMap = Map<string, Error>;  // new () => Map<string, Error>
const errorMap = new ErrorMap();  // Map<string, Error>
