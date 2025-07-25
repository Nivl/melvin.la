import type { Meta, StoryObj } from '@storybook/nextjs';

import { CodeBlock } from './CodeBlock';

const meta = {
  title: 'Components/CodeBlock',
  component: CodeBlock,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: `// https://en.m.wikipedia.org/wiki/Fast_inverse_square_root
float Q_rsqrt( float number )
{
	long i;
	float x2, y;
	const float threehalfs = 1.5F;

	x2 = number * 0.5F;
	y  = number;
	i  = * ( long * ) &y;                       // evil floating point bit level hacking
	i  = 0x5f3759df - ( i >> 1 );               // what the fuck?
	y  = * ( float * ) &i;
	y  = y * ( threehalfs - ( x2 * y * y ) );   // 1st iteration
//	y  = y * ( threehalfs - ( x2 * y * y ) );   // 2nd iteration, this can be removed

	return y;
}`,
    language: 'c',
    showlinenumbers: true,
  },
};
