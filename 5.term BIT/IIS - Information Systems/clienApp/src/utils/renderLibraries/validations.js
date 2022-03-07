/**
 * Author: Lukáš Plevač
 */
export function nonNegativeInteger(getValues, field){
    let numb = Number(getValues(field));
    if(numb === null || numb === undefined || numb === "") {return true; }
    let sign = Math.sign(numb);
    if(isNaN(sign) || sign < 0){
        return "Minimal capacity is zero"
    }
    if( ! (Number(numb) === numb && (numb % 1 === 0))){
        return field+" must be a non negative integer";
    }
    return true;
}


export function nonNegativeNumber(getValues, field){
    let numb = Number(getValues(field));
    if(numb === null || numb === undefined || numb === "") {return true; }
    let sign = Math.sign(numb);
    if(isNaN(sign) || sign < 0){
        return "Are you sure you will be paying to listeners?"
    }
    return true;
}