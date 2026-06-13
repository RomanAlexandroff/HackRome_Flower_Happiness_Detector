import type { FlywheelSyncState } from "../types/vineyard";

function wait(duration: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

export const flywheelService = {
  async synchronizeStudy(
    _studyId: string,
    onStateChange: (state: FlywheelSyncState) => void,
  ): Promise<FlywheelSyncState> {
    onStateChange("preparing_evidence");
    await wait(900);

    onStateChange("uploading_artifacts");
    await wait(900);

    onStateChange("synchronized");
    return "synchronized";
  },
};
