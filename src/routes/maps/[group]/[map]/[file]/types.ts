export enum FileType
{
	PreviewJpg = 'preview.jpg',
	ThumbnailWebp = 'thumbnail.webp',
	ImagePng = 'image.png',
	ImageSvg = 'image.svg',
	DataCsv = 'data.csv'
}


export interface Params
{
	group: string;
	map: string;
	file: FileType;
}
