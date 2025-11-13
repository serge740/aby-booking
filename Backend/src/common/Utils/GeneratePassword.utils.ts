export function generatePassword(){
    const password = Math.floor(100000 + Math.random() * 900000).toString();
    return password;
}