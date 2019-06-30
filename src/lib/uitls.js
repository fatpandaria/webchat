export const genRandomStr = (length)=>{
    let str = Math.random().toString(36) + Math.random().toString(36);
    return str.substr(2,length);
}