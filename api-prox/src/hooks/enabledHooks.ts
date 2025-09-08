import { Hook } from "./index.js";
import thirdPartyReleaseRatingHook from "./show3rdPartyReleaseRating.js";
import customUserRoles from "./addUserRoles.js"

export const enabledHooks: Hook[] = [thirdPartyReleaseRatingHook, customUserRoles];
export default enabledHooks;
