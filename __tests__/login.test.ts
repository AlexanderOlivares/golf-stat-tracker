import { usernameAndPasswordValidator, emailAddressValidator } from "../utils/formValidator"

test("validate username and password", () => {
    expect(usernameAndPasswordValidator("")).toEqual(false);
    expect(usernameAndPasswordValidator("2short")).toEqual(false);
    expect(usernameAndPasswordValidator("wayTooLongPasswordOverTheCharLimitOf24")).toEqual(false);
    expect(usernameAndPasswordValidator("validLength")).toEqual(true);
    expect(usernameAndPasswordValidator("specialChars123!@$")).toEqual(true);
    expect(usernameAndPasswordValidator("spaces okay")).toEqual(true);
    expect(usernameAndPasswordValidator("12345678")).toEqual(true);
  });


test("validate email address", () => {
    expect(emailAddressValidator("")).toEqual(false);
    expect(emailAddressValidator("ab")).toEqual(false);
    expect(emailAddressValidator("abc")).toEqual(false);
    expect(emailAddressValidator("@ab")).toEqual(false);
    expect(emailAddressValidator("@abc")).toEqual(false);
    expect(emailAddressValidator("useremail.com")).toEqual(false);
    expect(emailAddressValidator("user.email.com")).toEqual(false);
    expect(emailAddressValidator("ab@c")).toEqual(true);
    expect(emailAddressValidator("user@email.com")).toEqual(true);
    expect(emailAddressValidator("user@email.io")).toEqual(true);
    expect(emailAddressValidator("user12!@email.io")).toEqual(true);
    expect(emailAddressValidator("user_$$$@aol.com")).toEqual(true);
  });