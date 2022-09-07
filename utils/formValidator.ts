export const usernameAndPasswordValidator = (usernameOrPassword: string) => {
    const hasEightChars = new RegExp(/^[\w|\W]{8,24}$/);
    return hasEightChars.test(usernameOrPassword);
}

export const emailAddressValidator = (usernameOrPassword: string) => {
    const validEmailFormat = new RegExp(/^[\w|\W]{1,64}@[\w|\W]{1,255}$/);
    return validEmailFormat.test(usernameOrPassword);
}
