/* eslint-disable import/no-default-export */

import { heroui } from '@heroui/react';
import plugin from 'tailwindcss/plugin.js';

const herouiPlugin: ReturnType<typeof plugin> = heroui();

export default herouiPlugin;
