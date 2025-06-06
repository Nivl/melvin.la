import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { FaUser } from 'react-icons/fa';
import { FaUserGroup } from 'react-icons/fa6';
import { HiMiniUserGroup } from 'react-icons/hi2';

import { type FortniteData } from '#backend/api';
import { humanizeDuration, rateStr } from '#utils';

export const TableMobile = ({
  data,
  isLoading,
}: {
  data?: FortniteData;
  isLoading: boolean;
}) => {
  return (
    <>
      {(isLoading || data?.stats.all.solo) && (
        <>
          <h3 className="mb-3 flex items-center gap-3">
            <FaUser /> <span>Solo Stats</span>
          </h3>
          <Table
            className="mb-10 text-center"
            hideHeader
            aria-label="Solo stats"
            isStriped
          >
            <TableHeader>
              <TableColumn>Stat</TableColumn>
              <TableColumn>Value</TableColumn>
            </TableHeader>
            <TableBody isLoading={isLoading}>
              <TableRow>
                <TableCell>Game Played</TableCell>
                <TableCell>{data?.stats.all.solo?.matches}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Wins</TableCell>
                <TableCell>{data?.stats.all.solo?.wins}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Win Rate</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.solo?.wins ?? 0,
                    data?.stats.all.solo?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Kill/Death rate</TableCell>
                <TableCell>
                  {Math.ceil((data?.stats.all.solo?.kd ?? 0) * 100) / 100}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Top 10 rate</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.solo?.top10 ?? 0,
                    data?.stats.all.solo?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Top 25 rate</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.solo?.top25 ?? 0,
                    data?.stats.all.solo?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Time Played</TableCell>
                <TableCell>
                  {humanizeDuration(data?.stats.all.solo?.minutesPlayed ?? 0)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}

      {(isLoading || data?.stats.all.duo) && (
        <>
          <h3 className="mb-3 flex items-center gap-3">
            <FaUserGroup /> <span>Duo Stats</span>
          </h3>
          <Table
            hideHeader
            aria-label="Duo stats"
            className="mb-10 text-center"
            isStriped
          >
            <TableHeader>
              <TableColumn>Stat</TableColumn>
              <TableColumn>Value</TableColumn>
            </TableHeader>
            <TableBody isLoading={isLoading}>
              <TableRow>
                <TableCell>Game Played</TableCell>
                <TableCell>{data?.stats.all.duo?.matches}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Wins</TableCell>
                <TableCell>{data?.stats.all.duo?.wins}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Win Rate</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.duo?.wins ?? 0,
                    data?.stats.all.duo?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Kill/Death rate</TableCell>
                <TableCell>
                  {Math.ceil((data?.stats.all.duo?.kd ?? 0) * 100) / 100}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Top 5 rate</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.duo?.top5 ?? 0,
                    data?.stats.all.duo?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Top 12 rate</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.duo?.top12 ?? 0,
                    data?.stats.all.duo?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Time Played</TableCell>
                <TableCell>
                  {humanizeDuration(data?.stats.all.duo?.minutesPlayed ?? 0)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}
      {(isLoading || data?.stats.all.squad) && (
        <>
          <h3 className="mb-3 flex items-center gap-3">
            <HiMiniUserGroup /> <span>Trio / Squad Stats</span>
          </h3>
          <Table
            className="text-center"
            hideHeader
            aria-label="Trio / Squad stats"
            isStriped
          >
            <TableHeader>
              <TableColumn>Stat</TableColumn>
              <TableColumn>Value</TableColumn>
            </TableHeader>
            <TableBody isLoading={isLoading}>
              <TableRow>
                <TableCell>Game Played</TableCell>
                <TableCell>{data?.stats.all.squad?.matches}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Wins</TableCell>
                <TableCell>{data?.stats.all.squad?.wins}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Win Rate</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.squad?.wins ?? 0,
                    data?.stats.all.squad?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Kill/Death rate</TableCell>
                <TableCell>
                  {Math.ceil((data?.stats.all.solo?.kd ?? 0) * 100) / 100}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Top 3 rate</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.squad?.top3 ?? 0,
                    data?.stats.all.squad?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Top 6 rate</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.squad?.top6 ?? 0,
                    data?.stats.all.squad?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Time Played</TableCell>
                <TableCell>
                  {humanizeDuration(data?.stats.all.squad?.minutesPlayed ?? 0)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
};
