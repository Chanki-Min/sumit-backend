export type BlockProperty =
  | plain_text_props
  | heading_props
  | to_do_list_props
  | bulleted_list_props
  | numbered_list_props
  | media_image
  | media_video
  | media_file
  | carousel_slide
  | simple_margin
  | grid;

export type BlockTypes =
  | 'plain_text'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'to_do_list'
  | 'bulleted_list'
  | 'numbered_list'
  | 'media_image'
  | 'media_video'
  | 'media_file'
  | 'carousel_slide'
  | 'simple_margin'
  | 'grid';

interface plain_text_props {
  text: string; // html strings, should be sanitized
}

interface heading_props {
  text: string; // html strings, should be sanitized
}

interface to_do_list_props {
  checked: boolean;
  text: string; // html strings, should be sanitized
}

interface bulleted_list_props {
  text: string; // html strings, should be sanitized
}

interface numbered_list_props {
  text: string; // html strings, should be sanitized
}

interface media_image {
  width: number;
  height: number;
  src: string; // URL 주소
}

interface media_video {
  width: number;
  height: number;
  src: string; // URL 주소
}

interface media_file {
  title: string;
  size: number; // 파일 사이즈
  src: string; // URL 주소
}

interface carousel_slide {
  enable_index_numbers: boolean;
  enalble_navigation_buttons: boolean;
}

interface simple_margin {
  height: number;
}

interface grid {
  row_size: number;
  col_size: number;

  row_ratios: number[];
  col_ratios: number[];

  width: number;
  height: number;
}
