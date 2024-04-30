"use client";

import { useEffect, useState } from "react";
import { getData } from "@/app/api/api-utils";
import { endpoints } from "@/app/api/config";
import { useUserStore } from "@/app/store/user-store";
import { useSettingsStore } from "@/app/store/settings-store";

import { ReleasePlayer } from "@/app/components/Release/ReleasePlayer";

export default function Release(props) {
  const userStore = useUserStore();
  const settingsStore = useSettingsStore();
  const [releaseInfo, setReleaseInfo] = useState();

  useEffect(() => {
    async function _fetchInfo() {
      const release = await getData(`${endpoints.release}/${props.id}`);
      setReleaseInfo(release);
    }
    if (props.params.id) {
      _fetchInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* <article class="no-padding">
        <div class="grid no-space">
          <div class="s6">
            <img class="responsive" src={releaseInfo.release.image} />
          </div>
          <div class="s6">
            <div class="padding">
              <h5>Title</h5>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <nav>
                <button class="border round">Button</button>
              </nav>
            </div>
          </div>
        </div>
      </article> */}

      <ReleasePlayer id={props.params.id} />
    </>
  );
}
