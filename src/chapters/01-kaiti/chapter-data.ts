export type DemoIcon = 'text' | 'image' | 'video';

export interface KaitiGifItem {
  id: DemoIcon;
  src: string;
  title: string;
  subtitle: string;
  duration: number;
}

export const kaitiGifItems: KaitiGifItem[] = [
  {
    id: 'text',
    src: '/chapters/01-kaiti/gif/text-generation.gif',
    title: '文字生成',
    subtitle: '自回归语言模型',
    duration: 10000,
  },
  {
    id: 'image',
    src: '/chapters/01-kaiti/gif/image-generation.gif',
    title: '图像生成',
    subtitle: '视觉生成网络',
    duration: 10000,
  },
  {
    id: 'video',
    src: '/chapters/01-kaiti/gif/video-generation.gif',
    title: '视频生成',
    subtitle: '时空扩散模型',
    duration: 13000,
  },
];