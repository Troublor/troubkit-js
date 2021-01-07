let forbidden = true;
setTimeout(() => {
    forbidden = false;
}, 200);

// eslint-disable-next-line no-undef
module.exports = function (v) {
    // eslint-disable-next-line no-undef
    if (forbidden) {
        throw new Error("forbidden");
    }
    return v + 1;
};
