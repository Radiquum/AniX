import { Hook } from "./index.js";
import thirdPartyReleaseRatingHook from "./show3rdPartyReleaseRating.js";

export const enabledHooks: Hook[] = [thirdPartyReleaseRatingHook];
export default enabledHooks;
