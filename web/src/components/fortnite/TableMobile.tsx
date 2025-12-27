import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import { useTranslations } from 'next-intl';
import { FaUser } from 'react-icons/fa';
import { FaUserGroup } from 'react-icons/fa6';
import { HiMiniUserGroup } from 'react-icons/hi2';

import { type FortniteData } from '#backend/api';
import { humanizeDuration, rateStr } from '#utils/fortnite';

export const TableMobile = ({
  data,
  isLoading,
}: {
  data?: FortniteData;
  isLoading: boolean;
}) => {
  const rootT = useTranslations();
  const t = useTranslations('fortnite.data');

  return (
    <>
      {(isLoading || data?.stats.all.solo) && (
        <>
          <h3 className="mb-3 flex items-center gap-3">
            <FaUser /> <span>{t('solo')}</span>
          </h3>
          <Table
            className="mb-10 text-center"
            hideHeader
            aria-label={t('solo')}
            isStriped
          >
            <TableHeader>
              <TableColumn>{t('stat')}</TableColumn>
              <TableColumn>{t('value')}</TableColumn>
            </TableHeader>
            <TableBody isLoading={isLoading}>
              <TableRow>
                <TableCell>{t('gamePlayed')}</TableCell>
                <TableCell>{data?.stats.all.solo?.matches}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('wins')}</TableCell>
                <TableCell>{data?.stats.all.solo?.wins}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('winRate')}</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.solo?.wins ?? 0,
                    data?.stats.all.solo?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('kd')}</TableCell>
                <TableCell>
                  {Math.ceil((data?.stats.all.solo?.kd ?? 0) * 100) / 100}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('top10rate')}</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.solo?.top10 ?? 0,
                    data?.stats.all.solo?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('top25rate')}</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.solo?.top25 ?? 0,
                    data?.stats.all.solo?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('timePlayed')}</TableCell>
                <TableCell>
                  {humanizeDuration(
                    rootT,
                    data?.stats.all.solo?.minutesPlayed ?? 0,
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}

      {(isLoading || data?.stats.all.duo) && (
        <>
          <h3 className="mb-3 flex items-center gap-3">
            <FaUserGroup /> <span>{t('duo')}</span>
          </h3>
          <Table
            hideHeader
            aria-label={t('duo')}
            className="mb-10 text-center"
            isStriped
          >
            <TableHeader>
              <TableColumn>{t('stat')}</TableColumn>
              <TableColumn>{t('value')}</TableColumn>
            </TableHeader>
            <TableBody isLoading={isLoading}>
              <TableRow>
                <TableCell>{t('gamePlayed')}</TableCell>
                <TableCell>{data?.stats.all.duo?.matches}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('wins')}</TableCell>
                <TableCell>{data?.stats.all.duo?.wins}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('winRate')}</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.duo?.wins ?? 0,
                    data?.stats.all.duo?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('kd')}</TableCell>
                <TableCell>
                  {Math.ceil((data?.stats.all.duo?.kd ?? 0) * 100) / 100}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('top10rate')}</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.duo?.top5 ?? 0,
                    data?.stats.all.duo?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('top25rate')}</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.duo?.top12 ?? 0,
                    data?.stats.all.duo?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('timePlayed')}</TableCell>
                <TableCell>
                  {humanizeDuration(
                    rootT,
                    data?.stats.all.duo?.minutesPlayed ?? 0,
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}
      {(isLoading || data?.stats.all.squad) && (
        <>
          <h3 className="mb-3 flex items-center gap-3">
            <HiMiniUserGroup /> <span>{t('squad')}</span>
          </h3>
          <Table
            className="text-center"
            hideHeader
            aria-label={t('squad')}
            isStriped
          >
            <TableHeader>
              <TableColumn>{t('stat')}</TableColumn>
              <TableColumn>{t('value')}</TableColumn>
            </TableHeader>
            <TableBody isLoading={isLoading}>
              <TableRow>
                <TableCell>{t('gamePlayed')}</TableCell>
                <TableCell>{data?.stats.all.squad?.matches}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('wins')}</TableCell>
                <TableCell>{data?.stats.all.squad?.wins}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('winRate')}</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.squad?.wins ?? 0,
                    data?.stats.all.squad?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('kd')}</TableCell>
                <TableCell>
                  {Math.ceil((data?.stats.all.solo?.kd ?? 0) * 100) / 100}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('top10rate')}</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.squad?.top3 ?? 0,
                    data?.stats.all.squad?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('top25rate')}</TableCell>
                <TableCell>
                  {rateStr(
                    data?.stats.all.squad?.top6 ?? 0,
                    data?.stats.all.squad?.matches ?? 0,
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{t('timePlayed')}</TableCell>
                <TableCell>
                  {humanizeDuration(
                    rootT,
                    data?.stats.all.squad?.minutesPlayed ?? 0,
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
};
