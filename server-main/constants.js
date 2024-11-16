export const UserLoginType = {
    GOOGLE: "GOOGLE",
    GITHUB: "GITHUB",
    EMAIL_PASSWORD: "EMAIL_PASSWORD",
  };
  
  export const AvailableSocialLogins = Object.values(UserLoginType);

export const BUILD_STATUS = {
   NOT_STARTED: 'not-started',
   QUEUED: 'queued',
   IN_PROGRESS: 'in-progress',
   ACTIVE: 'active',
   ERROR: 'error'
}