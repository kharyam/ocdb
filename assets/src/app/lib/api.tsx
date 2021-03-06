function memoize(method) {
    let cache = {};
    return async function(...argum) {
        let args = JSON.stringify(argum);
        cache[args] = cache[args] || method.apply(undefined, argum);
        return cache[args];
    };
}

export var components = memoize(async function components() {
    return fetch('/api/v1/components').then(response => response.json()).then(addExtraProducts)
});

const extraProducts = [
];

function addExtraProducts(products) {
    return new Promise(
        function(resolve, reject) {
            resolve(extraProducts.concat(products).sort(
                function(a, b){
                    return a['name'] < b['name'] ? -1 : 1
                }))
        }
    )
}

export var componentControls = memoize(async function(componentId: string) {
    return fetch('/api/v1/components/' + componentId + '/controls')
        .then(response => response.json())
        .then((data) => {
            const nist80053 = data['controls']['NIST-800-53'];
            data['controls'] = Array.prototype.concat.apply([], Object.keys(nist80053).map(function(k, _) { return nist80053[k]; }));
            return data
        })
});

export var certifications = memoize(async function() {
    return fetch('/api/v1/certifications')
        .then(response => response.json())
        .then(data => {
            return Array.prototype.concat.apply([], Object.keys(data).map(function(k, _) {
                return {Key: k,
                        Controls: data[k].Controls['NIST-800-53']}
            }))
        })
})

export var statistics = memoize(async function(componentId: string) {
        return fetch('/api/v1/components/' + componentId + '/statistics')
            .then(response => response.json())
})
