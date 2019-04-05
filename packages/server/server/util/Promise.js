
function defaultOnError(p, val) {
    return p.catch(() => {}).then(x => x || val)
}

export { defaultOnError }
