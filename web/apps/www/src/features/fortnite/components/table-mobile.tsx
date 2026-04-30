import { Skeleton, Table } from "@heroui/react";
import { useTranslations } from "next-intl";
import { FaUser } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";

import { FortniteStatsData } from "#features/fortnite/models";
import { humanizeDuration, rateStr } from "#features/fortnite/utils.ts";

export const TableMobile = ({
  data,
  isLoading,
}: {
  data?: FortniteStatsData;
  isLoading: boolean;
}) => {
  const rootT = useTranslations();
  const t = useTranslations("fortnite.data");

  const skeletonRow = <Skeleton className="h-6 w-10" />;

  return (
    <>
      {(isLoading || data?.stats.all?.overall) && (
        <>
          <h3 className="mb-3 flex items-center gap-3">
            <FaUser /> <span>{t("mobileTitles.overall")}</span>
          </h3>
          <Table className="mb-10 text-center">
            <Table.Content aria-label={t("mobileTitles.overall")}>
              <Table.Header className="sr-only">
                <Table.Column isRowHeader />
                <Table.Column />
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>{t("gamePlayed")}</Table.Cell>
                  <Table.Cell>
                    {isLoading ? skeletonRow : data?.stats.all?.overall?.matches}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("wins")}</Table.Cell>
                  <Table.Cell>
                    {isLoading ? skeletonRow : data?.stats.all?.overall?.wins}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("winRate")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : rateStr(
                          data?.stats.all?.overall?.wins ?? 0,
                          data?.stats.all?.overall?.matches ?? 0,
                        )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("kd")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : Math.ceil((data?.stats.all?.overall?.kd ?? 0) * 100) / 100}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("top10rate")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : rateStr(
                          data?.stats.all?.overall?.top10 ?? 0,
                          data?.stats.all?.overall?.matches ?? 0,
                        )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("top25rate")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : rateStr(
                          data?.stats.all?.overall?.top25 ?? 0,
                          data?.stats.all?.overall?.matches ?? 0,
                        )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("timePlayed")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : humanizeDuration(rootT, data?.stats.all?.overall?.minutesPlayed ?? 0)}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Content>
          </Table>
        </>
      )}

      {(isLoading || data?.stats.all?.solo) && (
        <>
          <h3 className="mb-3 flex items-center gap-3">
            <FaUser /> <span>{t("mobileTitles.solo")}</span>
          </h3>
          <Table className="mb-10 text-center">
            <Table.Content aria-label={t("solo")}>
              <Table.Header className="sr-only">
                <Table.Column isRowHeader />
                <Table.Column />
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>{t("gamePlayed")}</Table.Cell>
                  <Table.Cell>
                    {isLoading ? skeletonRow : data?.stats.all?.solo?.matches}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("wins")}</Table.Cell>
                  <Table.Cell>{isLoading ? skeletonRow : data?.stats.all?.solo?.wins}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("winRate")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : rateStr(
                          data?.stats.all?.solo?.wins ?? 0,
                          data?.stats.all?.solo?.matches ?? 0,
                        )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("kd")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : Math.ceil((data?.stats.all?.solo?.kd ?? 0) * 100) / 100}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("top10rate")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : rateStr(
                          data?.stats.all?.solo?.top10 ?? 0,
                          data?.stats.all?.solo?.matches ?? 0,
                        )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("top25rate")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : rateStr(
                          data?.stats.all?.solo?.top25 ?? 0,
                          data?.stats.all?.solo?.matches ?? 0,
                        )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("timePlayed")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : humanizeDuration(rootT, data?.stats.all?.solo?.minutesPlayed ?? 0)}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Content>
          </Table>
        </>
      )}

      {(isLoading || data?.stats.all?.duo) && (
        <>
          <h3 className="mb-3 flex items-center gap-3">
            <FaUserGroup /> <span>{t("mobileTitles.duo")}</span>
          </h3>
          <Table className="mb-10 text-center">
            <Table.Content aria-label={t("duo")}>
              <Table.Header className="sr-only">
                <Table.Column isRowHeader />
                <Table.Column />
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>{t("gamePlayed")}</Table.Cell>
                  <Table.Cell>{isLoading ? skeletonRow : data?.stats.all?.duo?.matches}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("wins")}</Table.Cell>
                  <Table.Cell>{isLoading ? skeletonRow : data?.stats.all?.duo?.wins}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("winRate")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : rateStr(
                          data?.stats.all?.duo?.wins ?? 0,
                          data?.stats.all?.duo?.matches ?? 0,
                        )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("kd")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : Math.ceil((data?.stats.all?.duo?.kd ?? 0) * 100) / 100}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("top10rate")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : rateStr(
                          data?.stats.all?.duo?.top5 ?? 0,
                          data?.stats.all?.duo?.matches ?? 0,
                        )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("top25rate")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : rateStr(
                          data?.stats.all?.duo?.top12 ?? 0,
                          data?.stats.all?.duo?.matches ?? 0,
                        )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("timePlayed")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : humanizeDuration(rootT, data?.stats.all?.duo?.minutesPlayed ?? 0)}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Content>
          </Table>
        </>
      )}
      {(isLoading || data?.stats.all?.squad) && (
        <>
          <h3 className="mb-3 flex items-center gap-3">
            <HiMiniUserGroup /> <span>{t("mobileTitles.squad")}</span>
          </h3>
          <Table className="text-center">
            <Table.Content aria-label={t("squad")}>
              <Table.Header className="sr-only">
                <Table.Column isRowHeader />
                <Table.Column />
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>{t("gamePlayed")}</Table.Cell>
                  <Table.Cell>
                    {isLoading ? skeletonRow : data?.stats.all?.squad?.matches}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("wins")}</Table.Cell>
                  <Table.Cell>{isLoading ? skeletonRow : data?.stats.all?.squad?.wins}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("winRate")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : rateStr(
                          data?.stats.all?.squad?.wins ?? 0,
                          data?.stats.all?.squad?.matches ?? 0,
                        )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("kd")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : Math.ceil((data?.stats.all?.squad?.kd ?? 0) * 100) / 100}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("top10rate")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : rateStr(
                          data?.stats.all?.squad?.top3 ?? 0,
                          data?.stats.all?.squad?.matches ?? 0,
                        )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("top25rate")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : rateStr(
                          data?.stats.all?.squad?.top6 ?? 0,
                          data?.stats.all?.squad?.matches ?? 0,
                        )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{t("timePlayed")}</Table.Cell>
                  <Table.Cell>
                    {isLoading
                      ? skeletonRow
                      : humanizeDuration(rootT, data?.stats.all?.squad?.minutesPlayed ?? 0)}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Content>
          </Table>
        </>
      )}
    </>
  );
};
