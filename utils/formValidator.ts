export const usernameAndPasswordValidator = (usernameOrPassword: string) => {
    const hasEightChars = new RegExp(/^[\w|\W]{8,24}$/);
    return hasEightChars.test(usernameOrPassword);
}

export const emailAddressValidator = (usernameOrPassword: string) => {
    const validEmailFormat = new RegExp(/^[\w|\W]{1,64}@[\w|\W]{1,255}$/);
    return validEmailFormat.test(usernameOrPassword);
}

export const isEmptyObject = (obj: any)=> {
    return Object.keys(obj).length === 0;
}

export const validUserAddedCourseFields = (obj: any)=> {
    let totalkeys = 0;
    let uuidSeen = false;
    for (let [key, val] of Object.entries(obj)){
        if (!val) return false;
        if (key === "unverifiedCourseId") uuidSeen = true;
        totalkeys++;
    }
    return uuidSeen && totalkeys === 4;
}