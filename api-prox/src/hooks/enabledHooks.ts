import { Hook } from ".";
import thirdPartyReleaseRatingHook from "./show3rdPartyReleaseRating.js"; // Импортирует .ts как .js

export const enabledHooks: Hook[] = [thirdPartyReleaseRatingHook];
export default enabledHooks;
