/** Full project film from Vimeo, sized 16:9. dnt=1 keeps Vimeo from setting tracking cookies. */
export default function VimeoFilm({ id, title }: { id: string; title: string }) {
  const src = `https://player.vimeo.com/video/${id}?dnt=1&title=0&byline=0&portrait=0`;
  return (
    <figure className="w-film">
      <iframe src={src} title={title} allow="fullscreen; picture-in-picture" allowFullScreen />
    </figure>
  );
}
