// create cookie
export const setCookie = (name, value, minutes) => {
  let expires = "";
  if (minutes) {
    const date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`; // using toUTCString
  }
  // eslint-disable-next-line no-undef
  document.cookie = `${name}=${value}${expires}; path=/`;
};

// retrieve cookie
export const getCookie = (cookieName) => {
  const name = `${cookieName}=`;
  let returnCookie = "";
  // eslint-disable-next-line no-undef
  const decodedCookie = decodeURIComponent(document?.cookie);
  const cookieArray = decodedCookie?.split(";");
  if (cookieArray?.length > 0) {
    // eslint-disable-next-line array-callback-return
    cookieArray?.map((item) => {
      let cookie = item;
      while (cookie?.charAt(0) === " ") {
        cookie = cookie?.substring(1);
      }
      if (cookie?.indexOf(name) === 0) {
        returnCookie = cookie?.substring(name?.length, cookie?.length);
      }
    });
    return returnCookie;
  }
};

// force expired cookie or delete
export const deleteCookie = (name) => {
  // eslint-disable-next-line no-undef
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

export const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};
