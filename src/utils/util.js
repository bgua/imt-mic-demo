export function dataFilter(data=[], fieldName, fieldValue) {
    let result = [];
    if (isValidArray(data)) {
        result = data.filter(d => d[fieldName] === fieldValue);
    }
    return result;
}

export function dataFilter2Map(data=[], fieldName, fieldValue) {
    const map = new Map();
    if (isValidArray(data)) {
       data.forEach(d => {
        if (d[fieldName] === fieldValue) {
            map.set(d.id, d);
        }
       });
    }
    return map;
}

function isValidArray(data) {
    return !!data?.length && Array.isArray(data);
}